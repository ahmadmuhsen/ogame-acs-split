import React from 'react';

import ACSAttackResults from './ACSAttackResults/ACSAttackResults';
import AttacksOverview from './AttacksOverview/AttacksOverview';
import RecyclerPickups from '../Components/RecyclerPickups/RecyclerPickups';
import Result from '../Components/Result/Result';

import { useTranslation } from "react-i18next";
import './AttackersPanel.css';

export default function AttackersPanel({ combatReports, setCombatReports, recycleReports, setRecycleReports, settingsData }) {
    const { t } = useTranslation();
    return (
        <div className="attackers-panel">
            <ACSAttackResults
                combatReports={combatReports}
                setCombatReports={setCombatReports}
            />
            <AttacksOverview
                combatReports={combatReports}
                setCombatReports={setCombatReports}
            />
            <RecyclerPickups
                recycleReports={recycleReports}
                setRecycleReports={setRecycleReports}
            />
            <Result
                combatReports={combatReports}
                recycleReports={recycleReports}
                settingsData={settingsData}
            />
        </div>
    )
}