import React, { useState, useEffect } from 'react';

import SectionTitle from '../SectionTitle/SectionTitle';
import PlayerTotals from './PlayerTotals/PlayerTotals';
import Summary from './Summary/Summary';
import TransportSummary from './TransportSummary/TransportSummary';

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

        let resources = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        let gain = { ...resources };
        let loss = { ...resources };
        let net = { ...resources };
        let deuteriumConsumption = 0;

        playerTotals.forEach(playerTotal => {
            gain.metal += playerTotal.resources.metal;
            gain.crystal += playerTotal.resources.crystal;
            gain.deuterium += playerTotal.resources.deuterium;
            loss.metal += playerTotal.losses.metal;
            loss.crystal += playerTotal.losses.crystal;
            loss.deuterium += playerTotal.losses.deuterium;
            deuteriumConsumption += playerTotal.deuteriumConsumption;
        });

        net.metal = gain.metal - loss.metal;
        net.crystal = gain.crystal - loss.crystal;
        net.deuterium = gain.deuterium - loss.deuterium - deuteriumConsumption;

        playerTotals.forEach(playerTotal => {
        })

        playerTotals.forEach(playerTotal => {
            playerTotal.cut = { ...resources };
            playerTotal.cut.metal = net.metal / playerTotals.length;
            playerTotal.cut.crystal = net.crystal / playerTotals.length;
            playerTotal.cut.deuterium = net.deuterium / playerTotals.length;
            playerTotal.contribution = {
                metal: playerTotal.resources.metal - playerTotal.losses.metal - playerTotal.cut.metal,
                crystal: playerTotal.resources.crystal - playerTotal.losses.crystal - playerTotal.cut.crystal,
                deuterium: playerTotal.resources.deuterium - playerTotal.losses.deuterium - playerTotal.deuteriumConsumption - playerTotal.cut.deuterium,
            }
        })

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

                <div className="resources-bar">
                    <div className="bar">
                        <div><i className={`fas fa-calculator`} /></div>
                        <div>{t("Metal")}</div>
                        <div>{t("Crystal")}</div>
                        <div>{t("Deuterium")}</div>
                    </div>
                </div>

                <Summary
                    totalResult={TotalResult}
                />
                <PlayerTotals
                    playerTotalsStatistics={PlayerTotalsStatistics}
                    setPlayerTotalsStatistics={setPlayerTotalsStatistics}
                />
                <TransportSummary
                    playerTotalsStatistics={PlayerTotalsStatistics}
                />

            </div>
        </div>
    )
}