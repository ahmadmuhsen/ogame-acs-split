import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import TextInput from '../../Components/TextInput/TextInput';
import SectionTitle from '../../Components/SectionTitle/SectionTitle';

import './ACSAttackResults.css';

export default function ACSAttackResults({ combatReports, setCombatReports }) {
    const { t } = useTranslation();
    const [AttackResultsRows, setAttackResultsRows] = useState([]);
    const [TotalResults, setTotalResults] = useState({});
    const [DataVisible, setDataVisible] = useState(true)

    const onResourceChange = (event, index, resourceType) => {
        let newCRs = [...combatReports];
        let value = parseInt(event.target.value);
        value = isNaN(value) ? 0 : value;
        switch (resourceType) {
            case 0: newCRs[index].metalLoot = value; break;
            case 1: newCRs[index].crystalLoot = value; break;
            case 2: newCRs[index].deuteriumLoot = value; break;
            case 3: newCRs[index].debrisMetal = value; break;
            case 4: newCRs[index].debrisCrystal = value; break;
            case 5: newCRs[index].debrisReaperMetal = value; break;
            case 6: newCRs[index].debrisReaperCrystal = value; break;
            default: break;
        }
        setCombatReports(newCRs);
    }

    useEffect(() => {
        let attackResultsRows = []
        let totalResults = {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            metalDF: 0,
            crystalDF: 0,
            reaperMetal: 0,
            reaperCrystal: 0
        }
        combatReports.forEach((report, index) => {
            if (report.attackers.length > 1)
                attackResultsRows.push((
                    <div className="row" key={`ACSATTACKRESULT${report.key}`}>
                        <div>#{index + 1} </div>
                        <div>
                            <TextInput value={report.metalLoot} onChange={event => onResourceChange(event, index, 0)} />
                        </div>
                        <div>
                            <TextInput value={report.crystalLoot} onChange={event => onResourceChange(event, index, 1)} />
                        </div>
                        <div>
                            <TextInput value={report.deuteriumLoot} onChange={event => onResourceChange(event, index, 2)} />
                        </div>
                        <div>
                            <TextInput value={report.debrisMetal} onChange={event => onResourceChange(event, index, 3)} />
                        </div>
                        <div>
                            <TextInput value={report.debrisCrystal} onChange={event => onResourceChange(event, index, 4)} />
                        </div>
                        <div>
                            <TextInput value={report.debrisReaperMetal} onChange={event => onResourceChange(event, index, 5)} />
                        </div>
                        <div>
                            <TextInput value={report.debrisReaperCrystal} onChange={event => onResourceChange(event, index, 6)} />
                        </div>
                    </div>
                ))
            totalResults.metal += report.metalLoot;
            totalResults.crystal += report.crystalLoot;
            totalResults.deuterium += report.deuteriumLoot;
            totalResults.metalDF += report.debrisMetal;
            totalResults.crystalDF += report.debrisCrystal;
            totalResults.reaperMetal += report.debrisReaperMetal;
            totalResults.reaperCrystal += report.debrisReaperCrystal;
        })
        attackResultsRows.push((
            <div className="row" key={`ACSATTACKRESULTTOTAL`}>
                <div>{t("Total")}</div>
                <div>{totalResults.metal}</div>
                <div>{totalResults.crystal}</div>
                <div>{totalResults.deuterium}</div>
                <div>{totalResults.metalDF}</div>
                <div>{totalResults.crystalDF}</div>
                <div>{totalResults.reaperMetal}</div>
                <div>{totalResults.reaperCrystal}</div>
            </div>
        ))
        setAttackResultsRows(attackResultsRows);
    }, [combatReports])

    return (
        <div>
            <SectionTitle
                title={t("ACSAttackResults")}
                icon={DataVisible ? "caret-up" : "caret-down"}
                onClick={() => setDataVisible(!DataVisible)}
            />
            <div
                className="acs-attack-results"
                style={{ display: DataVisible && AttackResultsRows.length > 1 ? "flex" : "none" }}
            >
                <div className="row">
                    <div><i className={`fas fa-fighter-jet`} /></div>
                    <div>{t("Metal")}</div>
                    <div>{t("Crystal")}</div>
                    <div>{t("Deuterium")}</div>
                    <div>{t("DFMetal")}</div>
                    <div>{t("DFCrystal")}</div>
                    <div>{t("DFReaperMetal")}</div>
                    <div>{t("DFReaperCrystal")}</div>
                </div>
                {AttackResultsRows}
            </div>
        </div>

    )
}