import React from 'react';
import './TextInput.css';

export default function TextInput({ className, placeholder, value, onChange, valid = true, disabled = false, onMouseLeave }) {
    return (
        <input
            type="text"
            className={`text-input ${valid ? "" : "invalid"} ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled}
            onMouseLeave={onMouseLeave}
        />
    )
}