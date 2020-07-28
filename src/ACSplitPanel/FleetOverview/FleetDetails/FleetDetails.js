import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import FleeterDetails from './FleeterDetails/FleeterDetails';
import { SetResourceStatistics } from '../../../Main/SetResourceStatistics';

import './FleetDetails.css';

export default function FleetDetails({ combatReports, setCombatReports, index, side }) {
    const { t } = useTranslation();
    const [FleetersDetails, setFleetersDetails] = useState([]);
    const [DataVisible, setDataVisible] = useState(true)

    const onHyperTechnologyChange = (crIndex, fleeterIndex, hyperspaceTech) => {
        let combatNew = [...combatReports];
        let fleeter = side === 0 ? combatNew[crIndex].attackers[fleeterIndex] : combatNew[crIndex].defenders[fleeterIndex];
        fleeter.hyperspaceTech = !isNaN(hyperspaceTech) ? hyperspaceTech : 0;
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    const onDeuteriumConsumptionChange = (crIndex, fleeterIndex, deuteriumConsumption) => {
        let combatNew = [...combatReports];
        let fleeter = side === 0 ? combatNew[crIndex].attackers[fleeterIndex] : combatNew[crIndex].defenders[fleeterIndex];
        fleeter.deuteriumConsumption = !isNaN(deuteriumConsumption) ? deuteriumConsumption : 0;
        setCombatReports(combatNew);
    }

    const onPreFleetCompositionChange = (crIndex, fleeterIndex, shipType, preCount) => {
        let combatNew = [...combatReports];
        if (side === 0)
            combatNew[crIndex].attackers[fleeterIndex] = { ...combatNew[crIndex].attackers[fleeterIndex] };
        else
            combatNew[crIndex].defenders[fleeterIndex] = { ...combatNew[crIndex].defenders[fleeterIndex] };
        let fleeter = side === 0 ? combatNew[crIndex].attackers[fleeterIndex] : combatNew[crIndex].defenders[fleeterIndex];
        let ship = fleeter.fleet.find(shp => shp.shipType === shipType);
        if (!ship) {
            fleeter.fleet.push({
                shipType: shipType,
                preCount: !isNaN(preCount) ? preCount : 0,
                postCount: 0
            })
        } else {
            ship.preCount = !isNaN(preCount) ? preCount > ship.postCount ? preCount : ship.postCount : ship.postCount;
        }
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    const onPostFleetCompositionChange = (crIndex, fleeterIndex, shipType, postCount) => {
        let combatNew = [...combatReports];
        if (side === 0)
            combatNew[crIndex].attackers[fleeterIndex] = { ...combatNew[crIndex].attackers[fleeterIndex] };
        else
            combatNew[crIndex].defenders[fleeterIndex] = { ...combatNew[crIndex].defenders[fleeterIndex] };
        let fleeter = side === 0 ? combatNew[crIndex].attackers[fleeterIndex] : combatNew[crIndex].defenders[fleeterIndex];
        let ship = fleeter.fleet.find(shp => shp.shipType === shipType);
        if (ship) {
            ship.postCount = !isNaN(postCount) ? (postCount < ship.preCount ? postCount : ship.preCount) : 0;
        }
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    const onLootChange = (crIndex, fleeterIndex, resType, units) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[fleeterIndex][resType] = !isNaN(units) ? (units > 0 ? units : 0) : 0;
        setCombatReports(combatNew);
    }

    const onCollecterChange = (crIndex, fleeterIndex, isCollecter) => {
        let combatNew = [...combatReports];
        let fleeter = side === 0 ? combatNew[crIndex].attackers[fleeterIndex] : combatNew[crIndex].defenders[fleeterIndex];
        fleeter.isCollecter = isCollecter;
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    useEffect(() => {
        let fleeters = side === 0 ? combatReports[index].attackers : combatReports[index].defenders
        setFleetersDetails(fleeters.map((fltr, fltrIndex) => {
            return (
                <FleeterDetails
                    fleeter={fltr}
                    index={fltrIndex}
                    crIndex={index}
                    side={side}
                    key={`FLEETERDETAILS${index}-${fltrIndex}`}
                    isACS={combatReports[index].attackers.length > 1 ? true : false}
                    onHyperTechnologyChange={onHyperTechnologyChange}
                    onDeuteriumConsumptionChange={onDeuteriumConsumptionChange}
                    onPreFleetCompositionChange={onPreFleetCompositionChange}
                    onPostFleetCompositionChange={onPostFleetCompositionChange}
                    onLootChange={onLootChange}
                    onCollecterChange={onCollecterChange}
                />
            )
        }))
    }, [combatReports])

    return (
        <div className="fleet-details">
            <div
                className={`fleet-label ${DataVisible ? "expanded" : ""}`}
                onClick={() => setDataVisible(!DataVisible)}
            >
                <i className={`fas fa-${DataVisible ? "caret-right" : "caret-down"}`} />
                {t(side === 0 ? "Attack" : "Defend")} #{index + 1}
            </div>
            <div className="fleeter-details-panel" style={{ display: DataVisible ? "flex" : "none" }}>
                {FleetersDetails}
            </div>
        </div>
    )
}