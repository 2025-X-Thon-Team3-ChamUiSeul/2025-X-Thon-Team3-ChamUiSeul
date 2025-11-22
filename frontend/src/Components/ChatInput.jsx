export default function ChatInput({ value, onChange, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="무엇이든 물어보세요."
        style={{
          flex: 1,
          padding: "18px 22px",
          borderRadius: "30px",
          border: "none",
          backgroundColor: "#D8E4F8",
          fontSize: "16px",
        }}
      />

      <button
        onClick={onSend}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#123B66",
          color: "white",
          border: "none",
          fontSize: "26px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        ↑
      </button>
    </div>
  );
}