import { useState } from "react";
import { useNavigate } from "react-router-dom";
import welfyLogo from "../assets/images/welfy_logo.png";

// 충돌 마커를 제거하고 기본 props를 합쳤습니다.
export default function Sidebar({
  handleNewChat = () => {},
  sessions = [],
  loadChat = () => {},
}) {
  const navigate = useNavigate(); // 내 정보 버튼에서 페이지 이동에 사용
  const [visibleCount, setVisibleCount] = useState(5); // 채팅 목록 보기에 사용
  const [hoverNewChat, setHoverNewChat] = useState(false);
  const [hoverMyInfo, setHoverMyInfo] = useState(false);

  // 내 정보 버튼 클릭 핸들러 (정보 입력 페이지로 이동)
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
          onMouseEnter={() => setHoverNewChat(true)}
          onMouseLeave={() => setHoverNewChat(false)}
          style={{
            fontSize: "20px",
            backgroundColor: hoverNewChat ? "#6fb7ff" : "#8ECAFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px 15px",
            cursor: "pointer",
            color: "white",
            textAlign: "left",
            width: "100%",
            transition: "background-color 0.2s ease, transform 0.15s ease",
            transform: hoverNewChat ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          + 새 채팅
        </button>

        {/* 내 정보 버튼 */}
        <button
          onClick={handleMyInfoClick} // useNavigate를 이용해 이동
          onMouseEnter={() => setHoverMyInfo(true)}
          onMouseLeave={() => setHoverMyInfo(false)}
          style={{
            backgroundColor: hoverMyInfo ? "#d7ecff" : "#F0F8FF",
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
            transition: "background-color 0.2s ease, transform 0.15s ease",
            transform: hoverMyInfo ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          내 정보
        </button>
        
        <div style={{ marginTop: "40px", fontSize: "20px" }}>지난 채팅</div>
        
        {/* 채팅 기록 목록 */}
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "10px", 
            // 높이가 지정되지 않아 스크롤이 안되는 문제를 피함 (상위 div 높이를 늘려 조정)
            // overflowY: "auto" 는 부모의 높이가 제한되어야 작동하니 참고
          }}
        >
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
