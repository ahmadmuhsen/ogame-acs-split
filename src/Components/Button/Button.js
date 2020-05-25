import React from 'react';
import './Button.css';

export default function Button({ size, children, onClick, disabled }) {
    return (
        <button
            className={`button ${size}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}