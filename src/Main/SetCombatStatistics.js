export const SetCombatStatistics = (combatReports, SetAttackers, SetDefenders) => {
    let attackers = [];
    let defenders = [];
    combatReports.forEach(item => {
        attackers.push(item.attackers);
        defenders.push(item.defenders);
    })
    SetAttackers(CalculateTotalFleeterStatistics(attackers));
    SetDefenders(CalculateTotalFleeterStatistics(defenders));
}

function CalculateTotalFleeterStatistics(fleeters) {
    let totalStats = [];
    fleeters.forEach(item => {
        item.forEach((fleeter, id) => {
            if (!totalStats[id]) {
                totalStats[id] = {
                    name: fleeter.name,
                    alliance: fleeter.alliance,
                    fleet: []   
                };
                fleeter.fleet.forEach((ship, type) => {
                    totalStats[id].fleet[type] = {
                        preCount: ship.preCount,
                        postCount: ship.postCount
                    };
                })
            }
            else {
                fleeter.fleet.forEach((ship, type) => {
                    if (!totalStats[id].fleet[type]) {
                        totalStats[id].fleet[type] = ship;
                    }
                    else {
                        totalStats[id].fleet[type].preCount += ship.preCount;
                        totalStats[id].fleet[type].postCount += ship.postCount;
                    }
                })
            }
        })
    })
    return totalStats;
}