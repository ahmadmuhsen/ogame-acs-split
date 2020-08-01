import React, { useState, useEffect } from 'react';

import SectionTitle from '../SectionTitle/SectionTitle';
import PlayerTotals from './PlayerTotals/PlayerTotals';
import Summary from './Summary/Summary';
import TransportSummary from './TransportSummary/TransportSummary';

import { useTranslation } from "react-i18next";
import './Result.css';

export default function Result({
    combatReports,
    recycleReports,
    settingsData,
    side,
    playerTotalsStatistics,
    setPlayerTotalsStatistics,
    dataFromSharedReport
}) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    const [TotalResult, setTotalResult] = useState({});
    useEffect(() => {
        if (!dataFromSharedReport) {
            let playerTotals = [];
            let totalFleetValue = 0;
            if (combatReports.length > 0)
                combatReports.forEach(report => {
                    totalFleetValue += side === 0 ? report.totalAttackersFleetValue : report.totalDefendersFleetValue;
                    let fleeters = side === 0 ? report.attackers : report.defenders;
                    fleeters.forEach(fleeter => {
                        let player = playerTotals.find(plyr => plyr.ownerId === fleeter.ownerId);

                        let fleetTotal = {
                            preCount: 0,
                            postCount: 0
                        };
                        fleeter.fleet.forEach(ship => {
                            fleetTotal.preCount += ship.preCount;
                            fleetTotal.postCount += ship.postCount;
                        })

                        if (!player) {
                            player = {
                                resources: {
                                    metal: side === 0 ? fleeter.metalLoot : 0,
                                    crystal: side === 0 ? fleeter.crystalLoot : 0,
                                    deuterium: side === 0 ? fleeter.deuteriumLoot : 0,
                                },
                                losses: {
                                    metal: fleeter.unitsLost.metal,
                                    crystal: fleeter.unitsLost.crystal,
                                    deuterium: fleeter.unitsLost.deuterium,
                                },
                                deuteriumConsumption: fleeter.deuteriumConsumption,
                                consumptionConverted: {
                                    metal: (fleeter.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.metal),
                                    crystal: (fleeter.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.crystal)
                                },
                                fleet: fleetTotal,
                                ownerId: fleeter.ownerId,
                                name: fleeter.name,
                                alliance: fleeter.alliance,
                                fleetValue: fleeter.fleetValue
                            }
                            playerTotals.push(player);
                        }
                        else {
                            player.resources.metal += fleeter.metalLoot;
                            player.resources.crystal += fleeter.crystalLoot;
                            player.resources.deuterium += fleeter.deuteriumLoot;
                            player.losses.metal += fleeter.unitsLost.metal;
                            player.losses.crystal += fleeter.unitsLost.crystal;
                            player.losses.deuterium += fleeter.unitsLost.deuterium;
                            player.deuteriumConsumption += fleeter.deuteriumConsumption;
                            player.fleetValue += fleeter.fleetValue;
                            player.fleet.preCount += fleetTotal.preCount;
                            player.fleet.postCount += fleetTotal.postCount;
                            player.consumptionConverted.metal += (fleeter.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.metal);
                            player.consumptionConverted.crystal += (fleeter.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.crystal);
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
                                deuterium: 0,
                            },
                            losses: {
                                metal: 0,
                                crystal: 0,
                                deuterium: 0,
                            },
                            deuteriumConsumption: report.deuteriumConsumption,
                            consumptionConverted: {
                                metal: (report.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.metal),
                                crystal: (report.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.crystal)
                            },
                            fleet: {
                                preCount: 0,
                                postCount: 0
                            },
                            ownerId: report.ownerId,
                            name: report.ownerName
                        }
                        playerTotals.push(player);
                    }
                    else {
                        player.resources.metal += report.metal;
                        player.resources.crystal += report.crystal;
                        player.deuteriumConsumption += report.deuteriumConsumption;
                        player.consumptionConverted.metal += (report.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.metal);
                        player.consumptionConverted.crystal += (report.deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.crystal);
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
                metal: (deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.metal),
                crystal: (deuteriumConsumption / 2) * parseFloat(settingsData.conversationRate.crystal)
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
        } 
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
                    playerTotalsStatistics={playerTotalsStatistics}
                    setPlayerTotalsStatistics={setPlayerTotalsStatistics}
                    settingsData={settingsData}
                />
                <TransportSummary
                    playerTotalsStatistics={playerTotalsStatistics}
                />

            </div>
        </div>
    )
}