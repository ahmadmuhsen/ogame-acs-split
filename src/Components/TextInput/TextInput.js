import React from 'react';
import './TextInput.css';

export default function TextInput({ size, placeholder, value, onChange, valid, disabled }) {
    return (
        <input
            type="text"
            className={`text-input ${size} ${valid ? "" : "invalid"}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled}
        />
    )
}