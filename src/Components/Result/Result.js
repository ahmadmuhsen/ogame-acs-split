import React, { useState, useEffect } from 'react';

import SectionTitle from '../SectionTitle/SectionTitle';
import PlayerTotals from './PlayerTotals/PlayerTotals';
import Summary from './Summary/Summary';
import TransportSummary from './TransportSummary/TransportSummary';

import { useTranslation } from "react-i18next";
import './Result.css';

export default function Result({ combatReports, recycleReports, settingsData }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [PlayerTotalsStatistics, setPlayerTotalsStatistics] = useState([]);
    const [TotalResult, setTotalResult] = useState({});
    useEffect(() => {
        let playerTotals = [];
        let totalFleetValue = 0;
        if (combatReports.length > 0)
            combatReports.forEach(report => {
                totalFleetValue += report.totalFleetValue;
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
                            consumptionConverted: {
                                metal: (attacker.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[0]),
                                crystal: (attacker.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[1])
                            },
                            fleet: fleetTotal,
                            ownerId: attacker.ownerId,
                            name: attacker.name,
                            alliance: attacker.alliance,
                            fleetValue: attacker.fleetValue
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
                        player.fleetValue += attacker.fleetValue;
                        player.fleet.preCount += fleetTotal.preCount;
                        player.fleet.postCount += fleetTotal.postCount;
                        player.consumptionConverted.metal += (attacker.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[0]);
                        player.consumptionConverted.crystal += (attacker.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[1]);
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

        let consumptionConverted = {
            metal: (deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[0]),
            crystal: (deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate[1])
        }

        net.metal = gain.metal
            - (settingsData.reimburseFleetLoss ? loss.metal : 0)
            - (settingsData.reimburseDeutConsumption ? (settingsData.convertConsumption ? consumptionConverted.metal : 0) : 0);

        net.crystal = gain.crystal
            - (settingsData.reimburseFleetLoss ? loss.crystal : 0)
            - (settingsData.reimburseDeutConsumption ? (settingsData.convertConsumption ? consumptionConverted.crystal : 0) : 0);

        net.deuterium = gain.deuterium
            - (settingsData.reimburseFleetLoss ? loss.deuterium : 0)
            - (settingsData.reimburseDeutConsumption ? (!settingsData.convertConsumption ? deuteriumConsumption : 0) : 0);

        playerTotals.forEach(playerTotal => {
            playerTotal.cut = { ...resources };
            if (settingsData.weightedCut) {
                let percentage = playerTotal.fleetValue / totalFleetValue;
                playerTotal.cut.metal = net.metal * percentage;
                playerTotal.cut.crystal = net.crystal * percentage;
                playerTotal.cut.deuterium = net.deuterium * percentage;
            } else {
                playerTotal.cut.metal = net.metal / playerTotals.length;
                playerTotal.cut.crystal = net.crystal / playerTotals.length;
                playerTotal.cut.deuterium = net.deuterium / playerTotals.length;
            }
            playerTotal.contribution = {
                metal: playerTotal.resources.metal
                    - (settingsData.reimburseFleetLoss ? playerTotal.losses.metal : 0)
                    - playerTotal.cut.metal
                    - (settingsData.reimburseDeutConsumption ? (settingsData.convertConsumption ? playerTotal.consumptionConverted.metal : 0) : 0),

                crystal: playerTotal.resources.crystal
                    - (settingsData.reimburseFleetLoss ? playerTotal.losses.crystal : 0)
                    - playerTotal.cut.crystal
                    - (settingsData.reimburseDeutConsumption ? (settingsData.convertConsumption ? playerTotal.consumptionConverted.crystal : 0) : 0),

                deuterium: playerTotal.resources.deuterium
                    - (settingsData.reimburseFleetLoss ? playerTotal.losses.deuterium : 0)
                    - playerTotal.cut.deuterium
                    - (settingsData.reimburseDeutConsumption ? (!settingsData.convertConsumption ? playerTotal.deuteriumConsumption : 0) : 0)
            }
        })

        setTotalResult({
            gain,
            loss,
            deuteriumConsumption,
            consumptionConverted,
            net
        });
        setPlayerTotalsStatistics(playerTotals);
    }, [settingsData, combatReports, recycleReports])

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
                    settingsData={settingsData}
                />
                <PlayerTotals
                    playerTotalsStatistics={PlayerTotalsStatistics}
                    setPlayerTotalsStatistics={setPlayerTotalsStatistics}
                    settingsData={settingsData}
                />
                <TransportSummary
                    playerTotalsStatistics={PlayerTotalsStatistics}
                />

            </div>
        </div>
    )
}