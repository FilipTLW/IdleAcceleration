var game = {
    speed: new Decimal(0),
    acceleration: new Decimal(0),
    accelerators: {
        accel1: {
            amount: new Decimal(1),
            cost: new Decimal(1e1)
        },
        accel2: {
            amount: new Decimal(1),
            cost: new Decimal(1e3)
        },
        accel3: {
            amount: new Decimal(1),
            cost: new Decimal(1e5)
        },
        accel4: {
            amount: new Decimal(1),
            cost: new Decimal(1e7)
        },
        accel5: {
            amount: new Decimal(1),
            cost: new Decimal(1e11)
        },
        accel6: {
            amount: new Decimal(1),
            cost: new Decimal(1e15)
        },
        accel7: {
            amount: new Decimal(1),
            cost: new Decimal(1e19)
        },
        accel8: {
            amount: new Decimal(1),
            cost: new Decimal(1e23)
        },
        accel9: {
            amount: new Decimal(1),
            cost: new Decimal(1e30)
        },
        accel10: {
            amount: new Decimal(1),
            cost: new Decimal(1e40)
        }
    },
    acceleratorBoostsUnlocked: [],
    timeTravel: {
        unlocked: false,
        tachyons: new Decimal(0),
        tachyonUpgradesUnlocked: [],
        breakTimeUnlocked: false
    }
}

const LIGHT_SPEED = new Decimal("2.99792458e32")

const ACCELERATOR_BOOST_COSTS = [
    [new Decimal(1e1), new Decimal("1e27")]
]

const ACCELERATOR_BOOSTS = ["00", "01", "10", "11", "12", "13", "20", "21", "22", "23", "30", "31", "32", "33"]

const TACHYON_UPGRADE_COSTS = [
    [new Decimal(1), new Decimal(5), new Decimal(10), new Decimal(20)],
    [new Decimal(100)]
]

const TACHYON_UPGRADES = ["00", "01", "02", "03", "10"]

updateAccelerators()

var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);

function tick() {
    var now = Date.now();
    var dt = now - lastUpdate;
    dt /= 1000
    lastUpdate = now;

    update(dt)
}

function update(dt) {
    var speed = formatSI(game.speed)
    document.getElementById("speedValue").innerText = speed.val
    document.getElementById("speedUnit").innerText = speed.unit
    var acceleration = formatSI(game.acceleration)
    document.getElementById("accelerationValue").innerText = acceleration.val
    document.getElementById("accelerationUnit").innerText = acceleration.unit

    document.getElementById("tachyonsValue").innerText = format(game.timeTravel.tachyons)
    
    game.speed = game.speed.add(game.acceleration.mul(dt))
    game.acceleration = calcAcceleration()

    var progress = game.speed.log(LIGHT_SPEED) * 100
    if (progress < 0) {
        progress = 0
    }
    document.getElementById("progressValue").style.width = progress + "%"
    document.getElementById("progressValue").innerText = progress.toString().substring(0, 4) + "% to Light Speed"

    updateUnlockedStuff()

    if (game.speed.gte(LIGHT_SPEED)) {
        game.timeTravel.unlocked = true
        if (!game.timeTravel.breakTimeUnlocked) {
            document.getElementById("everything").hidden = true
            document.getElementById("timeTravelForcedScreen").hidden = false
        }
    }
}

function updateUnlockedStuff() {
    document.getElementById("timeTravelTabButton").hidden = !game.timeTravel.unlocked
    document.getElementById("tachyons").hidden = !game.timeTravel.unlocked
    document.getElementById("acceleratorBoost00val").textContent = game.timeTravel.tachyonUpgradesUnlocked.includes("01") ? "2.1" : "2"
}

