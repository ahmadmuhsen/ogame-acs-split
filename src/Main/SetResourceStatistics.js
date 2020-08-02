import FleetTypes from '../FleetTypes.json';

export function SetResourceStatistics(combatReports, settingsData) {

    combatReports.forEach(report => {
        let totalCapacity = 0;
        let totalAttackersFleetValue = 0;
        let totalDefendersFleetValue = 0;
        report.attackers.forEach(attacker => {
            let playerCapacity = 0;
            let playerFleetValue = 0;
            attacker.fleet.forEach(ship => {
                let classBonus = 0;
                if ([202, 203].includes(ship.shipType) && attacker.isCollecter) {
                    classBonus = FleetTypes.ships[ship.shipType].baseCapacity * 0.25;
                }
                playerCapacity += ship.postCount
                    * (((ship.shipType === 210 && settingsData.probeStorage ? FleetTypes.ships[ship.shipType].baseCapacitySpecial : FleetTypes.ships[ship.shipType].baseCapacity)
                        * (1 + (attacker.hyperspaceTech * 0.05))) + classBonus);

                playerFleetValue += ship.preCount * (
                    FleetTypes.ships[ship.shipType].buildCost.metal
                    + FleetTypes.ships[ship.shipType].buildCost.crystal
                    + FleetTypes.ships[ship.shipType].buildCost.deuterium
                )
            })
            attacker.fleetCapacity = playerCapacity;
            attacker.fleetValue = playerFleetValue;
            totalCapacity += playerCapacity;
            totalAttackersFleetValue += playerFleetValue;
        })

        report.defenders.forEach(defender => {
            let playerFleetValue = 0;
            defender.fleet.forEach(ship => {
                playerFleetValue += ship.preCount * (
                    FleetTypes.ships[ship.shipType] ?
                        FleetTypes.ships[ship.shipType].buildCost.metal
                        + FleetTypes.ships[ship.shipType].buildCost.crystal
                        + FleetTypes.ships[ship.shipType].buildCost.deuterium :
                        FleetTypes.defence[ship.shipType].buildCost.metal
                        + FleetTypes.defence[ship.shipType].buildCost.crystal
                        + FleetTypes.defence[ship.shipType].buildCost.deuterium
                )
            })
            defender.fleetValue = playerFleetValue;
            totalDefendersFleetValue += playerFleetValue;
        })

        report.totalAttackersFleetValue = totalAttackersFleetValue;
        report.totalDefendersFleetValue = totalDefendersFleetValue;

        report.attackers.forEach(attacker => {
            attacker.metalLoot = report.metalLoot * (attacker.fleetCapacity / totalCapacity);
            attacker.metalLoot = isNaN(attacker.metalLoot) ? 0 : attacker.metalLoot;
            attacker.crystalLoot = report.crystalLoot * (attacker.fleetCapacity / totalCapacity);
            attacker.crystalLoot = isNaN(attacker.crystalLoot) ? 0 : attacker.crystalLoot;
            attacker.deuteriumLoot = report.deuteriumLoot * (attacker.fleetCapacity / totalCapacity);
            attacker.deuteriumLoot = isNaN(attacker.deuteriumLoot) ? 0 : attacker.deuteriumLoot;
        })

        CalculateLossFromShips(report.attackers);
        CalculateLossFromShips(report.defenders);

        report.attackers.forEach(fleeter => {
            if (!fleeter.deuteriumConsumption)
                fleeter.deuteriumConsumption = 0;
        })

        report.defenders.forEach(fleeter => {
            if (!fleeter.deuteriumConsumption)
                fleeter.deuteriumConsumption = 0;
        })
    })
}

function CalculateLossFromShips(fleeters) {
    fleeters.forEach(fleeter => {
        let totalLoss = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        fleeter.fleet.forEach(ship => {
            let shipsLost = ship.preCount - ship.postCount;
            if (FleetTypes.ships[ship.shipType]) {
                totalLoss.metal += shipsLost * FleetTypes.ships[ship.shipType].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.ships[ship.shipType].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.ships[ship.shipType].buildCost.deuterium;
            }
            else {
                totalLoss.metal += shipsLost * FleetTypes.defence[ship.shipType].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.defence[ship.shipType].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.defence[ship.shipType].buildCost.deuterium;
            }
        })
        fleeter.unitsLost = totalLoss
    })
}