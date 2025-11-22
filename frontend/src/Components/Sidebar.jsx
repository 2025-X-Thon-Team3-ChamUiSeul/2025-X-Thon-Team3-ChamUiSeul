import { useState } from "react";

export default function Sidebar({ handleNewChat, sessions, loadChat }) {
  const [visibleCount, setVisibleCount] = useState(5);


import { useNavigate } from "react-router-dom";

import welfyLogo from "../assets/images/welfy_logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
export default function Sidebar({ handleNewChat }) {
  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#B5DBFF",
        display: "flex",
        flexDirection: "column",
        padding: "40px 20px",
        color: "#123B66",
      }}
    >
      <img
        src={welfyLogo}
        alt="Welfy 로고"
        style={{ width: "200px", height: "auto", marginBottom: "40px" }}
      />

      <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <button
          onClick={handleNewChat}
          style={{
            fontSize: "20px",
            backgroundColor: "#8ECAFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px 15px",
            cursor: "pointer",
            color: "white",
            textAlign: "left",
            width: "100%",
          }}
        >
          + 새 채팅
        </button>
        <button
          onClick={() => console.log("내 정보 clicked")} // Placeholder for future navigation
          style={{
            backgroundColor: "#F0F8FF",
            border: "none",
            borderRadius: "6px",
            color: "#123B66",
            padding: "10px",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            marginBottom: "5px" // Add some space after the button
          }}
        >
          내 정보
        </button>
        <div style={{ marginTop: "40px", fontSize: "20px" }}>내 채팅</div>
        
        {/* Chat History List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          {sessions && sessions.slice(0, visibleCount).map((session) => (
            <button
              key={session.id}
              onClick={() => loadChat(session)}
              style={{
                backgroundColor: "#F0F8FF",
                border: "none",
                borderRadius: "6px",
                color: "#123B66",
                padding: "10px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "16px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                marginBottom: "5px"
              }}
            >
              {session.title}
            </button>
          ))}
        </div>
        
        {sessions && sessions.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 5)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#123B66",
              cursor: "pointer",
              padding: "10px",
              marginTop: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            더보기
          </button>
        )}
      </nav>
    </div>
  );
}
}
}