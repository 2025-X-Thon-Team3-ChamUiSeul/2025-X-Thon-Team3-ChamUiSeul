// frontend/index.js (혹은 index.jsx)

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // App.js 파일을 임포트합니다.

// styles.css를 이 위치에서 임포트하여 전체 앱에 적용하는 것이 좋습니다.
import './components/css/styles.css'; 

// index.html의 <div id="root"> 엘리먼트를 찾습니다.
const container = document.getElementById('root'); 

// React 18의 새로운 렌더링 API (createRoot)를 사용합니다.
const root = createRoot(container);

// App 컴포넌트를 root 컨테이너에 렌더링합니다.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);