import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FormatUnits } from '../../Main/FormatUnits';

import TextInput from '../../Components/TextInput/TextInput';
import FleetTypes from '../../FleetTypes.json';
import './AttackFleetDetails.css';

export default function AttackFleetDetails({
    attackFleet,
    index,
    crIndex,
    isACS,
    onHyperTechnologyChange,
    onDeuteriumConsumptionChange,
    onPreFleetCompositionChange,
    onPostFleetCompositionChange,
    onLootChange
}) {

    const { t } = useTranslation();
    const [FleetComposition, setFleetComposition] = useState([]);

    useEffect(() => {
        console.log(attackFleet);
        setFleetComposition(Object.keys(FleetTypes.ships).map((shipType) => {
            let fleetShip = attackFleet.fleet.find(flt => flt.shipType === parseInt(shipType));
            return (
                <div
                    className="fleet-composition"
                    key={`FLEETCOMPOSITION${index}-${shipType}`}
                >
                    <div className="ship-name">{t(FleetTypes.ships[shipType].i18nKey)}</div>
                    <div className="ship-count">
                        <TextInput
                            value={fleetShip ? fleetShip.preCount : 0}
                            onChange={event => onPreFleetCompositionChange(crIndex, index, parseInt(shipType), parseInt(event.target.value))}
                            valid={fleetShip ? fleetShip.preCount < 0 ? false : true : true}
                        />
                        <TextInput
                            value={fleetShip ? fleetShip.postCount : 0}
                            onChange={event => onPostFleetCompositionChange(crIndex, index, parseInt(shipType), parseInt(event.target.value))}
                            valid={fleetShip ? fleetShip.postCount < 0 ? false : true : true}
                        />
                    </div>
                </div>
            )
        }))
    }, [attackFleet])

    return (
        <div className="attack-fleet-details">
            <div className="card">
                <div className="player-name">{attackFleet.alliance ? `[${attackFleet.alliance}]` : "attackFleet.alliance"} {attackFleet.name}</div>
                <div className="hyperspace-tech">
                    {t("HyperspaceTech")}
                    <TextInput
                        value={attackFleet.hyperspaceTech}
                        onChange={event => onHyperTechnologyChange(crIndex, index, parseInt(event.target.value))}
                        valid={attackFleet.hyperspaceTech <= 0 ? false : true}
                    />
                </div>

                <div className="label">{t("Loot")}</div>
                <div className="one-input-info">
                    {t("Metal")}
                    {
                        isACS ?
                            <div>{FormatUnits(Math.round(attackFleet.metalLoot))}</div> :
                            <TextInput
                                value={Math.round(attackFleet.metalLoot)}
                                onChange={event => onLootChange(crIndex, index, "metalLoot", parseInt(event.target.value))}
                                valid={attackFleet.metalLoot < 0 ? false : true}
                            />

                    }
                </div>
                <div className="one-input-info">
                    {t("Crystal")}
                    {
                        isACS ?
                            <div>{FormatUnits(Math.round(attackFleet.crystalLoot))}</div> :
                            <TextInput
                                value={Math.round(attackFleet.crystalLoot)}
                                onChange={event => onLootChange(crIndex, index, "crystalLoot", parseInt(event.target.value))}
                                valid={attackFleet.crystalLoot < 0 ? false : true}
                            />
                    }
                </div>
                <div className="one-input-info">
                    {t("Deuterium")}
                    {
                        isACS ?
                            <div>{FormatUnits(Math.round(attackFleet.deuteriumLoot))}</div> :
                            <TextInput
                                value={Math.round(attackFleet.deuteriumLoot)}
                                onChange={event => onLootChange(crIndex, index, "deuteriumLoot", parseInt(event.target.value))}
                                valid={attackFleet.deuteriumLoot < 0 ? false : true}
                            />
                    }
                </div>

                <div className="label">{t("FlightConsumption")}</div>
                <div className="one-input-info">
                    {t("Deuterium")}
                    <TextInput
                        value={Math.round(attackFleet.deuteriumConsumption)}
                        onChange={event => onDeuteriumConsumptionChange(crIndex, index, parseInt(event.target.value))}
                        valid={attackFleet.deuteriumConsumption <= 0 ? false : true}
                    />
                </div>

                <div className="label">{t("FleetComposition")}</div>
                <div className="fleet-composition">
                    <div className="ship-name">{t("Ship")}</div>
                    <div className="ship-count">
                        <div>{t("PreAttack")}</div>
                        <div>{t("PostAttack")}</div>
                    </div>
                </div>
                {FleetComposition}

                <div className="label">{t("UnitsLost")}</div>
                <div className="one-input-info">
                    <div>{t("Metal")}</div>
                    <div>{FormatUnits(attackFleet.unitsLost.metal)}</div>
                </div>
                <div className="one-input-info">
                    <div>{t("Crystal")}</div>
                    <div>{FormatUnits(attackFleet.unitsLost.crystal)}</div>
                </div>
                <div className="one-input-info">
                    <div>{t("Deuterium")}</div>
                    <div>{FormatUnits(attackFleet.unitsLost.deuterium)}</div>
                </div>
            </div>
        </div>
    )
}