import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import PlayerTotals from './PlayerTotals/PlayerTotals';
import Summary from './Summary/Summary';
import { useTranslation } from "react-i18next";
import './Result.css';

export default function Result({ combatReports, recycleReports }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [PlayerTotalsStatistics, setPlayerTotalsStatistics] = useState([]);
    const [TotalResult, setTotalResult] = useState({});
    useEffect(() => {
        let playerTotals = [];
        if (combatReports.length > 0)
            combatReports.forEach(report => {
                report.attackers.forEach(attacker => {
                    let player = playerTotals.find(plyr => plyr.ownerId === attacker.ownerId);

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
                            fleet: fleetTotal,
                            ownerId: attacker.ownerId,
                            name: attacker.name,
                            alliance: attacker.alliance,
                        }
                        playerTotals.push(player);
                    }
                    else {
                        player.resources.metal += attacker.metalLoot;
                        player.resources.crystal += attacker.crystalLoot;
                        player.resources.deuterium += attacker.deuteriumLoot;
                        player.losses.metal += attacker.unitsLost.metal;
                        player.losses.crystal += attacker.unitsLost.crystal;
                        player.losses.deuterium += attacker.unitsLost.deuterium;
                        player.deuteriumConsumption += attacker.deuteriumConsumption;
                        player.fleet.preCount += fleetTotal.preCount;
                        player.fleet.postCount += fleetTotal.postCount;
                    }
                });
            });

        if (recycleReports.length > 0)
            recycleReports.forEach(report => {
                let player = playerTotals.find(plyr => plyr.ownerId === report.ownerId);
                if (!player) {
                    player = {
                        resources: {
                            metal: report.metal,
                            crystal: report.crystal,
                            deuterium: report.deuterium,
                        },
                        losses: {
                            metal: 0,
                            crystal: 0,
                            deuterium: 0,
                        },
                        deuteriumConsumption: report.deuteriumConsumption,
                        fleet: {
                            preCount: 0,
                            postCount: 0
                        },
                        ownerId: report.ownerId,
                        name: report.name
                    }
                    playerTotals.push(player);
                }
                else {
                    player.resources.metal += report.metal;
                    player.resources.crystal += report.crystal;
                    player.deuteriumConsumption += report.deuteriumConsumption;
                }
            })

        playerTotals.forEach(playerTotal => {
            playerTotal.net = {
                metal: playerTotal.resources.metal - playerTotal.losses.metal,
                crystal: playerTotal.resources.crystal - playerTotal.losses.crystal,
                deuterium: playerTotal.resources.deuterium - playerTotal.losses.deuterium - playerTotal.deuteriumConsumption,
            }
        })

        console.log(playerTotals);

        let resources = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        let gain = {...resources};
        let loss = {...resources};
        let net = {...resources};
        let deuteriumConsumption = 0;

        playerTotals.forEach(total => {
            gain.metal += total.resources.metal;
            gain.crystal += total.resources.crystal;
            gain.deuterium += total.resources.deuterium;
            loss.metal += total.losses.metal;
            loss.crystal += total.losses.crystal;
            loss.deuterium += total.losses.deuterium;
            deuteriumConsumption += total.deuteriumConsumption;
        })

        net.metal = gain.metal - loss.metal;
        net.crystal = gain.crystal - loss.crystal;
        net.deuterium = gain.deuterium - loss.deuterium - deuteriumConsumption;

        setTotalResult({
            gain,
            loss,
            deuteriumConsumption,
            net
        });
        setPlayerTotalsStatistics(playerTotals);
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
                style={{ display: DataVisible && (combatReports.length > 0 || recycleReports.length > 0) ? "flex" : "none" }}
            >
                <Summary
                    totalResult={TotalResult}
                />
                <PlayerTotals
                    playerTotalsStatistics={PlayerTotalsStatistics}
                />
            </div>
        </div>
    )
}