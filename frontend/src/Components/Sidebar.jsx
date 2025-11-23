import { useState } from "react";
import { useNavigate } from "react-router-dom";
import welfyLogo from "../assets/images/welfy_logo.png";

// 충돌 마커를 제거하고 필요한 모든 props를 통합했습니다.
export default function Sidebar({ handleNewChat, sessions, loadChat }) {
  const navigate = useNavigate(); // useNavigate 훅은 내 정보 버튼에서 사용될 수 있으므로 유지
  const [visibleCount, setVisibleCount] = useState(5); // 채팅 목록 더보기에 사용

  // 내 정보 버튼 클릭 핸들러 (Router가 설정되어 있다면 경로를 이용해 이동)
  const handleMyInfoClick = () => {
    navigate("/info"); 
  };

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
      {/* 로고 영역 */}
      <img
        src={welfyLogo}
        alt="Welfy 로고"
        style={{ width: "200px", height: "auto", marginBottom: "40px" }}
      />

      <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 새 채팅 버튼 */}
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

        {/* 내 정보 버튼 */}
        <button
          onClick={handleMyInfoClick} // useNavigate를 이용한 핸들러 사용
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
            marginBottom: "5px",
          }}
        >
          내 정보
        </button>
        
        <div style={{ marginTop: "40px", fontSize: "20px" }}>내 채팅</div>
        
        {/* 채팅 기록 목록 */}
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "10px", 
            // 높이를 지정하여 스크롤 가능하게 만듦 (예: 부모 div 높이에 따라 조정)
            // overflowY: "auto" 는 부모의 높이가 제한되어야 작동합니다.
          }}
        >
          {sessions && sessions.slice(0, visibleCount).map((session) => (
            <button
              key={session.id}
              onClick={() => loadChat(session.id)}
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
                marginBottom: "5px",
              }}
            >
              {session.title}
            </button>
          ))}
        </div>
        
        {/* 더보기 버튼 */}
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