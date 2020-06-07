import React from 'react';
import './SectionTitle.css';

export default function SectionTitle({ title, icon, onClick }) {
    return (
        <div
            className="section-title"
            onClick={onClick}
        >
            <i className={`fas fa-${icon}`} />
            <div className="title">{title}</div>
        </div>
    )
}