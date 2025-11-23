import { useNavigate } from "react-router-dom";

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
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "40px" }}>
        Welfy
      </h1>

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
