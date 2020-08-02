import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";

import TextInput from "../../TextInput/TextInput";
import ShipStatistic from "./ShipStatistic/ShipStatistic";
import FleetTypes from "../../../FleetTypes.json";
import './FleetStatistic.css';

export default function FleetStatistic({ fleet, number, isDefender, isCoordinateOwner }) {
    const { t } = useTranslation();
    const [ShipStatistics, setShipStatistics] = useState([]);
    const [DefenceStatistics, setDefenceStatistics] = useState([]);

    useEffect(() => {
        let shipStatistics = [];
        Object.keys(FleetTypes.ships).forEach(shipId => {
            let emptyStat = {
                preCount: 0,
                postCount: 0
            }
            shipStatistics.push((
                <ShipStatistic
                    ship={fleet.fleet[shipId] ? fleet.fleet[shipId] : emptyStat}
                    key={shipId}
                    name={t(FleetTypes.ships[shipId].i18nKey)}
                />
            ))
        })
        setShipStatistics(shipStatistics);

        if (isDefender && isCoordinateOwner) {
            let defenceStatistics = [];
            Object.keys(FleetTypes.defence).forEach(defenceId => {
                let emptyStat = {
                    preCount: 0,
                    postCount: 0
                }
                defenceStatistics.push((
                    <ShipStatistic
                        ship={fleet.fleet[defenceId] ? fleet.fleet[defenceId] : emptyStat}
                        key={defenceId}
                        name={t(FleetTypes.defence[defenceId].i18nKey)}
                        t={t}
                    />
                ))
            })
            setDefenceStatistics(defenceStatistics);
        }

    }, [fleet])

    return (
        <div className="fleet-statistic">
            <div className="fleet-results">
                <div className="report-number">
                    {`${isDefender ?
                        t("Defence") :
                        ("Attack")} [${number}]`}
                </div>
                <div className={`resources-result gain ${isDefender ? "hidden" : ""}`}>
                    <div>{`${t("Loot")}`}</div>
                    <div>{FormatUnits(Math.round(fleet.metalLoot))}</div>
                    <div>{FormatUnits(Math.round(fleet.crystalLoot))}</div>
                    <div>{FormatUnits(Math.round(fleet.deuteriumLoot))}</div>
                </div>
                <div className={`resources-result loss`}>
                    <div>{`${t("UnitsLost")}`}</div>
                    <div>{FormatUnits(fleet.unitsLost.metal)}</div>
                    <div>{FormatUnits(fleet.unitsLost.crystal)}</div>
                    <div>{FormatUnits(fleet.unitsLost.deuterium)}</div>
                </div>
                <div className={`deuterium-consumption ${isCoordinateOwner ? "hidden" : ""}`}>
                    <div className="label">{`${t("DeutConsumption")}`}</div>
                    <div className="input">
                        <TextInput
                            value={fleet.deuteriumConsumption}
                            valid={true}
                        />
                    </div>
                </div>
            </div>
            <div className="fleet-composition">
                <div className="composition-labels">
                    <div>
                    </div>
                    <div>
                        {t("PreAttack")}
                    </div>
                    <div>
                        {t("PostAttack")}
                    </div>
                    <div>
                    </div>
                </div>
                <div className="composition-statistics">
                    {ShipStatistics}
                    {DefenceStatistics}
                </div>
            </div>
        </div>
    )
}