function updateAccelerators() {
    var accel1amout = format(game.accelerators.accel1.amount)
    var accel1cost = formatSI(game.accelerators.accel1.cost)
    document.getElementById("acceleratorInfo1").innerText = "Amount: " + accel1amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel1.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel1cost.val + "\n" + accel1cost.unit + "/s"
    var accel2amout = format(game.accelerators.accel2.amount)
    var accel2cost = formatSI(game.accelerators.accel2.cost)
    document.getElementById("acceleratorInfo2").innerText = "Amount: " + accel2amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel2.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel2cost.val + "\n" + accel2cost.unit + "/s"
    var accel3amout = format(game.accelerators.accel3.amount)
    var accel3cost = formatSI(game.accelerators.accel3.cost)
    document.getElementById("acceleratorInfo3").innerText = "Amount: " + accel3amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel3.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel3cost.val + "\n" + accel3cost.unit + "/s"
    var accel4amout = format(game.accelerators.accel4.amount)
    var accel4cost = formatSI(game.accelerators.accel4.cost)
    document.getElementById("acceleratorInfo4").innerText = "Amount: " + accel4amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel4.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel4cost.val + "\n" + accel4cost.unit + "/s"
    var accel5amout = format(game.accelerators.accel5.amount)
    var accel5cost = formatSI(game.accelerators.accel5.cost)
    document.getElementById("acceleratorInfo5").innerText = "Amount: " + accel5amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel5.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel5cost.val + "\n" + accel5cost.unit + "/s"
    var accel6amout = format(game.accelerators.accel6.amount)
    var accel6cost = formatSI(game.accelerators.accel6.cost)
    document.getElementById("acceleratorInfo6").innerText = "Amount: " + accel6amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel6.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel6cost.val + "\n" + accel6cost.unit + "/s"
    var accel7amout = format(game.accelerators.accel7.amount)
    var accel7cost = formatSI(game.accelerators.accel7.cost)
    document.getElementById("acceleratorInfo7").innerText = "Amount: " + accel7amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel7.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel7cost.val + "\n" + accel7cost.unit + "/s"
    var accel8amout = format(game.accelerators.accel8.amount)
    var accel8cost = formatSI(game.accelerators.accel8.cost)
    document.getElementById("acceleratorInfo8").innerText = "Amount: " + accel8amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel8.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel8cost.val + "\n" + accel8cost.unit + "/s"
    var accel9amout = format(game.accelerators.accel9.amount)
    var accel9cost = formatSI(game.accelerators.accel9.cost)
    document.getElementById("acceleratorInfo9").innerText = "Amount: " + accel9amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel9.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel9cost.val + "\n" + accel9cost.unit + "/s"
    var accel10amout = format(game.accelerators.accel10.amount)
    var accel10cost = formatSI(game.accelerators.accel10.cost)
    document.getElementById("acceleratorInfo10").innerText = "Amount: " + accel10amout + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators.accel10.amount.mul(0.1).floor())) : "") + "\nSlowdown: " + accel10cost.val + "\n" + accel10cost.unit + "/s"
}

function format(value) {
    if (value.e >= 3) {
        return value.mantissa.toString().substring(0, 4) + "e" + value.e
    } else if (value.e == 0) {
        return value.toNumber().toString().substring(0, 3)
    } else if (value.e == 1) {
        return value.toNumber().toString().substring(0, 2)
    } else if (value.e == 2) {
        return value.toNumber().toString().substring(0, 3)
    } else {
        return value.toNumber().toString().substring(0, 3)
    }
}

function formatSI(value) {
    if (value.e >= 48) {
        let tmpval = new Decimal(value).div(new Decimal(1e48))
        return {val: format(tmpval), unit: "yottameters"}
    } else {
        let units = ["yoctometers", "zeptometers", "attometers", "femtometers", "picometers", "nanometers", "micrometers", "millimeters", "meters", "kilometers", "megameters", "gigameters", "terameters", "petameters", "exameters", "zettameters", "yottameters"]
        let unit = (value.e-(value.e % 3))/3
        let tmpval = new Decimal(value).div(new Decimal(10**(unit*3)))
        return {val: format(tmpval), unit: units[unit]}
    }
}

function onclickAccelerationTab() {
    document.getElementById("accelerationTab").hidden = false
    document.getElementById("settingsTab").hidden = true
    document.getElementById("statisticsTab").hidden = true
    document.getElementById("timeTravelTab").hidden = true
}

function onclickSettingsTab() {
    document.getElementById("accelerationTab").hidden = true
    document.getElementById("settingsTab").hidden = false
    document.getElementById("statisticsTab").hidden = true
    document.getElementById("timeTravelTab").hidden = true
}

function onclickStatisticsTab() {
    document.getElementById("accelerationTab").hidden = true
    document.getElementById("settingsTab").hidden = true
    document.getElementById("statisticsTab").hidden = false
    document.getElementById("timeTravelTab").hidden = true
}

function onclickTimeTravelTab() {
    document.getElementById("accelerationTab").hidden = true
    document.getElementById("settingsTab").hidden = true
    document.getElementById("statisticsTab").hidden = true
    document.getElementById("timeTravelTab").hidden = false
}

function onclickTachyonUpgradesSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = false
    document.getElementById("automationSubTab").hidden = true
    document.getElementById("breakTimeSubTab").hidden = true
}

function onclickAutomationSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = true
    document.getElementById("automationSubTab").hidden = false
    document.getElementById("breakTimeSubTab").hidden = true
}

function onclickBreakTimeSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = true
    document.getElementById("automationSubTab").hidden = true
    document.getElementById("breakTimeSubTab").hidden = false
}

