import welfyLogo from "../assets/images/welfy_logo.png";

export default function ProgressTracker({ progress }) {
  if (!progress) return null;

  const steps = Array.from({ length: progress.total_steps || 0 }, (_, i) => i + 1);

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div>
          <div className="progress-title">서류 작성 현황</div>
          <div className="progress-service">{progress.service_title}</div>
        </div>
        <img src={welfyLogo} alt="welfy" className="progress-welfy" />
      </div>

      <div className="progress-steps">
        {steps.map((step, idx) => {
          const isDone = step < progress.current_step;
          const isActive = step === progress.current_step;
          return (
            <div className="progress-step" key={step}>
              <div className={`progress-circle ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                {step}
              </div>
              {idx < steps.length - 1 && (
                <div className={`progress-line ${isDone ? "done" : isActive ? "active" : ""}`} />
              )}
              <div className="progress-label">
                {isActive ? "진행 중" : isDone ? "완료" : "대기"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="progress-next">
        <span className="progress-next-label">다음 행동</span>
        <span className="progress-next-text">{progress.next_action}</span>
      </div>
    </div>
  );
}
