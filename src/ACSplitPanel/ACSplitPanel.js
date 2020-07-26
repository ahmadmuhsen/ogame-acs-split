import React from 'react';

import ACSAttackResults from './ACSAttackResults/ACSAttackResults';
import FleetOverview from './FleetOverview/FleetOverview';
import RecyclerPickups from '../Components/RecyclerPickups/RecyclerPickups';
import Result from '../Components/Result/Result';

import { useTranslation } from "react-i18next";
import './ACSplitPanel.css';

export default function ACSplitPanel({ combatReports, setCombatReports, recycleReports, setRecycleReports, settingsData, side }) {
    const { t } = useTranslation();
    return (
        <div className="acsplit-panel">
            {side === 0 ?
                <ACSAttackResults
                    combatReports={combatReports}
                    setCombatReports={setCombatReports}
                /> : ""}
            <FleetOverview
                combatReports={combatReports}
                setCombatReports={setCombatReports}
                side={side}
            />
            <RecyclerPickups
                recycleReports={recycleReports}
                setRecycleReports={setRecycleReports}
            />
            <Result
                combatReports={combatReports}
                recycleReports={recycleReports}
                settingsData={settingsData}
                side={side}
            />
        </div>
    )
}