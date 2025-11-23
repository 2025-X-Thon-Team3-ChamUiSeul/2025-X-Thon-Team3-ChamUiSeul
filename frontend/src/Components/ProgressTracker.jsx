// src/Components/ProgressTracker.jsx
import React from "react";

const Step = ({ index, currentStep, isLast }) => {
  // A step is active (completed) if its number is less than the current step.
  const isActive = index + 1 < currentStep; 
  // A step is current if its number matches the current step.
  const isCurrent = index + 1 === currentStep;

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", alignSelf: 'stretch' }}>
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: isActive ? "#123B66" : "#E0E0E0",
          color: isActive ? "white" : "#123B66",
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
            backgroundColor: isActive ? "#123B66" : "#E0E0E0",
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
  if (!progress) {
    return null;
  }

  const { progress_id, welfare_title, total_steps, current_step, next_action } = progress;
  const isInitialState = current_step === 0;
  const isCompleted = current_step >= total_steps;

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
      }}
    >
      <div>
        <h3 style={{ margin: 0, marginBottom: "10px", textAlign: 'center' }}>{welfare_title}</h3>
        <p style={{ fontSize: "14px", color: '#555', marginBottom: '30px', textAlign: 'center' }}>신청 진행 현황</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          {Array.from({ length: total_steps }).map((_, index) => (
            <Step
              key={index}
              index={index}
              currentStep={current_step}
              isLast={index === total_steps - 1}
            />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h4 style={{ marginBottom: '10px' }}>
              {isInitialState ? "시작 안내" : (isCompleted ? "신청 완료!" : "다음 단계")}
            </h4>
            <p style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px', 
                fontSize: '14px',
                minHeight: '60px'
              }}
            >
              {next_action}
            </p>
        </div>
      </div>

      <button
        onClick={() => onCompleteStep(progress_id)}
        disabled={isCompleted}
        style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isCompleted ? '#B0B0B0' : '#123B66',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isCompleted ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.2s ease',
        }}
      >
          {isInitialState ? "신청 시작하기" : (isCompleted ? '완료됨' : '완료했어요')}
      </button>
    </div>
  );
}
