import axios from 'axios';
import config from '../config.json';

export const GetCombatReport = (combatReport, CombatReports, setCombatReports, setApiKeyInputValidity, setLoading, setApiKeyInputValidityMessage) => {
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
                console.log(crdata);
                crs.push(crdata);
                setApiKeyInputValidity(true);
                setApiKeyInputValidityMessage("");
                setCombatReports(crs);
            }
        })
        .catch(function (error) {
            setLoading(false);
            setApiKeyInputValidity(false);
            console.log(error.response);
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
        })
}

function ParseFleeterData(data, finalRound, isDefender, repairedDefences) {
    let fleeters = [];
    data.forEach(item => {
        if (!fleeters[item.fleet_owner_id]) {
            fleeters[item.fleet_owner_id] = {
                name: item.fleet_owner,
                alliance: item.fleet_owner_alliance_tag,
                fleet: []
            }
        }
        item.fleet_composition.forEach(fleet => {
            if (!fleeters[item.fleet_owner_id].fleet[fleet.ship_type])
                fleeters[item.fleet_owner_id].fleet[fleet.ship_type] = {
                    preCount: fleet.count
                }
            else {
                fleeters[item.fleet_owner_id].fleet[fleet.ship_type].preCount += fleet.count;
            }
            fleeters[item.fleet_owner_id].fleet[fleet.ship_type].postCount = fleeters[item.fleet_owner_id].fleet[fleet.ship_type].preCount;
        })
    });

    if (finalRound.length > 0) {
        finalRound.forEach(ship => {
            let itemID = data[ship.owner].fleet_owner_id;
            fleeters[itemID].fleet[ship.ship_type].postCount = ship.count;
        })
    }

    if (isDefender)
        repairedDefences.forEach(repaired => {
            let fleeterids = Object.keys(fleeters);
            if (fleeterids.length > 0 && fleeters[fleeterids[0]].fleet[repaired.repaired_type]) {
                fleeters[fleeterids[0]].fleet[repaired.repaired_type].postCount = repaired.repaired_count;
            }
        })
    return fleeters;
}