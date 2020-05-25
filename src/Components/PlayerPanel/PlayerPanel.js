import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import ShipTypes from "../../shipTypes.json";

import TextInput from "../TextInput/TextInput";
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
                        t={t}
                        isDefender={isDefender}
                        key={index}
                        isCoordinateOwner={isCoordinateOwner}
                    />
                ))
            }
        });
        setFleetStatistics(fleetStats);
    }, [combatReports, id, isCoordinateOwner, isDefender, t])

    return (
        <div className="player-panel">
            <div className="name">{`${ player.alliance != null ? `[${player.alliance}]` : ""} ${player.name}`}</div>
            <hr />
            {FleetStatistics}
        </div>
    )
}

function FleetStatistic({ fleet, number, t, isDefender, isCoordinateOwner }) {
    const [ShipStatistics, setShipStatistics] = useState([])
    const [DefenceStatistics, setDefenceStatistics] = useState([])
    useEffect(() => {

        let shipStatistics = [];
        Object.keys(ShipTypes.ships).forEach(shipId => {
            let emptyStat = {
                preCount: 0,
                postCount: 0
            }
            shipStatistics.push((
                <ShipStatistic
                    ship={fleet.fleet[shipId] ? fleet.fleet[shipId] : emptyStat}
                    key={shipId}
                    name={t(ShipTypes.ships[shipId])}
                />
            ))
        })
        setShipStatistics(shipStatistics);

        if (isDefender && isCoordinateOwner) {
            let defenceStatistics = [];
            Object.keys(ShipTypes.defence).forEach(defenceId => {
                let emptyStat = {
                    preCount: 0,
                    postCount: 0
                }
                defenceStatistics.push((
                    <ShipStatistic
                        ship={fleet.fleet[defenceId] ? fleet.fleet[defenceId] : emptyStat}
                        key={defenceId}
                        name={t(ShipTypes.defence[defenceId])}
                    />
                ))
            })
            setDefenceStatistics(defenceStatistics);
        }

    }, [fleet])

    return (
        <div className="fleet-stats">
            <div className="fleet-label">
                {`${isDefender ? t('Defence') : t('Attack')} #${number}`}
            </div>
            <div className="fleet-numbers">
                {ShipStatistics}
                {DefenceStatistics}
            </div>
        </div>
    )
}

function ShipStatistic({ ship, name }) {
    return (
        <div className="ship-statistic">
            <div className="ship-name">
                {name}
            </div>
            <TextInput
                value={ship.preCount}
                valid={true}
            />
            <TextInput
                value={ship.postCount}
                valid={true}
            />
            <div className="total-loss">{-(ship.preCount - ship.postCount)}</div>
        </div>
    )
}