import Sidebar from "../Components/Sidebar";
import InfoForm from "../Components/InfoForm";
import welfyImg from "../assets/images/welfy_inform.png";

export default function InfoInputPage() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 오른쪽 정보 입력 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <img src={welfyImg} alt="welfy" style={{ width: "130px" }} />

        <h2 style={{ fontSize: "24px", color: "#123B66" }}>
          웰피에게 00님에 대해 알려주세요.
        </h2>

        <InfoForm />
      </div>
    </div>
  );
}