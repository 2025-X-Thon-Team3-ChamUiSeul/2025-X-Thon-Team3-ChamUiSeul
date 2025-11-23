<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import welfyLogo from "../assets/images/welfy_logo.png";
>>>>>>> 559f9a89 (fix: design)

export default function Sidebar() {
  const navigate = useNavigate();
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
        <div style={{ fontSize: "20px" }}>새 채팅</div>
        <button
          onClick={() => navigate("/info")}
          style={{
            fontSize: "20px",
            background: "none",
            border: "none",
            textAlign: "left",
            color: "#123B66",
            cursor: "pointer",
            padding: "0",
          }}
        >
          내 정보
        </button>
        <div style={{ marginTop: "40px", fontSize: "20px" }}>내 채팅</div>
        <span style={{ color: "#345575" }}>과거 채팅 기록들…</span>
      </nav>
    </div>
  );
}
