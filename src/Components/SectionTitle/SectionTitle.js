import React from 'react';
import './SectionTitle.css';

export default function SectionTitle({title, icon}){
    return (
        <div className="section-title">
            <i className={`fas fa-${icon}`} />
            <div className="title">{title}</div>
        </div>
    )
}