import FleetTypes from '../FleetTypes.json';

export function SetResourceStatistics(combatReports){
    combatReports.forEach(report => {
        let totalCapacity = 0;
        report.attackers.forEach(attacker => {
            let playerCapacity = 0;
            Object.keys(attacker.fleet).forEach(shipId => {
                playerCapacity += attacker.fleet[shipId].postCount * FleetTypes.ships[shipId].baseCapacity;
            })
            attacker.fleetCapacity = playerCapacity;
            totalCapacity += playerCapacity;
        })

        report.attackers.forEach(attacker => {
            attacker.metalLoot = report.metalLoot * (attacker.fleetCapacity / totalCapacity)
            attacker.crystalLoot = report.crystalLoot * (attacker.fleetCapacity / totalCapacity)
            attacker.deuteriumLoot = report.deuteriumLoot * (attacker.fleetCapacity / totalCapacity)
        })
    })
}