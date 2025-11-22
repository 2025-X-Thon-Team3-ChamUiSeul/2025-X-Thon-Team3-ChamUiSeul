export default function Sidebar() {
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
        <div style={{ fontSize: "20px" }}>내 정보</div>
        <div style={{ marginTop: "40px", fontSize: "20px" }}>내 채팅</div>
        <span style={{ color: "#345575" }}>과거 채팅 기록들…</span>
      </nav>
    </div>
  );
}
