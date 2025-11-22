import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InfoForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    birth: "2000년생",
    gender: "남성",
    job: "학생",
    income: "70만원",
    region: "서울시 중구",
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("입력 정보:", form);
    navigate("/chat"); // 정보 저장 후 채팅 화면으로 이동
  };

  const selectStyle = {
    width: "200px",
    padding: "12px 16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#B5DBFF",
    color: "#123B66",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "320px",
    marginBottom: "16px",
    fontSize: "18px",
    color: "#123B66",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "15px" }}>
      {/* 나이 */}
      <div style={labelStyle}>
        나이
        <select
          style={selectStyle}
          value={form.birth}
          onChange={(e) => updateField("birth", e.target.value)}
        >
          <option>1999년생</option>
          <option>2000년생</option>
          <option>2001년생</option>
          <option>2002년생</option>
        </select>
      </div>

      {/* 성별 */}
      <div style={labelStyle}>
        성별
        <select
          style={selectStyle}
          value={form.gender}
          onChange={(e) => updateField("gender", e.target.value)}
        >
          <option>남성</option>
          <option>여성</option>
          <option>기타</option>
        </select>
      </div>

      {/* 직업 */}
      <div style={labelStyle}>
        직업
        <select
          style={selectStyle}
          value={form.job}
          onChange={(e) => updateField("job", e.target.value)}
        >
          <option>학생</option>
          <option>취업준비생</option>
          <option>직장인</option>
        </select>
      </div>

      {/* 소득 */}
      <div style={labelStyle}>
        소득
        <select
          style={selectStyle}
          value={form.income}
          onChange={(e) => updateField("income", e.target.value)}
        >
          <option>70만원</option>
          <option>100만원</option>
          <option>150만원</option>
          <option>200만원</option>
        </select>
      </div>

      {/* 지역 */}
      <div style={labelStyle}>
        거주지
        <select
          style={selectStyle}
          value={form.region}
          onChange={(e) => updateField("region", e.target.value)}
        >
          <option>서울시 중구</option>
          <option>서울시 강남구</option>
          <option>서울시 노원구</option>
          <option>경기도 고양시</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "30px",
          backgroundColor: "#123B66",
          color: "white",
          padding: "14px 30px",
          borderRadius: "30px",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        저장하고 채팅 시작하기
      </button>
    </div>
  );
}
