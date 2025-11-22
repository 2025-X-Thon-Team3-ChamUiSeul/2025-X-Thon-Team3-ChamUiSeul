import React from 'react';
import './WelfyLogin.css'; // 스타일을 위한 CSS 파일을 임포트합니다.

// 이미지 경로. 실제 프로젝트에서는 public 폴더나 assets 폴더에 이미지를 넣고 경로를 지정해야 합니다.
// 여기서는 임시로 'welfy-bird.png'라고 가정합니다.
import welfyBirdImage from './welfy-bird.png'; 

function WelfyLogin() {
    // 이미지에 있는 텍스트를 분석합니다.
    const koreanText1 = "청년을 위한 AI 비서,";
    const koreanText2 = "Welfy";
    const welcomeBubble = "Welcome! 복지 찾는 비서, 이제 Welfy와 함께해요!"; // 이미지의 말풍선 내용
    
    // 버튼 클릭 시 실행할 더미 함수입니다. 실제 로직으로 교체해야 합니다.
    const handleLogin = (type) => {
        console.log(`${type} 로그인/회원가입 버튼 클릭됨`);
        // 실제 OAuth 2.0 리디렉션 로직이 여기에 들어갑니다.
    };

    return (
        <div className="login-container">
            {/* 상단 텍스트 */}
            <p className="subtitle">{koreanText1}</p>
            <h1 className="title">{koreanText2}</h1>
            
            {/* 웰피 캐릭터 및 말풍선 */}
            <div className="welfy-intro">
                {/*  <- 이 부분을 실제 이미지 컴포넌트로 대체 */}
                <img src={welfyBirdImage} alt="Welfy 캐릭터" className="welfy-bird-image" />
                <div className="speech-bubble">
                    <p>{welcomeBubble}</p>
                </div>
            </div>

            {/* 로그인/회원가입 버튼들 */}
            <div className="button-group">
                {/* 일반 로그인 버튼 */}
                <button 
                    className="login-button primary-blue"
                    onClick={() => handleLogin('일반 로그인')}
                >
                    로그인
                </button>

                {/* 회원가입 버튼 */}
                <button 
                    className="login-button secondary-dark"
                    onClick={() => handleLogin('회원가입')}
                >
                    회원가입
                </button>

                {/* Google 소셜 로그인 버튼 (기획안에 언급됨) */}
                <button 
                    className="login-button social-google"
                    onClick={() => handleLogin('Google 로그인')}
                >
                    Google 로그인
                </button>
                
                {/* 카카오 소셜 로그인 버튼 (이미지에 '~~ 로그인' 부분 참고, 카카오로 가정) */}
                <button 
                    className="login-button social-kakao"
                    onClick={() => handleLogin('카카오 로그인')}
                >
                    카카오 로그인
                </button>
            </div>
            
            <p className="info-text">
                <a href="#find-id-pw">아이디/비밀번호 찾기</a>
            </p>
        </div>
    );
}

export default WelfyLogin;