function buyAccelerator(accel) {
    if (game.speed.gte(game.accelerators["accel" + accel].cost)) {
        game.speed = game.speed.sub(game.accelerators["accel" + accel].cost)
        game.accelerators["accel" + accel].amount = game.accelerators["accel" + accel].amount.add(new Decimal(1))
        game.accelerators["accel" + accel].cost = game.accelerators["accel" + accel].cost.mul(new Decimal(game.timeTravel.tachyonUpgradesUnlocked.includes("00") ? 1.5 : 2))
    }
    updateAccelerators()
}

function updateAcceleratorBoosts() {
    ACCELERATOR_BOOSTS.forEach(e => {
        document.getElementById("acceleratorBoost" + e).classList = game.acceleratorBoostsUnlocked.includes(e) ? ["acceleratorBoostUnlocked"] : ["acceleratorBoostLocked"]
    })
}

function onclickAcceleratorBoosts(row, col) {
    if (game.speed.gte(ACCELERATOR_BOOST_COSTS[row][col]) && !game.acceleratorBoostsUnlocked.includes("" + row + col)) {
        game.speed = game.speed.sub(ACCELERATOR_BOOST_COSTS[row][col])
        game.acceleratorBoostsUnlocked.push("" + row + col)
        updateAcceleratorBoosts()
        updateAccelerators()
    }
}

function calcAcceleration() {
    var ret =  game.accelerators.accel1.amount
    .mul(Math.floor(game.accelerators.accel2.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel3.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel4.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel5.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel6.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel7.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel8.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel9.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))
    .mul(Math.floor(game.accelerators.accel10.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)))

    if (game.acceleratorBoostsUnlocked.includes("00")) {
        ret = ret.pow(game.timeTravel.tachyonUpgradesUnlocked.includes("01") ? 2.1 : 2)
    }

    if (game.timeTravel.tachyonUpgradesUnlocked.includes("02") && game.timeTravel.tachyons.gte(1)) {
        ret = ret.mul(new Decimal(game.timeTravel.tachyons.log(5)).add(1))
    }
    
    return ret
}

function timeTravel() {
    if (game.speed.gte(LIGHT_SPEED)) {
        game.timeTravel.tachyons = game.timeTravel.tachyons.add(calcTachyonGain())
        game.speed = new Decimal(0)
        game.acceleration = new Decimal(0)
        game.accelerators = {
            accel1: {
                amount: new Decimal(1),
                cost: new Decimal(1e1)
            },
            accel2: {
                amount: new Decimal(1),
                cost: new Decimal(1e3)
            },
            accel3: {
                amount: new Decimal(1),
                cost: new Decimal(1e5)
            },
            accel4: {
                amount: new Decimal(1),
                cost: new Decimal(1e7)
            },
            accel5: {
                amount: new Decimal(1),
                cost: new Decimal(1e11)
            },
            accel6: {
                amount: new Decimal(1),
                cost: new Decimal(1e15)
            },
            accel7: {
                amount: new Decimal(1),
                cost: new Decimal(1e19)
            },
            accel8: {
                amount: new Decimal(1),
                cost: new Decimal(1e23)
            },
            accel9: {
                amount: new Decimal(1),
                cost: new Decimal(1e30)
            },
            accel10: {
                amount: new Decimal(1),
                cost: new Decimal(1e40)
            }
        }
        game.acceleratorBoostsUnlocked = []
    }
    document.getElementById("everything").hidden = false
    document.getElementById("timeTravelForcedScreen").hidden = true
    updateAccelerators()
    updateAcceleratorBoosts()
}

function calcTachyonGain() {
    if (game.speed.lt(LIGHT_SPEED)) {
        return 0;
    } else if (!game.timeTravel.breakTimeUnlocked) {
        return 1;
    } else {
        return new Decimal(2).pow(game.speed.div(LIGHT_SPEED).log(100)).floor()
    }
}

function updateTachyomUpgrades() {
    TACHYON_UPGRADES.forEach(e => {
        document.getElementById("tachyonUpgrade" + e).classList = game.timeTravel.tachyonUpgradesUnlocked.includes(e) ? ["tachyonUpgradeUnlocked"] : ["tachyonUpgradeLocked"]
    })
}

function onclickTachyonUpgrade(row, col) {
    if (game.timeTravel.tachyons.gte(TACHYON_UPGRADE_COSTS[row][col]) && !game.timeTravel.tachyonUpgradesUnlocked.includes("" + row + col)) {
        game.timeTravel.tachyons = game.timeTravel.tachyons.sub(TACHYON_UPGRADE_COSTS[row][col])
        game.timeTravel.tachyonUpgradesUnlocked.push("" + row + col)
        updateTachyomUpgrades()
    }
}