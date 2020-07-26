import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FormatUnits } from '../../../../Main/FormatUnits';

import TextInput from '../../../../Components/TextInput/TextInput';
import FleetTypes from '../../../../FleetTypes.json';
import './FleeterDetails.css';

export default function FleeterDetails({
    fleeter,
    index,
    crIndex,
    side,
    isACS,
    onHyperTechnologyChange,
    onDeuteriumConsumptionChange,
    onPreFleetCompositionChange,
    onPostFleetCompositionChange,
    onLootChange,
    onCollecterChange
}) {

    const { t } = useTranslation();
    const [FleetComposition, setFleetComposition] = useState([]);

    useEffect(() => {
        let fleetComposition = [];
        const createRow = (shipType) => {
            let fleetShip = fleeter.fleet.find(flt => flt.shipType === parseInt(shipType));
            return (
                <div
                    className="fleet-composition"
                    key={`FLEETCOMPOSITION${index}-${shipType}`}
                >
                    <div className="ship-name">{t(FleetTypes.ships[shipType] ? FleetTypes.ships[shipType].i18nKey : FleetTypes.defence[shipType].i18nKey)}</div>
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
        };
        fleetComposition.push(Object.keys(FleetTypes.ships).map((shipType => createRow(shipType))))
        if (side === 1 && index === 0)
            fleetComposition.push(Object.keys(FleetTypes.defence).map((shipType => createRow(shipType))))
        setFleetComposition(fleetComposition);
    }, [fleeter])

    return (
        <div className="attack-fleet-details">
            <div className="card">
                <div className="player-name">{fleeter.alliance ? `[${fleeter.alliance}]` : "fleeter.alliance"} {fleeter.name}</div>

                {side === 0 ?
                    <div className="character-class">
                        <input type="checkbox" checked={(fleeter.isCollecter)} onChange={event => onCollecterChange(crIndex, index, event.target.checked)}></input>
                        {t("Collecter")}
                    </div> : ""}

                {side === 0 ?
                    <div className="hyperspace-tech">
                        {t("HyperspaceTech")}
                        <TextInput
                            value={fleeter.hyperspaceTech}
                            onChange={event => onHyperTechnologyChange(crIndex, index, parseInt(event.target.value))}
                            valid={fleeter.hyperspaceTech <= 0 ? false : true}
                        />
                    </div> : ""}

                {side === 0 ?
                    <div>
                        <div className="label">{t("Loot")}</div>
                        <div className="one-input-info">
                            {t("Metal")}
                            {
                                isACS ?
                                    <div>{FormatUnits(Math.round(fleeter.metalLoot))}</div> :
                                    <TextInput
                                        value={Math.round(fleeter.metalLoot)}
                                        onChange={event => onLootChange(crIndex, index, "metalLoot", parseInt(event.target.value))}
                                        valid={fleeter.metalLoot < 0 ? false : true}
                                    />

                            }
                        </div>
                        <div className="one-input-info">
                            {t("Crystal")}
                            {
                                isACS ?
                                    <div>{FormatUnits(Math.round(fleeter.crystalLoot))}</div> :
                                    <TextInput
                                        value={Math.round(fleeter.crystalLoot)}
                                        onChange={event => onLootChange(crIndex, index, "crystalLoot", parseInt(event.target.value))}
                                        valid={fleeter.crystalLoot < 0 ? false : true}
                                    />
                            }
                        </div>
                        <div className="one-input-info">
                            {t("Deuterium")}
                            {
                                isACS ?
                                    <div>{FormatUnits(Math.round(fleeter.deuteriumLoot))}</div> :
                                    <TextInput
                                        value={Math.round(fleeter.deuteriumLoot)}
                                        onChange={event => onLootChange(crIndex, index, "deuteriumLoot", parseInt(event.target.value))}
                                        valid={fleeter.deuteriumLoot < 0 ? false : true}
                                    />
                            }
                        </div>
                    </div> : ""}

                {!(side === 1 && index === 0) ?
                    <div>
                        <div className="label">{t("FlightConsumption")}</div>
                        <div className="one-input-info">
                            {t("Deuterium")}
                            <TextInput
                                value={Math.round(fleeter.deuteriumConsumption)}
                                onChange={event => onDeuteriumConsumptionChange(crIndex, index, parseInt(event.target.value))}
                                valid={fleeter.deuteriumConsumption <= 0 ? false : true}
                            />
                        </div>
                    </div> : ""}

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
                    <div>{FormatUnits(fleeter.unitsLost.metal)}</div>
                </div>
                <div className="one-input-info">
                    <div>{t("Crystal")}</div>
                    <div>{FormatUnits(fleeter.unitsLost.crystal)}</div>
                </div>
                <div className="one-input-info">
                    <div>{t("Deuterium")}</div>
                    <div>{FormatUnits(fleeter.unitsLost.deuterium)}</div>
                </div>
            </div>
        </div>
    )
}