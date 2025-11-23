import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InfoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    username: "",
    age: "", // 이제 직접 입력
    gender: "", // 이제 직접 입력
    housingType: "", // 이제 직접 입력
    income: "", // 이제 직접 입력
    region: "", // 이제 직접 입력
    school: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch user profile");
        }

        const userData = await response.json();
        setForm({
          username: userData.username || "",
          age: userData.age ? String(userData.age) : "", // 숫자를 문자열로 변환하여 input에
          gender: userData.gender || "",
          housingType: userData.housing_type || "",
          income: userData.monthly_income ? String(userData.monthly_income) : "", // 숫자를 문자열로 변환하여 input에
          region: userData.region || "",
          school: userData.school || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Authentication token not found.");
      // Optionally redirect to login page
      navigate("/login");
      return;
    }

    // Validation
    if (!form.username.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!form.age.trim()) {
      alert("나이를 입력해주세요.");
      return;
    }
    const parsedAge = parseInt(form.age);
    if (isNaN(parsedAge)) {
      alert("유효한 나이를 숫자로 입력해주세요.");
      return;
    }
    if (!form.gender.trim()) {
      alert("성별을 입력해주세요.");
      return;
    }
    if (!form.region.trim()) {
      alert("거주지를 입력해주세요.");
      return;
    }
    if (!form.housingType.trim()) {
      alert("거주형태를 입력해주세요.");
      return;
    }
    if (!form.income.trim()) {
      alert("월소득을 입력해주세요.");
      return;
    }
    const parsedMonthlyIncome = parseInt(form.income);
    if (isNaN(parsedMonthlyIncome)) {
      alert("유효한 월소득을 숫자로 입력해주세요.");
      return;
    }
    if (!form.school.trim()) {
      alert("학교를 입력해주세요.");
      return;
    }

    const dataToSend = {
      username: form.username,
      age: parsedAge,
      gender: form.gender,
      region: form.region,
      housing_type: form.housingType,
      monthly_income: parsedMonthlyIncome,
      school: form.school,
    };

    try {
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update user profile");
      }

      const updatedUser = await response.json();
      console.log("User profile updated successfully:", updatedUser);
      navigate("/chat"); // 정보 저장 후 채팅 화면으로 이동
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Display error message to the user
      alert("프로필 업데이트에 실패했습니다: " + error.message);
    }
  };

  const inputStyle = {
    width: "200px",
    padding: "12px 16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#B5DBFF",
    color: "#123B66",
    fontSize: "16px",
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

  if (loading) {
    return <div style={{ color: "#123B66", fontSize: "20px" }}>정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: "red", fontSize: "20px" }}>오류 발생: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "15px" }}>
      {/* 이름 */}
      <div style={labelStyle}>
        이름
        <input
          type="text"
          style={inputStyle}
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
        />
      </div>

      {/* 나이 */}
      <div style={labelStyle}>
        나이
        <input
          type="text"
          style={inputStyle}
          value={form.age}
          onChange={(e) => updateField("age", e.target.value)}
        />
      </div>

      {/* 성별 */}
      <div style={labelStyle}>
        성별
        <input
          type="text"
          style={inputStyle}
          value={form.gender}
          onChange={(e) => updateField("gender", e.target.value)}
        />
      </div>

      {/* 거주지 */}
      <div style={labelStyle}>
        거주지
        <input
          type="text"
          style={inputStyle}
          value={form.region}
          onChange={(e) => updateField("region", e.target.value)}
        />
      </div>

      {/* 거주형태 */}
      <div style={labelStyle}>
        거주형태
        <input
          type="text"
          style={inputStyle}
          value={form.housingType}
          onChange={(e) => updateField("housingType", e.target.value)}
        />
      </div>

      {/* 월소득 */}
      <div style={labelStyle}>
        월소득
        <input
          type="text"
          style={inputStyle}
          value={form.income}
          onChange={(e) => updateField("income", e.target.value)}
        />
      </div>

      {/* 학교 */}
      <div style={labelStyle}>
        학교
        <input
          type="text"
          style={inputStyle}
          value={form.school}
          onChange={(e) => updateField("school", e.target.value)}
        />
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
