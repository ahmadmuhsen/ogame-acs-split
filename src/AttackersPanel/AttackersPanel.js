import React, { useState, useEffect } from 'react';

import SectionTitle from '../Components/SectionTitle/SectionTitle';
import ACSAttackResults from '../Components/ACSAttackResults/ACSAttackResults';
import TextInput from '../Components/TextInput/TextInput';
import Button from '../Components/Button/Button';

import { useTranslation } from "react-i18next";
import './AttackersPanel.css';

export default function AttackersPanel({ combatReports, setCombatReports }) {
    const { t } = useTranslation();
    const [ACSAttackResultsVisible, setACSAttackResultsVisible] = useState(true)
    return (
        <div className="attackers-panel">
            <SectionTitle
                title={t("ACSAttackResults")}
                icon={ACSAttackResultsVisible ? "caret-up" : "caret-down"}
                onClick={() => setACSAttackResultsVisible(!ACSAttackResultsVisible)}
            />
            <ACSAttackResults
                combatReports={combatReports}
                setCombatReports={setCombatReports}
                visible={ACSAttackResultsVisible}
            />
        </div>
    )
}