export default function StepIndicator({ current = 3 }) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div style={{ padding: "15px 0 30px 0" }}>
      <div style={{ textAlign: "center", position: "relative" }}>
        
        {/* 연결선 */}
        <div
          style={{
            width: "75%",
            height: "2px",
            backgroundColor: "#BBD0EA",
            position: "absolute",
            top: "35px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        />

        {/* 단계 */}
        {steps.map((step) => (
          <div
            key={step}
            style={{
              display: "inline-block",
              margin: "0 40px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "3px solid #123B66",
                backgroundColor:
                  step < current
                    ? "#123B66"
                    : step === current
                    ? "#A8C7FF"
                    : "white",
                color: step < current ? "white" : "#123B66",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {step}
            </div>

            <div style={{ marginTop: "8px", color: "#123B66" }}>
              단계별 설명
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}