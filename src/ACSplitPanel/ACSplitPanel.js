import React from 'react';

import ACSAttackResults from './ACSAttackResults/ACSAttackResults';
import FleetOverview from './FleetOverview/FleetOverview';
import RecyclerPickups from '../Components/RecyclerPickups/RecyclerPickups';
import Result from '../Components/Result/Result';

import { useTranslation } from "react-i18next";
import './ACSplitPanel.css';

export default function ACSplitPanel({ 
    combatReports, 
    setCombatReports, 
    recycleReports, 
    setRecycleReports, 
    playerTotalsStatistics, 
    setPlayerTotalsStatistics, 
    settingsData, 
    side,
    dataFromSharedReport
}) {
    const { t } = useTranslation();
    return (
        <div className="acsplit-panel">
            {side === 0 ?
                <ACSAttackResults
                    combatReports={combatReports}
                    setCombatReports={setCombatReports}
                    settingsData={settingsData}
                /> : ""}
            <FleetOverview
                combatReports={combatReports}
                setCombatReports={setCombatReports}
                side={side}
                settingsData={settingsData}
            />
            <RecyclerPickups
                recycleReports={recycleReports}
                setRecycleReports={setRecycleReports}
            />
            <Result
                combatReports={combatReports}
                recycleReports={recycleReports}
                settingsData={settingsData}
                playerTotalsStatistics={playerTotalsStatistics}
                setPlayerTotalsStatistics={setPlayerTotalsStatistics}
                side={side}
                dataFromSharedReport={dataFromSharedReport}
            />
        </div>
    )
}