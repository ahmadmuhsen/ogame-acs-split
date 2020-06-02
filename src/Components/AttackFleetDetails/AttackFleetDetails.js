import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import TextInput from '../TextInput/TextInput';
import SectionTitle from '../SectionTitle/SectionTitle';

import './AttackFleetDetails.css';

export default function AttackFleetDetails({ attackFleet, onChange, index }) {
    const { t } = useTranslation();

    useEffect(() => {
        console.log(attackFleet);
    }, [attackFleet])

    return (
        <div className="attack-fleet-details">
          <div className="player-name"></div>
        </div>
    )
}