import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";
import './PlayerTotals.css';

export default function PlayerTotals({ playerTotalsStatistics }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [PlayersTotals, setPlayersTotals] = useState([]);

    useEffect(() => {
        console.log(playerTotalsStatistics);
        setPlayersTotals(playerTotalsStatistics.map((player, index) => {
            return (
                <div
                    className="player-total-main"
                    key={`PLAYERTOTAL${index}`}
                >
                    <div className="player-total">
                        <div className="player-name">
                            {`${player.alliance ? `[${player.alliance}]` : ""} ${player.name}`}
                        </div>

                        <div className="label">{t("ResCollected")}</div>
                        <div className="data">
                            <div>{t("Metal")}</div>
                            <div>{FormatUnits(Math.round(player.resources.metal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Crystal")}</div>
                            <div>{FormatUnits(Math.round(player.resources.crystal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Deuterium")}</div>
                            <div>{FormatUnits(Math.round(player.resources.deuterium))}</div>
                        </div>

                        <div className="label">{t("UnitsLost")}</div>
                        <div className="data">
                            <div>{t("Metal")}</div>
                            <div>{FormatUnits(Math.round(player.losses.metal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Crystal")}</div>
                            <div>{FormatUnits(Math.round(player.losses.crystal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Deuterium")}</div>
                            <div>{FormatUnits(Math.round(player.losses.deuterium))}</div>
                        </div>

                        <div className="label">{t("FlightConsumption")}</div>
                        <div className="data">
                            <div>{t("Deuterium")}</div>
                            <div>{FormatUnits(Math.round(player.deuteriumConsumption))}</div>
                        </div>

                        <div className="label">{t("NetGain")}</div>
                        <div className="data">
                            <div>{t("Metal")}</div>
                            <div>{FormatUnits(Math.round(player.resources.metal - player.losses.metal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Crystal")}</div>
                            <div>{FormatUnits(Math.round(player.resources.crystal - player.losses.crystal))}</div>
                        </div>
                        <div className="data">
                            <div>{t("Deuterium")}</div>
                            <div>{FormatUnits(Math.round(player.resources.deuterium - player.losses.deuterium - player.deuteriumConsumption))}</div>
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