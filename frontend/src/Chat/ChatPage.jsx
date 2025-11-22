// src/Chat/ChatPage.jsx
import { useState, useEffect } from "react";
import StepIndicator from "../Components/StepIndicator";
import ChatLayout from "../Components/ChatLayout";
import welfyImg from "../assets/images/welfy_origin.png";
import "./ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ⬅️ 로딩 상태 추가

  // 컴포넌트가 처음 로드될 때 URL에서 토큰과 유저 정보를 추출합니다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      // 토큰과 유저 정보를 로컬 스토리지에 저장하여 로그인 상태를 유지합니다.
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);

      setUserName(name); // 상태 업데이트

      // URL에서 토큰 정보를 제거하여 주소를 깔끔하게 정리합니다.
      window.history.replaceState({}, document.title, "/chat");
    } else {
      // 페이지 새로고침 시 로컬 스토리지에서 유저 정보 불러오기
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return; // ⬅️ 로딩 중이면 전송 방지

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true); // ⬅️ 로딩 시작

    // 웰피의 답장을 받기 위한 API 호출
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ 헤더에 토큰 추가
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMsg = { sender: "bot", text: data.response }; // ⬅️ API 응답 사용
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = {
        sender: "bot",
        text: "죄송해요, 답변을 생성하는 중에 오류가 발생했어요.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); // ⬅️ 로딩 종료
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatLayout>
      <div className="chat-container">
        {messages.length > 0 && <StepIndicator current={3} />}

        {messages.length === 0 && (
          <div className="intro-wrapper">
            <img src={welfyImg} alt="welfy" className="intro-welfy" />
            <div className="intro-text">
              {/* ⬅️ 로그인한 유저 이름 표시 */}
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