import React from 'react';
import './TextInput.css';

export default function TextInput({ className, placeholder, value, onChange, valid = true, disabled = false, step }) {
    return (
        <input
            type="text"
            className={(`text-input ${valid ? "" : "invalid"} ${className ? className : ""}`).trim()}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled}
        />
    )
}