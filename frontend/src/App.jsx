import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./home/LoginPage.jsx";
import InfoInputPage from "./Pages/InfoInputPage.jsx";
import ChatPage from "./Chat/ChatPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 화면 */}
        <Route path="/" element={<LoginPage />} />

        {/* 정보 입력 화면 */}
        <Route path="/info" element={<InfoInputPage />} />

        {/* 채팅 화면 */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
