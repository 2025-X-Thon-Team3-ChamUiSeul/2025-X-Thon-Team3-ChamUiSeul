// src/Chat/ChatPage.jsx
import { useState, useEffect, useCallback } from "react";
import ChatLayout from "../Components/ChatLayout";
import welfyImg from "../assets/images/welfy_origin.png";
import { LoadingWelfyAvatar } from "../Components/LoadingWelfy";
import "./ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      setUserName(name);
      window.history.replaceState({}, document.title, "/chat");
    } else {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }
    
    fetchSessions();
  }, []);

  const fetchSessions = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/chats/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch chat sessions:", error);
    }
  }, []);

  const loadChat = useCallback(async (chatId) => {
    if (!chatId) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const formattedMessages = data.flatMap(item => [
        { sender: 'user', text: item.message },
        { sender: 'bot', text: item.response }
      ]);
      setMessages(formattedMessages);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error("Failed to load chat messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewChat = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/chats/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const newChat = await response.json();

        await fetchSessions(); // Refresh session list
        setMessages([]);
        setCurrentChatId(newChat.id); // Set the new chat as active
        return newChat.id;
    } catch (error) {
        console.error("Failed to create new chat:", error);
    } finally {
        setIsLoading(false);
    }
  }, [fetchSessions]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let chatId = currentChatId;
    const isFirstMessage = messages.length === 0;

    // If this is the very first message in a new session
    if (!chatId) {
        const newChatId = await handleNewChat();
        if (newChatId) {
            chatId = newChatId;
        } else {
            // Handle error in creating new chat
            const errorMsg = { sender: "bot", text: "새로운 대화를 시작하는 데 실패했어요." };
            setMessages([errorMsg]);
            return;
        }
    }

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botMsg = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMsg]);

      // Refresh session list if it was the first message, so the title updates
      if (isFirstMessage) {
          fetchSessions();
      }

    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = { sender: "bot", text: "죄송해요, 답변을 생성하는 중에 오류가 발생했어요." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("정말로 이 대화를 삭제하시겠습니까?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("서버에서 채팅을 삭제하지 못했습니다.");
      }
      
      // Visually remove the chat from the list immediately for better UX
      setSessions(prevSessions => prevSessions.filter(session => session.id !== chatId));

      // If the currently active chat is the one being deleted, clear the chat view
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
      
      // Silently refetch sessions in the background to ensure sync with the server
      fetchSessions();

    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("채팅 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <ChatLayout 
      handleNewChat={handleNewChat} 
      sessions={sessions} 
      loadChat={loadChat}
      handleDeleteChat={handleDeleteChat}
    >
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="intro-wrapper">
            <img src={welfyImg} alt="welfy" className="intro-welfy" />
            <div className="intro-text">
              {userName ? `${userName}님, 안녕하세요!` : "안녕하세요!"}
              <br />
              서류의 숲에서 웰피가 길을 찾아줄게요.
            </div>
          </div>
        )}
        {messages.length > 0 && (
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === "bot" ? "msg bot" : "msg user"}
              >
                {msg.sender === "bot" && (
                  <img src={welfyImg} className="welfy-icon" alt="welfy" />
                )}
                <div className={`bubble ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="msg bot">
                <LoadingWelfyAvatar
                  interval={350}
                  size={55}
                  className="welfy-icon"
                />
                <div className="bubble bot loading">
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`input-bar ${messages.length === 0 ? "intro-bottom" : ""}`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="무엇이든 물어보세요."
          />
          <button
            onClick={sendMessage}
            className={`send-btn ${isLoading ? "sending" : ""}`}
            disabled={isLoading}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </ChatLayout>
  );
}
