// 예시: frontend/index.js (혹은 index.jsx)

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // 새로 만든 App.js를 임포트

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App /> // App 컴포넌트 렌더링
  </React.StrictMode>
);