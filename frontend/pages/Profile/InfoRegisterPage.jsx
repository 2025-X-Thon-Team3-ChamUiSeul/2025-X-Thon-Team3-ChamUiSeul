// frontend/pages/Profile/InfoRegisterPage.jsx

import React from 'react';
import RegisterForm from '../../components/Profile/RegisterForm'; // 폼 컴포넌트 불러오기
import Sidebar from '../../components/layout/Sidebar'; // 메뉴 사이드바 (가정)
import '../../css/profileStyles.css'; // 스타일 파일 연결 (가정)

function InfoRegisterPage() {
    return (
        <div className="profile-container">
            {/* 왼쪽 메뉴 영역 */}
            <Sidebar /> 

            {/* 오른쪽 내용 영역 */}
            <main className="profile-content">
                <div className="form-header">
                    {/* 이미지 위치: assets/images/bird_icon.png */}
                    <img src="./assets/images/bird_icon.png" alt="새 아이콘" className="bird-icon" /> 
                    <span className="header-text">사용자님에 대해 알려주세요.</span>
                </div>
                
                {/* 실제 폼 내용은 RegisterForm 컴포넌트에 위임 */}
                <RegisterForm /> 
            </main>
        </div>
    );
}

export default InfoRegisterPage;