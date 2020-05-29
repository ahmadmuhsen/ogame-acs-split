import FleetTypes from '../FleetTypes.json';

export function SetResourceStatistics(combatReports) {
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

        CalculateLossFromShips(report.attackers);
        CalculateLossFromShips(report.defenders);
        CalculateDeuteriumConsumption(report.attackers);
        CalculateDeuteriumConsumption(report.attackers);
    })
}

function CalculateLossFromShips(fleeters) {
    fleeters.forEach(fleeter => {
        let totalLoss = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        Object.keys(fleeter.fleet).forEach(shipId => {
            let shipsLost = fleeter.fleet[shipId].preCount - fleeter.fleet[shipId].postCount;
            if (FleetTypes.ships[shipId]) {
                totalLoss.metal += shipsLost * FleetTypes.ships[shipId].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.ships[shipId].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.ships[shipId].buildCost.deuterium;
            }
            else {
                totalLoss.metal += shipsLost * FleetTypes.defence[shipId].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.defence[shipId].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.defence[shipId].buildCost.deuterium;
            }
        })
        fleeter.unitsLost = totalLoss
    })
}

function CalculateDeuteriumConsumption(fleeters) {
    fleeters.forEach(fleeter => {
        if (!fleeter.deuteriumConsumption)
            fleeter.deuteriumConsumption = 0;
    })
}