import React, { useEffect, useState, useRef } from 'react';

import { useTranslation } from "react-i18next";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import './CustomReport.css';
import { SetResourceStatistics } from '../../Main/SetResourceStatistics';
import RecyclerPickups from '../RecyclerPickups/RecyclerPickups';

export default function CustomReport({
    combatReports,
    setCombatReports,
    recycleReports,
    setRecycleReports,
    side,
    setShowCustom, 
    settingsData
 }) {
    const [Players, setPlayers] = useState([]);
    const [ReportType, setReportType] = useState("CR")
    const [PlayerCount, setNumberOfPlayers] = useState(2);
    const [PlayersChosen, setPlayersChosen] = useState([]);
    const { t } = useTranslation();

    const SaveReport = () => {
        if (PlayersChosen.length > 0) {
            switch (ReportType) {
                case "CR":
                    let crKey = `custom-cr-${Math.round(Math.random() * 100000)}`;
                    let cr = combatReports.find(crt => crt.key === crKey)
                    if (!cr) {
                        let newCR = {
                            key: crKey,
                            coordinates: "custom-coords",
                            metalLoot: 0,
                            crystalLoot: 0,
                            deuteriumLoot: 0,
                            debrisMetal: 0,
                            debrisCrystal: 0,
                            debrisReaperMetal: 0,
                            debrisReaperCrystal: 0
                        }
                        newCR.attackers = [];
                        newCR.defenders = [];
                        let fillPlayers = side === 0 ? newCR.attackers : newCR.defenders;
                        PlayersChosen.forEach(plyr => {
                            let playerData = Players.find(pd => pd.ownerId === plyr);
                            fillPlayers.push({
                                ownerId: playerData.ownerId,
                                name: playerData.name,
                                isCollecter: false,
                                hyperspaceTech: 0,
                                fleet: []
                            })
                        })
                        let newCRs = [...combatReports, newCR];
                        SetResourceStatistics(newCRs, settingsData);
                        setCombatReports(newCRs);
                        setShowCustom(false);
                    }
                    break;
                case "RR":
                    let rrKey = `custom-rr-${Math.round(Math.random() * 100000)}`;
                    let rr = recycleReports.find(rrt => rrt.key === rrKey);
                    if(!rr){
                        let playerData = Players.find(pd => pd.ownerId === PlayersChosen[0]);
                        let rrdata = {
                            key: rrKey,
                            coordinates: "custom-coords",
                            metal: 0,
                            crystal: 0,
                            ownerId: playerData.ownerId,
                            ownerName: playerData.name,
                            deuteriumConsumption: 0,
                            recyclers: 0,
                            reapers: 0
                        };
                        setRecycleReports([...recycleReports, rrdata])
                        setShowCustom(false);
                    }
                    break;
                default: break;
            }
        }
    }

    useEffect(() => {
        let players = [];
        combatReports.forEach(cr => {
            let parseFrom = side === 0 ? cr.attackers : cr.defenders;
            parseFrom.forEach(player => {
                let plyr = players.find(pl => pl.ownerId === player.ownerId);
                if (!plyr) {
                    players.push({
                        name: player.name,
                        ownerId: player.ownerId
                    })
                }
            })
        })
        recycleReports.forEach(rr => {
            let plyr = players.find(pl => pl.ownerId === rr.ownerId);
            if (!plyr) {
                players.push({
                    name: rr.name,
                    ownerId: rr.ownerId
                })
            }
        })
        setPlayers(players);
    }, [combatReports, recycleReports, side, settingsData])

    useEffect(() => {
        let playersChosen = [...PlayersChosen]
        if (playersChosen.length > PlayerCount)
            playersChosen.splice(0, playersChosen.length - PlayerCount);
        setPlayersChosen(playersChosen);
    }, [PlayerCount])

    return (
        <div className="custom-report-panel">
            <div className="card">
                <div className="title">
                    {t("AddManual")}
                    <i
                        className="fas fa-times-circle"
                        onClick={() => setShowCustom(false)}
                    />
                </div>
                <div className="section">
                    <div className="description">
                        {t("AddManualReportTypeDesc")}
                    </div>
                    <div className="options">
                        {["CR", "RR"].map(rpt => (
                            <div
                                className={`${rpt === ReportType ? "selected" : ""}`}
                                onClick={() => {
                                    setReportType(rpt)
                                    if (rpt === "RR")
                                        setNumberOfPlayers(1);
                                }}
                                key={`REPORTTYPE${rpt}`}
                            >{t(rpt)}</div>
                        ))}
                    </div>
                </div>
                {ReportType === "CR" ?
                    <div className="section">
                        <div className="description">
                            {t("AddManualPlayerCountDesc")}
                        </div>
                        <div className="options">
                            {[1, 2, 3, 4, 5].map(num => (
                                <div
                                    className={`${num === PlayerCount ? "selected" : ""}`}
                                    onClick={() => setNumberOfPlayers(num)}
                                    key={`PLAYERCOUNT${num}`}
                                >{num}</div>
                            ))}
                        </div>
                    </div> : ""}
                <div className="section">
                    <div className="description">
                        {t("AddManualChosePlayersDesc").replace("%count%", PlayerCount)}
                    </div>
                    <div className="options wrap">
                        {Players.map(plyr => (
                            <div
                                className={`${PlayersChosen.includes(plyr.ownerId) ? "selected" : ""}`}
                                onClick={() => {
                                    let playersChosen = [...PlayersChosen]
                                    if (!playersChosen.includes(plyr.ownerId)) {
                                        playersChosen.push(plyr.ownerId);
                                        if (playersChosen.length > PlayerCount)
                                            playersChosen.splice(0, playersChosen.length - PlayerCount);
                                        setPlayersChosen(playersChosen);
                                    }
                                }}
                                key={`PLAYERNAMES${plyr.ownerId}`}
                            >{plyr.name}</div>
                        ))}
                        <div>
                            <TextInput
                                placeholder={t("AddPlayer")}
                                onKeyUp={event => {
                                    if (event.keyCode === 13 && event.target.value !== "") {
                                        let players = [...Players];
                                        let newOwnderId = Math.round(Math.random() * 100000);
                                        let plyr = players.find(pl => pl.ownerId === newOwnderId);
                                        if (!plyr) {
                                            players.push({
                                                name: event.target.value,
                                                ownerId: newOwnderId
                                            })
                                            let playersChosen = [...PlayersChosen];
                                            playersChosen.push(newOwnderId);
                                            if (playersChosen.length > PlayerCount)
                                                playersChosen.splice(0, playersChosen.length - PlayerCount);
                                            setPlayersChosen(playersChosen);
                                        }
                                        event.target.value = "";
                                        setPlayers(players);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {PlayersChosen.length > 0 && PlayersChosen.length == PlayerCount ?
                    <div className="save">
                        <Button
                            onClick={SaveReport}
                        >{t("Save")}</Button>
                    </div> : ""}
            </div>
        </div>
    )
}