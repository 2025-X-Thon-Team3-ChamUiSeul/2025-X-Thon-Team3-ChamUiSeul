import welfyImg from "../assets/images/welfy_origin.png";

export default function MessageItem({ text, isUser }) {
  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            border: "2px solid #A8C7FF",
            padding: "10px 14px",
            borderRadius: "16px",
            maxWidth: "260px",
            fontSize: "16px",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <img src={welfyImg} alt="welfy" style={{ width: "40px" }} />

      <div
        style={{
          backgroundColor: "#fff",
          border: "2px solid #123B66",
          padding: "10px 14px",
          borderRadius: "16px",
          maxWidth: "260px",
          fontSize: "16px",
        }}
      >
        {text}
      </div>
    </div>
  );
}