import { useNavigate } from "react-router-dom";
import welfyImg from "../assets/images/welfy_origin.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 백엔드의 구글 로그인 처리 라우터로 이동
    window.location.href = "http://localhost:8000/auth/login";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "40px 20px",
        backgroundColor: "#F5F9FF",
      }}
    >
      {/* 타이틀 */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#123B66", margin: 0 }}>
          청년을 위한 AI 비서,
        </h2>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "#123B66",
            margin: "10px 0",
          }}
        >
          Welfy
        </h1>
      </div>

      {/* 캐릭터 + 말풍선 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <img
          src={welfyImg}
          alt="welfy"
          style={{
            width: "220px",
            height: "220px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            border: "2px solid #123B66",
            borderRadius: "20px",
            padding: "20px 28px",
            fontSize: "17px",
            lineHeight: "1.5",
            color: "#123B66",
            backgroundColor: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            minWidth: "160px",
          }}
        >
          <strong style={{ fontSize: "18px" }}>Welcome!</strong> <br />
          복잡한 복지, 이젠 <br />
          웰피가 알려줄게요.
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: "#123B66",
          color: "white",
          border: "none",
          padding: "18px 50px",
          borderRadius: "40px",
          fontSize: "20px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
          transition: "0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0F2F52")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#123B66")}
      >
        구글로 로그인
      </button>
    </div>
  );
}
