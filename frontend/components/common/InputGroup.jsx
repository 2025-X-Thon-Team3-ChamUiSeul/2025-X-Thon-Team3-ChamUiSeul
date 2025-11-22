// frontend/components/common/InputGroup.jsx

import React from 'react';

function InputGroup({ label, name, type, value, onChange, options }) {
    
    // Select 박스 렌더링
    const renderInput = () => {
        if (type === 'select' && options) {
            return (
                <select id={name} name={name} value={value} onChange={onChange} required>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        }
        
        // 일반 Input (Text, Number 등) 렌더링
        return (
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value} 
                onChange={onChange} 
                required 
            />
        );
    };

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {renderInput()}
        </div>
    );
}

export default InputGroup;