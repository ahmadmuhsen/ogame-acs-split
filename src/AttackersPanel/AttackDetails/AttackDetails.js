import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import AttackFleetDetails from '../AttackFleetDetails/AttackFleetDetails';
import { SetResourceStatistics } from '../../Main/SetResourceStatistics';

import './AttackDetails.css';

export default function AttackDetails({ combatReports, setCombatReports, index }) {
    const { t } = useTranslation();
    const [AttacksFleetDetails, setAttacksFleetDetails] = useState([]);
    const [DataVisible, setDataVisible] = useState(true)

    const onHyperTechnologyChange = (crIndex, attackerIndex, hyperspaceTech) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[attackerIndex].hyperspaceTech = !isNaN(hyperspaceTech) ? hyperspaceTech : 0;
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    const onDeuteriumConsumptionChange = (crIndex, attackerIndex, deuteriumConsumption) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[attackerIndex].deuteriumConsumption = !isNaN(deuteriumConsumption) ? deuteriumConsumption : 0;
        setCombatReports(combatNew);
    }

    const onPreFleetCompositionChange = (crIndex, attackerIndex, shipType, preCount) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[attackerIndex] = { ...combatNew[crIndex].attackers[attackerIndex] };
        let ship = combatNew[crIndex].attackers[attackerIndex].fleet.find(shp => shp.shipType === shipType);
        if (!ship) {
            combatNew[crIndex].attackers[attackerIndex].fleet.push({
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

    const onPostFleetCompositionChange = (crIndex, attackerIndex, shipType, postCount) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[attackerIndex] = { ...combatNew[crIndex].attackers[attackerIndex] };
        let ship = combatNew[crIndex].attackers[attackerIndex].fleet.find(shp => shp.shipType === shipType);
        if (ship) {
            ship.postCount = !isNaN(postCount) ? (postCount < ship.preCount ? postCount : ship.preCount) : 0;
        }
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    const onLootChange = (crIndex, attackerIndex, resType, units) => {
        let combatNew = [...combatReports];
        combatNew[crIndex][resType] = !isNaN(units) ? (units > 0 ? units : 0) : 0;
        setCombatReports(combatNew);
    }

    const onCollecterChange = (crIndex, attackerIndex, isCollecter) => {
        let combatNew = [...combatReports];
        combatNew[crIndex].attackers[attackerIndex].isCollecter = isCollecter;
        SetResourceStatistics(combatNew);
        setCombatReports(combatNew);
    }

    useEffect(() => {
        setAttacksFleetDetails(combatReports[index].attackers.map((attacker, attackerIndex) => {
            return (
                <AttackFleetDetails
                    attackFleet={attacker}
                    index={attackerIndex}
                    crIndex={index}
                    key={`ATTACKFLEETDETAILS${index}-${attackerIndex}`}
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
        <div className="attack-details">
            <div
                className={`attack-label ${DataVisible ? "expanded" : ""}`}
                onClick={() => setDataVisible(!DataVisible)}
            >
                <i className={`fas fa-${DataVisible ? "caret-right" : "caret-down"}`} />
                {t("Attack")} #{index + 1}
            </div>
            <div className="attack-fleet-details-panel" style={{ display: DataVisible ? "flex" : "none" }}>
                {AttacksFleetDetails}
            </div>
        </div>
    )
}