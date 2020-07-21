import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";
import './PlayerTotals.css';

export default function PlayerTotals({ playerTotalsStatistics }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [PlayersTotals, setPlayersTotals] = useState([]);

    useEffect(() => {
        setPlayersTotals(playerTotalsStatistics.map((player, index) => {
            return (
                <div className="player-total">
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