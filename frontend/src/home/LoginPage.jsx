import { useNavigate } from "react-router-dom";
import welfyImg from "../assets/images/welfy_origin.png";
import googleLogo from "../assets/images/google_logo.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 백엔드의 구글 로그인 처리 라우트로 이동
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
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#123B66", margin: 0 }}>
          복지에 특화된 AI 비서,
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
          웰피가 알려줄게요!
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        onClick={handleGoogleLogin}
        aria-label="구글로 로그인"
        style={{
          backgroundColor: "white",
          border: "none",
          padding: 0,
          borderRadius: "20px",
          cursor: "pointer",
          boxShadow: "0px 6px 12px rgba(0,0,0,0.18)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0,0,0,0.22)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.18)";
        }}
      >
        <img
          src={googleLogo}
          alt="Google 로그인"
          style={{
            display: "block",
            width: "210px",
            height: "auto",
            borderRadius: "20px",
          }}
        />
      </button>
    </div>
  );
}
