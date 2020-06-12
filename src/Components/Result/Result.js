import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import PlayerTotals from './PlayerTotals/PlayerTotals'
import { useTranslation } from "react-i18next";
import './Result.css';

export default function Result({ combatReports, recycleReports }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);

    useEffect(() => {
        let result = {
            playerTotals: []
        }
        if (combatReports.length > 0)
            combatReports.forEach(report => {
                report.attackers.forEach(attacker => {
                    let player = result.playerTotals.find(plyr => plyr.ownerId === attacker.ownerId);
                    
                    let fleetTotal = {
                        preCount: 0,
                        postCount: 0
                    };
                    attacker.fleet.forEach(ship => {
                        fleetTotal.preCount += ship.preCount;
                        fleetTotal.postCount += ship.postCount;
                    })

                    if (!player) {
                        player = {
                            resources: {
                                metal: attacker.metalLoot,
                                crystal: attacker.crystalLoot,
                                deuterium: attacker.deuteriumLoot,
                            },
                            losses: {
                                metal: attacker.unitsLost.metal,
                                crystal: attacker.unitsLost.crystal,
                                deuterium: attacker.unitsLost.deuterium,
                            },
                            deuteriumConsumption: attacker.deuteriumConsumption,
                            name: attacker.name,
                            alliance: attacker.alliance,
                            fleet: fleetTotal
                        }
                        result.playerTotals.push(player);
                    }
                    else {
                        player.resources.metal += attacker.metalLoot;
                        player.resources.crystal += attacker.crystalLoot;
                        player.resources.deuterium += attacker.deuteriumLoot;
                        player.losses.metal += attacker.unitsLost.metalLoot;
                        player.losses.crystal += attacker.unitsLost.crystalLoot;
                        player.losses.deuterium += attacker.unitsLost.deuteriumLoot;
                        player.deuteriumConsumption += attacker.deuteriumConsumption;
                        player.fleet.preCount = fleetTotal.preCount;
                        player.fleet.postCount = fleetTotal.postCount;
                    }
                });
            });
        console.log(result);
    }, [combatReports, recycleReports])

    return (
        <div className="result-main">
            <SectionTitle
                title={t("Result")}
                icon={DataVisible ? "caret-up" : "caret-down"}
                onClick={() => setDataVisible(!DataVisible)}
            />
            <div
                className="result"
                style={{ display: DataVisible ? "flex" : "none" }}
            >
                <PlayerTotals

                />
            </div>
        </div>
    )
}