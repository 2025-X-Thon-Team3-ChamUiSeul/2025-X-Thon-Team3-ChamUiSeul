import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatArea() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "welfy", text: "아아라랄" },
    { id: 2, sender: "user", text: "아아라라라라" },
  ]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text },
    ]);
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <MessageList messages={messages} />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}