import React from 'react';
import './Button.css';

export default function Button({ children, onClick, disabled, className }) {
    return (
        <button
            className={`button ${className ? className : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}