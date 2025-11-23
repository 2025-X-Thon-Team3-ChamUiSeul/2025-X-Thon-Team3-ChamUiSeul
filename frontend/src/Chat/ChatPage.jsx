// src/Chat/ChatPage.jsx
import { useState, useEffect, useCallback } from "react";
import ChatLayout from "../Components/ChatLayout";
import welfyImg from "../assets/images/welfy_origin.png";
import { LoadingWelfyAvatar } from "../Components/LoadingWelfy";
import ProgressTracker from "../Components/ProgressTracker";
import "./ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [progressList, setProgressList] = useState([]);

  const fetchSessions = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/chats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, []);

  const fetchProgress = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/progress/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProgressList(data);
      } else {
        setProgressList([]);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setProgressList([]);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", params.get("name"));
      window.history.replaceState({}, document.title, "/chat");
    }
    setUserName(localStorage.getItem("userName") || "");
    fetchSessions();
    fetchProgress();
  }, [fetchSessions, fetchProgress]);

  const loadChat = useCallback(async (chatId) => {
    if (!chatId) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
  
  const handleNewChat = useCallback(() => {
    setMessages([]); // Clear current messages
    setCurrentChatId(null); // Clear current chat ID
    setProgressList([]); // Clear the progress tracker from the UI
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    const userMsg = { sender: "user", text: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let chatId = currentChatId;
    let isNewChat = false;

    try {
      if (!chatId) {
        isNewChat = true;
        const createChatResponse = await fetch("http://localhost:8000/chats/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!createChatResponse.ok) throw new Error("Could not create new chat session.");
        const newChat = await createChatResponse.json();
        chatId = newChat.id;
        setCurrentChatId(chatId);
      }

      const messageResponse = await fetch(`http://localhost:8000/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: currentInput }),
      });
      if (!messageResponse.ok) throw new Error("Failed to send message.");
      
      const data = await messageResponse.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);

      if (isNewChat) await fetchSessions();
      await fetchProgress();
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("정말로 이 대화를 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("서버에서 채팅을 삭제하지 못했습니다.");
      
      setSessions(prev => prev.filter(s => s.id !== chatId));
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("채팅 삭제 중 오류가 발생했습니다.");
    }
  };
  
  const handleCompleteStep = async (progressId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/progress/complete-step/${progressId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        await fetchProgress();
      } else {
        alert("단계를 완료 처리하는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to complete step:", error);
      alert("오류가 발생하여 단계를 완료하지 못했습니다.");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatLayout 
      handleNewChat={handleNewChat} 
      sessions={sessions} 
      loadChat={loadChat}
      handleDeleteChat={handleDeleteChat}
    >
      <div style={{ display: 'flex', flex: 1, height: '100vh', overflow: 'hidden' }}>
        <div className="chat-container">
          {messages.length === 0 && (
            <div className="intro-wrapper">
              <img src={welfyImg} alt="welfy" className="intro-welfy" />
              <div className="intro-text">
                {userName ? `${userName}님, 안녕하세요!` : "안녕하세요!"}
                <br />
                서류 준비부터 신청까지 웰피가 함께할게요.
              </div>
            </div>
          )}
          {messages.length > 0 && (
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.sender === "bot" ? "msg bot" : "msg user"}>
                  {msg.sender === "bot" && <img src={welfyImg} className="welfy-icon" alt="welfy" />}
                  <div className={`bubble ${msg.sender}`}>{msg.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className="msg bot">
                  <LoadingWelfyAvatar interval={350} size={55} className="welfy-icon" />
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
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {progressList && progressList.length > 0 && (
          <ProgressTracker 
            progress={progressList[0]} 
            onCompleteStep={handleCompleteStep} 
          />
        )}
      </div>
    </ChatLayout>
  );
}