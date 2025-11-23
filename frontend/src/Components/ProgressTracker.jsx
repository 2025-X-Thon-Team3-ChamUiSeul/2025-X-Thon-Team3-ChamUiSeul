// src/Components/ProgressTracker.jsx
import React from "react";

const Step = ({ index, currentStep, isLast, isInitialState }) => {
  const isActive = index + 1 < currentStep;
  const isCurrent = index + 1 === currentStep;

  // When in initial state (currentStep === 0), all steps are inactive
  const backgroundColor = isInitialState || !isActive ? "#E0E0E0" : "#123B66";
  const textColor = isInitialState || !isActive ? "#123B66" : "white";

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", alignSelf: 'stretch' }}>
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: backgroundColor,
          color: textColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          border: isCurrent ? '3px solid #8ECAFF' : '3px solid transparent',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease',
        }}
      >
        {index + 1}
      </div>
      {!isLast && (
        <div
          style={{
            width: "4px",
            height: "40px",
            backgroundColor: backgroundColor,
            marginTop: '4px',
            marginBottom: '4px',
            transition: 'background-color 0.3s ease',
          }}
        />
      )}
    </div>
  );
};

export default function ProgressTracker({ progress, onCompleteStep }) {
  const isInitialState = !progress || progress.current_step === 0;
  const isCompleted = progress && progress.current_step >= progress.total_steps;

  const title = progress ? progress.welfare_title : "진행 상황";
  const nextActionText = progress ? progress.next_action : "아직 진행 중인 신청이 없습니다.";
  const buttonText = isInitialState ? "신청 시작하기" : (isCompleted ? '완료됨' : '완료했어요');

  const handleButtonClick = () => {
    if (progress && onCompleteStep) {
      onCompleteStep(progress.progress_id);
    }
  };

  return (
    <div
      style={{
        width: "280px",
        padding: "30px 20px",
        backgroundColor: "#F0F8FF",
        borderLeft: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#123B66",
        height: '100vh',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        boxShadow: 'inset 1px 0 3px rgba(0,0,0,0.05)',
      }}
    >
      <div>
        <h3 style={{ margin: 0, marginBottom: "10px", textAlign: 'center' }}>{title}</h3>
        <p style={{ fontSize: "14px", color: '#555', marginBottom: '30px', textAlign: 'center' }}>
          {progress ? "신청 진행 현황" : "현재 진행 중인 신청이 없습니다."}
        </p>
        
        {progress && progress.total_steps > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            {Array.from({ length: progress.total_steps }).map((_, index) => (
              <Step
                key={index}
                index={index}
                currentStep={progress.current_step}
                isLast={index === progress.total_steps - 1}
                isInitialState={isInitialState}
              />
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h4 style={{ marginBottom: '10px' }}>
              {isInitialState ? "시작 안내" : (isCompleted ? "신청 완료!" : "다음 단계")}
            </h4>
            <p style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px', 
                fontSize: '14px',
                minHeight: '60px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {nextActionText}
            </p>
        </div>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={isCompleted && !isInitialState} // Only disable if completed AND not initial state
        style={{
            width: '100%',
            padding: '12px',
            backgroundColor: (isCompleted && !isInitialState) ? '#B0B0B0' : '#123B66',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (isCompleted && !isInitialState) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.2s ease',
            fontWeight: 'bold',
        }}
      >
          {buttonText}
      </button>
    </div>
  );
}