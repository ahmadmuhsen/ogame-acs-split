import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import TextInput from '../TextInput/TextInput';
import SectionTitle from '../SectionTitle/SectionTitle';
import AttackFleetDetails from '../AttackFleetDetails/AttackFleetDetails';

import './AttackDetails.css';

export default function AttackDetails({ combatReports, setCombatReports, index }) {
    const { t } = useTranslation();
    const [AttacksFleetDetails, setAttacksFleetDetails] = useState([])
    useEffect(() => {
        setAttacksFleetDetails(combatReports[index].attackers.map((attacker, attackerIndex) => {
            return (
                <AttackFleetDetails
                    attackFleet={attacker}
                    onChange={() => {}}
                    index={attackerIndex}
                    key={`ATTACKFLEETDETAILS${index}-${attackerIndex}`}
                />
            )
        }))
    }, [combatReports])

    return (
        <div className="attack-details">
            <div className="label">{t("Attack")} #{index + 1}</div>
            {AttacksFleetDetails}
        </div>
    )
}