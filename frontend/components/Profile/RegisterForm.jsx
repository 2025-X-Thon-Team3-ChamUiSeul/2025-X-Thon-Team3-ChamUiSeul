// frontend/components/Profile/RegisterForm.jsx

import React, { useState } from 'react';
import InputGroup from '../common/InputGroup'; // 재사용 가능한 입력 그룹 컴포넌트

function RegisterForm() {
    // 폼 상태 관리 (React Hook)
    const [formData, setFormData] = useState({
        age: '20대',
        gender: '여자',
        job: '학생',
        hobby: '배구',
        income: '비공개',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 폼 데이터 처리 로직 (API 호출, 유효성 검사 등)
        console.log('폼 제출 데이터:', formData);
        alert('정보가 성공적으로 저장됩니다. (콘솔 확인)');
    };

    return (
        <form onSubmit={handleSubmit} className="user-register-form">
            <InputGroup 
                label="나이" 
                name="age" 
                type="text" 
                value={formData.age} 
                onChange={handleChange} 
            />
            
            <InputGroup 
                label="성별" 
                name="gender" 
                type="select" 
                value={formData.gender} 
                onChange={handleChange}
                options={['남자', '여자', '선택 안 함']}
            />
            
            <InputGroup 
                label="직업" 
                name="job" 
                type="text" 
                value={formData.job} 
                onChange={handleChange} 
            />
            
            {/* 나머지 입력 필드도 InputGroup을 사용하여 추가 */}
            
            <button type="submit" className="submit-button">
                저장
            </button>
        </form>
    );
}

export default RegisterForm;