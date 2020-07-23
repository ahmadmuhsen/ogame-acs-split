import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";
import './TransportSummary.css';

export default function TransportSummary({ playerTotalsStatistics }) {
    const { t } = useTranslation();
    const [Transports, setTransports] = useState([])
    useEffect(() => {
        let transports = [];
        playerTotalsStatistics.forEach(stat => {
            console.log(stat);
            if (stat.settlements) {
                stat.settlements.forEach(sett => {
                    let toName = playerTotalsStatistics.find(pl => pl.ownerId === sett.to).name;
                    let trnsprt = transports.find(tr => tr.from === stat.name && tr.to === toName);
                    if (!trnsprt) {
                        transports.push({
                            from: stat.name,
                            to: toName,
                            resources: {
                                metal: 0,
                                crystal: 0,
                                deuterium: 0
                            }
                        });
                        trnsprt = transports.find(tr => tr.from === stat.name && tr.to === toName);
                    }
                    if (sett.value > 0)
                        trnsprt.resources[sett.resource] += sett.value

                })
            }
        });
        setTransports(transports);
    }, [playerTotalsStatistics])

    return (
        <div className="transport-summary">
            <div className="title">
                <div className="text">
                    {t("TransportSummary")}
                </div>
            </div>

            <div className="result-transport">
                <div className="data">
                    {Transports.length === 0 ?
                        <div>{t("NoTransports")}</div> :
                        Transports.map(trs => {
                            let typesCount = 0;
                            let resMessage = "";
                            let resTypes = ["metal", "crystal", "deuterium"];
                            resTypes.forEach(resType => {
                                if (trs.resources[resType] > 0) {
                                    switch (typesCount) {
                                        case 0: resMessage += `${FormatUnits(trs.resources[resType])} ${resType}`; break;
                                        case 1:
                                        case 2: resMessage += ` + ${FormatUnits(trs.resources[resType])} ${resType}`; break;
                                        default: break;
                                    }
                                    typesCount++;
                                }
                            })

                            let message = t("TransportMessage")
                                .replace("%FromPlayer%", trs.from)
                                .replace("%ToPlayer%", trs.to)
                                .replace("%Resources%", resMessage);

                            return (
                                <div>
                                    {message}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}