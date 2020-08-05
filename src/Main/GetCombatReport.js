import axios from 'axios';
import config from '../config.json';
import { SetResourceStatistics } from './SetResourceStatistics';

export const GetCombatReport = (
    combatReport,
    CombatReports,
    setCombatReports,
    setApiKeyInputValidity,
    setLoading,
    setApiKeyInputValidityMessage,
    settingsData,
    setSettingsData
) => {
    let exists = CombatReports.find(cr => cr.key === combatReport);
    if (!exists) {
        setLoading(true);
        const request = {
            method: "GET",
            url: `${config.api}/api/combat?combatReport=${combatReport}`
        };

        axios(request)
            .then(function (response) {
                let data = response.data;

                if (CombatReports.length > 0 && CombatReports[0].coordinates !== data.generic.combat_coordinates) {
                    setApiKeyInputValidity(false);
                    setApiKeyInputValidityMessage("InvalidCoordinates");
                    setLoading(false);
                } else {
                    let crdata = {};
                    crdata.key = data.Id;
                    crdata.coordinates = data.generic.combat_coordinates;

                    crdata.metalLoot = data.generic.loot_metal;
                    crdata.crystalLoot = data.generic.loot_crystal;
                    crdata.deuteriumLoot = data.generic.loot_deuterium;
                    crdata.debrisMetal = data.generic.debris_metal;
                    crdata.debrisCrystal = data.generic.debris_crystal;
                    crdata.debrisReaperMetal = data.generic.debris_reaper_metal_retrieved;
                    crdata.debrisReaperCrystal = data.generic.debris_reaper_crystal_retrieved;

                    crdata.attackers = ParseFleeterData(
                        data.attackers,
                        data.rounds.length > 0 ? data.rounds[data.rounds.length - 1].attacker_ships : [],
                        false,
                        data.repaired_defenses
                    );

                    crdata.defenders = ParseFleeterData(
                        data.defenders,
                        data.rounds.length > 0 ? data.rounds[data.rounds.length - 1].defender_ships : [],
                        true,
                        data.repaired_defenses
                    );

                    let crs = [...CombatReports];
                    crs.push(crdata);
                    setApiKeyInputValidity(true);
                    setApiKeyInputValidityMessage("");
                    SetResourceStatistics(crs, settingsData);
                    setCombatReports(crs);
                    setSettingsData({ ...settingsData, probeStorage: crdata.probe_storage })
                }
            })
            .catch(function (error) {
                setLoading(false);
                setApiKeyInputValidity(false);
                console.log(error);
                if (error.response)
                    switch (error.response.status) {
                        case 400:
                            setApiKeyInputValidityMessage("InvalidKey");
                            break;
                        case 500:
                            setApiKeyInputValidityMessage("ServerError");
                            break;
                        default:
                            setApiKeyInputValidityMessage("UnknownError");
                    }
                else
                    setApiKeyInputValidityMessage("UnknownError");
            })
    } else {
        setApiKeyInputValidity(false);
        setApiKeyInputValidityMessage("KeyAlreadyExists");
    }
}

function ParseFleeterData(data, finalRound, isDefender, repairedDefences) {
    let fleeters = [];
    data.forEach(item => {

        if (!fleeters.some(fltr => fltr.ownerId === item.fleet_owner_id)) {
            fleeters.push({
                ownerId: item.fleet_owner_id,
                name: item.fleet_owner,
                alliance: item.fleet_owner_alliance_tag,
                isCollecter: item.fleet_owner_character_class_id === 1,
                hyperspaceTech: 0,
                fleet: []
            })
        }

        item.fleet_composition.forEach(fltcmp => {
            let fleeterIndex = fleeters.findIndex(fltr => fltr.ownerId === item.fleet_owner_id);

            if (!fleeters[fleeterIndex].fleet.some(flt => flt.shipType === fltcmp.ship_type)) {
                fleeters[fleeterIndex].fleet.push({
                    shipType: fltcmp.ship_type,
                    preCount: fltcmp.count,
                    postCount: fltcmp.count
                })
            }
            else {
                let fleetIndex = fleeters[fleeterIndex].fleet.findIndex(flt => flt.shipType === fltcmp.ship_type);
                fleeters[fleeterIndex].fleet[fleetIndex].preCount += fltcmp.count;
                fleeters[fleeterIndex].fleet[fleetIndex].postCount = fleeters[fleeterIndex].fleet[fleetIndex].preCount;
            }
        })
    });

    if (finalRound.length > 0) {
        finalRound.forEach(ship => {
            let fleeterIndex = fleeters.findIndex(fltr => fltr.ownerId === data[ship.owner].fleet_owner_id);
            let fleetIndex = fleeters[fleeterIndex].fleet.findIndex(flt => flt.shipType === ship.ship_type);
            fleeters[fleeterIndex].fleet[fleetIndex].postCount = ship.count;
        })
    }

    if (isDefender)
        repairedDefences.forEach(repaired => {
            let fleetIndex = fleeters[0].fleet.findIndex(flt => flt.shipType === repaired.repaired_type);
            fleeters[0].fleet[fleetIndex].postCount = repaired.repaired_count;
        })
    return fleeters;
}