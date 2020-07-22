import React, { useState, useEffect } from 'react';
import TextInput from "../../TextInput/TextInput"
import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";

import './PlayerTotals.css';

export default function PlayerTotals({ playerTotalsStatistics, setPlayerTotalsStatistics }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [PlayersTotals, setPlayersTotals] = useState([]);

    let onSettlementChange = (from, to, resource, value) => {
        let playerTotalTemp = [...playerTotalsStatistics];
        value = isNaN(value) ? 0 : value;
        let fromPlayer = playerTotalTemp.find(total => total.ownerId === from);
        let toPlayer = playerTotalTemp.find(total => total.ownerId === to);

        let alreadySettled = 0;
        playerTotalTemp.forEach(total => {
            if (total.settlements && total.ownerId !== from) {
                let resSett = total.settlements.find(sett => sett.to === to && sett.resource === resource);
                if (resSett) {
                    alreadySettled += resSett.value;
                }
            }
        })

        if (!fromPlayer.settlements)
            fromPlayer.settlements = [];
        if (!fromPlayer.settled)
            fromPlayer.settled = { metal: 0, crystal: 0, deuterium: 0 };
        if (!toPlayer.settlementsRecieved)
            toPlayer.settlementsRecieved = { metal: 0, crystal: 0, deuterium: 0 };

        let settlement = fromPlayer.settlements.find(sett => sett.to === to && sett.resource === resource);
        if (!settlement) {
            fromPlayer.settlements.push({
                to: to,
                resource: resource,
                value: value < fromPlayer.contribution[resource] - fromPlayer.settled[resource] ? value : fromPlayer.contribution[resource] - fromPlayer.settled[resource]
            })
            settlement = fromPlayer.settlements.find(sett => sett.to === to && sett.resource === resource);
        }
        else {
            fromPlayer.settled[resource] -= settlement.value;
            settlement.value = value < fromPlayer.contribution[resource] - fromPlayer.settled[resource] ? value : fromPlayer.contribution[resource] - fromPlayer.settled[resource];
        }
        settlement.value = settlement.value <= Math.abs(toPlayer.contribution[resource]) ? settlement.value : Math.abs(toPlayer.contribution[resource]);
        settlement.value = settlement.value <= Math.abs(toPlayer.contribution[resource]) - alreadySettled ? settlement.value : Math.abs(toPlayer.contribution[resource]) - alreadySettled;
        settlement.value = Math.round(settlement.value);
        fromPlayer.settled[resource] = 0;
        fromPlayer.settlements.forEach(sett => {
            if (sett.resource === resource)
                fromPlayer.settled[resource] += sett.value
        });

        let totalSettlementRecieved = 0;
        playerTotalTemp.forEach(total => {
            if (total.settlements) {
                let resSett = total.settlements.find(sett => sett.to === to && sett.resource === resource);
                if (resSett) {
                    totalSettlementRecieved += resSett.value;
                }
            }
        })
        toPlayer.settlementsRecieved[resource] = totalSettlementRecieved;

        setPlayerTotalsStatistics(playerTotalTemp);

    }

    useEffect(() => {
        setPlayersTotals(playerTotalsStatistics.map(player => {
            console.log(player);
            let resourceNeeded = {
                metal: player.contribution.metal < 0 ? true : false,
                crystal: player.contribution.crystal < 0 ? true : false,
                deuterium: player.contribution.deuterium < 0 ? true : false
            }
            let settlments = [];
            playerTotalsStatistics.forEach(playerTotal => {
                if ((playerTotal.contribution.metal > 0 && resourceNeeded.metal)
                    || (playerTotal.contribution.crystal > 0 && resourceNeeded.crystal)
                    || (playerTotal.contribution.deuterium > 0 && resourceNeeded.deuterium)) {
                    let metalValue = !playerTotal.settlements || !playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "metal") ? 0 :
                        playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "metal").value;
                    let crystalValue = !playerTotal.settlements || !playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "crystal") ? 0 :
                        playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "crystal").value;
                    let deutValue = !playerTotal.settlements || !playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "deuterium") ? 0 :
                        playerTotal.settlements.find(sett => sett.to === player.ownerId && sett.resource === "deuterium").value;
                    settlments.push((
                        <div className="row" key={`PLAYERSETTLEMENT${playerTotal.ownerId}`}>
                            <div>{playerTotal.name}</div>

                            {playerTotal.contribution.metal > 0 && resourceNeeded.metal ?
                                <div className="contribution-prompt">
                                    <div
                                        className={player.settlementsRecieved && player.settlementsRecieved.metal === Math.round(Math.abs(player.contribution.metal)) ? "settlement-full" : ""}
                                        onClick={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "metal", Math.abs(player.contribution.metal))}
                                    >({FormatUnits(Math.round(playerTotal.contribution.metal - (!playerTotal.settled ? 0 : playerTotal.settled.metal)))})</div>
                                    <TextInput
                                        className={player.settlementsRecieved
                                            && player.settlementsRecieved.metal === Math.round(Math.abs(player.contribution.metal))
                                            && metalValue === 0 ? "settlement-full" : ""}
                                        value={metalValue}
                                        onChange={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "metal", parseInt(e.target.value))} />
                                </div>
                                : <div></div>}

                            {playerTotal.contribution.crystal > 0 && resourceNeeded.crystal ?
                                <div className="contribution-prompt">
                                    <div
                                        className={player.settlementsRecieved && player.settlementsRecieved.crystal === Math.round(Math.abs(player.contribution.crystal)) ? "settlement-full" : ""}
                                        onClick={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "crystal", Math.abs(player.contribution.crystal))}
                                    >({FormatUnits(Math.round(playerTotal.contribution.crystal - (!playerTotal.settled ? 0 : playerTotal.settled.crystal)))})</div>
                                    <TextInput
                                        className={player.settlementsRecieved
                                            && player.settlementsRecieved.crystal === Math.round(Math.abs(player.contribution.crystal))
                                            && crystalValue === 0 ? "settlement-full" : ""}
                                        value={crystalValue}
                                        onChange={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "crystal", parseInt(e.target.value))} />
                                </div>
                                : <div></div>}

                            {playerTotal.contribution.deuterium > 0 && resourceNeeded.deuterium ?
                                <div className="contribution-prompt">
                                    <div
                                        className={player.settlementsRecieved && player.settlementsRecieved.deuterium === Math.round(Math.abs(player.contribution.deuterium)) ? "settlement-full" : ""}
                                        onClick={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "deuterium", Math.abs(player.contribution.deuterium))}
                                    >({FormatUnits(Math.round(playerTotal.contribution.deuterium - (!playerTotal.settled ? 0 : playerTotal.settled.deuterium)))})</div>
                                    <TextInput
                                        className={player.settlementsRecieved
                                            && player.settlementsRecieved.deuterium === Math.round(Math.abs(player.contribution.deuterium))
                                            && deutValue === 0 ? "settlement-full" : ""}
                                        value={deutValue}
                                        onChange={(e) => onSettlementChange(playerTotal.ownerId, player.ownerId, "deuterium", parseInt(e.target.value))} />
                                </div>
                                : <div></div>}
                        </div>
                    ))
                }
            });

            return (
                <div className="player-total" key={`PLAYERTOTAL${player.ownerId}`}>
                    <div className="player-name">
                        <div className="text">
                            <div>
                                {player.name}
                            </div>
                            <div>
                                {`${player.alliance != null ? `[${player.alliance}]` : ""}`}
                            </div>
                        </div>
                    </div>
                    <div className="result-resources">
                        <div className="data">
                            <div className="row">
                                <div>{t("ResCollected")}</div>
                                <div>{FormatUnits(Math.round(player.resources.metal))}</div>
                                <div>{FormatUnits(Math.round(player.resources.crystal))}</div>
                                <div>{FormatUnits(Math.round(player.resources.deuterium))}</div>
                            </div>
                            <div className="row">
                                <div>{t("UnitsLost")}</div>
                                <div>{FormatUnits(Math.round(player.losses.metal))}</div>
                                <div>{FormatUnits(Math.round(player.losses.crystal))}</div>
                                <div>{FormatUnits(Math.round(player.losses.deuterium))}</div>
                            </div>
                            <div className="row">
                                <div>{t("FlightConsumption")}</div>
                                <div>0</div>
                                <div>0</div>
                                <div>{FormatUnits(Math.round(player.deuteriumConsumption))}</div>
                            </div>
                            <div className="row">
                                <div>{t("PlayerCut")}</div>
                                <div>{FormatUnits(Math.round(player.cut.metal))}</div>
                                <div>{FormatUnits(Math.round(player.cut.crystal))}</div>
                                <div>{FormatUnits(Math.round(player.cut.deuterium))}</div>
                            </div>
                            <div className="row">
                                <div>{t("Contribution")}</div>
                                <div>{FormatUnits(Math.round(player.contribution.metal))}</div>
                                <div>{FormatUnits(Math.round(player.contribution.crystal))}</div>
                                <div>{FormatUnits(Math.round(player.contribution.deuterium))}</div>
                            </div>
                            {settlments.length > 0 ?
                                <div className="row settlement-title">
                                    {t("ResourceTransports")}
                                </div> : ""}
                            {settlments.length > 0 ?
                                settlments : ""}
                        </div>
                    </div>
                </div>
            )
        }));
    }, [playerTotalsStatistics])

    return (
        <div className="player-totals-main">
            <div
                className={`player-totals-label ${DataVisible ? "expanded" : ""}`}
                onClick={() => setDataVisible(!DataVisible)}
            >
                <i className={`fas fa-${DataVisible ? "caret-right" : "caret-down"}`} />
                {t("PlayerTotals")}
            </div>
            <div
                className="player-totals"
                style={{ display: DataVisible ? "flex" : "none" }}
            >
                {PlayersTotals}
            </div>
        </div>
    )
}