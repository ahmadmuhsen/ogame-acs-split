import React from 'react';
import './TextInput.css';

export default function TextInput({ placeholder, value, onChange, valid = true, disabled = false }) {
    return (
        <input
            type="text"
            className={`text-input ${valid ? "" : "invalid"}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled}
        />
    )
}