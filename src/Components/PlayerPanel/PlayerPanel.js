import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import FleetStatistic from "./FleetStatistic/FleetStatistic";
import './PlayerPanel.css';

export default function PlayerPanel({ combatReports, player, id, isDefender, isCoordinateOwner }) {
    const { t } = useTranslation();
    const [FleetStatistics, setFleetStatistics] = useState([])

    useEffect(() => {
        let fleetStats = [];
        combatReports.forEach((report, index) => {
            let side = isDefender ? report.defenders : report.attackers;
            if (side[id]) {
                fleetStats.push((
                    <FleetStatistic
                        fleet={side[id]}
                        number={index + 1}
                        isDefender={isDefender}
                        key={index}
                        isCoordinateOwner={isCoordinateOwner}
                    />
                ))
            }
        });
        setFleetStatistics(fleetStats);
    }, [combatReports, id, isCoordinateOwner, isDefender])

    return (
        <div className="player-panel">
            <div className="player-section">
                <div className="name">{`${player.alliance != null ? `[${player.alliance}]` : ""} ${player.name}`}</div>
            </div>
            <div className="fleet-section">
                <div className="labels">
                    <div className="resource-statistics-labels">
                        <div className={isDefender ? "hidden" : ""}>{t("Metal")}</div>
                        <div className={isDefender ? "hidden" : ""}>{t("Crystal")}</div>
                        <div className={isDefender ? "hidden" : ""}>{t("Deuterium")}</div>
                    </div>
                    <div className="fleet-statistics-labels">
                        {t("FleetComposition")}
                    </div>
                </div>
                {FleetStatistics}
            </div>
        </div>
    )
}