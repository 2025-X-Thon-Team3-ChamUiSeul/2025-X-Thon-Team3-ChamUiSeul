import MessageItem from "./MessageItem";

export default function MessageList({ messages }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
}
