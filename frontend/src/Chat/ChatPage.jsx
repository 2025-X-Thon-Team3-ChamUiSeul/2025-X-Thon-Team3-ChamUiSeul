// src/Chat/ChatPage.jsx
import { useState } from "react";
import StepIndicator from "../Components/StepIndicator";
import ChatLayout from "../Components/ChatLayout";
import welfyImg from "../assets/images/welfy_origin.png";
import "./ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);        // ← 처음엔 아무 메시지도 없음
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // 웰피 자동 답장 (첫 메시지를 보낸 후에만 실행됨)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "웰피의 자동 답장이에요!" },
      ]);
    }, 500);

    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatLayout>
      <div className="chat-container">

        {/* 🔵 메시지가 있을 때만 단계바 표시 */}
        {messages.length > 0 && <StepIndicator current={3} />}

        {/* 🔵 첫 메시지를 보내기 전 → 인트로 화면 */}
        {messages.length === 0 && (
          <div className="intro-wrapper">
            <img src={welfyImg} alt="welfy" className="intro-welfy" />
            <div className="intro-text">
              서류의 숲에서 웰피가 길을 찾아줄게요.
            </div>
          </div>
        )}

        {/* 🔵 메시지가 있는 경우만 채팅 영역을 보여줌 */}
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

        {/* 입력창 */}
        <div className={`input-bar ${messages.length === 0 ? "intro-bottom" : ""}`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="무엇이든 물어보세요."
          />
          <button onClick={sendMessage} className="send-btn">
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