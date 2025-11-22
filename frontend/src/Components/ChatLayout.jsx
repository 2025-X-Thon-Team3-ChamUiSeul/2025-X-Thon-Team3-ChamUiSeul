import Sidebar from "../Components/Sidebar";

export default function ChatLayout({ children, handleNewChat }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* 왼쪽 사이드바 */}
      <Sidebar handleNewChat={handleNewChat} />

      {/* 오른쪽 페이지 내용 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {children}
      </div>
    </div>
  );
}