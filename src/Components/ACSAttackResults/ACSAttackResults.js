import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import AttackResult from '../AttackResult/AttackResult';
import './ACSAttackResults.css';

export default function ACSAttackResult({ combatReports }) {
    const { t } = useTranslation();
    const [AttackResults, setAttackResults] = useState([]);
    const [AttackResultsCount, setAttackResultsCount] = useState(0);
    const [TotalResult, setTotalResult] = useState({})
    useEffect(() => {
        let attackResults = [];
        let total = {
            metalLoot: 0,
            crystalLoot: 0,
            deuteriumLoot: 0,
            debrisMetal: 0,
            debrisCrystal: 0,
            debrisReaperMetal: 0,
            debrisReaperCrystal: 0
        };

        combatReports.forEach((report, index) => {
            if (Object.keys(report.attackers).length > 1) {
                attackResults.push((
                    <AttackResult
                        combatReport={report}
                        number={index + 1}
                    />
                ))
                total.metalLoot += report.metalLoot;
                total.crystalLoot += report.crystalLoot;
                total.deuteriumLoot += report.deuteriumLoot;
                total.debrisMetal += report.debrisMetal;
                total.debrisCrystal += report.debrisCrystal;
                total.debrisReaperMetal += report.debrisReaperMetal;
                total.debrisReaperCrystal += report.debrisReaperCrystal;
            }
        })

        setTotalResult(total);
        setAttackResultsCount(attackResults.length);
        setAttackResults(attackResults);
    }, [combatReports])
    return (
        <div className={`acs-attack-result ${AttackResultsCount === 0 ? "empty" : ""}`}>
            <div className="labels">
                <div>{t("ACSAttack")}</div>
                <div>{t("Metal")}</div>
                <div>{t("Crystal")}</div>
                <div>{t("Dueterium")}</div>
                <div>{t("DFMetal")}</div>
                <div>{t("DFCrystal")}</div>
                <div>{t("DFReaperMetal")}</div>
                <div>{t("DFReaperCrystal")}</div>
            </div>
            {AttackResults}
            <div className="labels">
                <div>{t("Total")}</div>
                <div>{TotalResult.metalLoot}</div>
                <div>{TotalResult.crystalLoot}</div>
                <div>{TotalResult.deuteriumLoot}</div>
                <div>{TotalResult.debrisMetal}</div>
                <div>{TotalResult.debrisCrystal}</div>
                <div>{TotalResult.debrisReaperMetal}</div>
                <div>{TotalResult.debrisReaperCrystal}</div>
            </div>
        </div>
    )
}