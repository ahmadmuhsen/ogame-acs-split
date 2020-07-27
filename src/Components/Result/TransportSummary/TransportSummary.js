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
            if (stat.settlements) {
                stat.settlements.forEach(sett => {
                    let toName = playerTotalsStatistics.find(pl => pl.ownerId === sett.to).name;
                    let trnsprt = transports.find(tr => tr.from === stat.name);
                    if (!trnsprt) {
                        transports.push({
                            from: stat.name,
                            allTransports: []
                        });
                        trnsprt = transports.find(tr => tr.from === stat.name);
                    }

                    let trnsprtTo = trnsprt.allTransports.find(atr => atr.to === toName);
                    if (!trnsprtTo)
                        trnsprt.allTransports.push({
                            to: toName,
                            resources: { metal: 0, crystal: 0, deuterium: 0 }
                        })
                    trnsprtTo = trnsprt.allTransports.find(atr => atr.to === toName);

                    if (sett.value > 0)
                        trnsprtTo.resources[sett.resource] += sett.value

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
                            let section = [];
                            section.push((<div key={`TRANSPORTSUMMARY${trs.from}`}>{t("TrasnsportSummaryTitle").replace("%FromPlayer%", trs.from)}</div>))

                            trs.allTransports.forEach(atr => {
                                let typesCount = 0;
                                let resMessage = "";
                                let resTypes = ["metal", "crystal", "deuterium"];
                                resTypes.forEach(resType => {
                                    if (atr.resources[resType] > 0) {
                                        switch (typesCount) {
                                            case 0: resMessage += `${FormatUnits(atr.resources[resType])} ${t(resType)}`; break;
                                            case 1:
                                            case 2: resMessage += ` + ${FormatUnits(atr.resources[resType])} ${t(resType)}`; break;
                                            default: break;
                                        }
                                        typesCount++;
                                    }
                                })

                                let message = t("TransportMessage")
                                    .replace("%ToPlayer%", atr.to)
                                    .replace("%Resources%", resMessage);
                                if (typesCount > 0)
                                    section.push((<div key={`TRANSPORTSUMMARY${trs.from}${atr.to}`}>{message}</div>))
                            })

                            return (
                                <div key={`TRANSPORTSUMMARYRESULT${trs.from}`}>
                                    {section}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}