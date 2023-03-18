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
        automation: {
            autoAccel: false,
            autoAccelBoost: false
        },
        breakTime: {
            antiHiggsBosons: new Decimal(0),
            ECUnlocked: false,
            ECBoughtUpgrades: []
        }
    },
    settings: {
        autoSave: true
    }
};

/**
 * *********
 * CONSTANTS
 * *********
 */

const LIGHT_SPEED = new Decimal("2.99792458e32");

const ACCELERATOR_BOOST_COSTS = [
    [new Decimal(1e1), new Decimal("1e27")]
];

const ACCELERATOR_BOOSTS = ["00", "01", "10", "11", "12", "13", "20", "21", "22", "23", "30", "31", "32", "33"];

const TACHYON_UPGRADE_COSTS = [
    [new Decimal(1), new Decimal(5), new Decimal(10), new Decimal(20)],
    [new Decimal(100)]
];

const TACHYON_UPGRADES = ["00", "01", "02", "03", "10"];

/**
 * ****************
 * GLOBAL VARIABLES
 * ****************
 */

let lastUpdate;
let tickInterval;

let autoAcceleratorInterval;
let autoAcceleratorBoostInterval;

/**
 * ****
 * TICK
 * ****
 */

function tick() {
    let now = Date.now();
    let dt = now - lastUpdate;
    dt /= 1000;
    lastUpdate = now;

    update(dt);
}

function update(dt) {
    let speed = formatSI(game.speed);
    document.getElementById("speedValue").innerText = speed.val;
    document.getElementById("speedUnit").innerText = speed.unit;
    let acceleration = formatSI(game.acceleration);
    document.getElementById("accelerationValue").innerText = acceleration.val;
    document.getElementById("accelerationUnit").innerText = acceleration.unit;

    document.getElementById("tachyonsValue").innerText = format(game.timeTravel.tachyons);
    
    game.speed = game.speed.add(game.acceleration.mul(dt));
    game.acceleration = calcAcceleration();

    let progress = game.speed.log(LIGHT_SPEED) * 100;
    if (progress < 0) {
        progress = 0;
    }
    document.getElementById("progressValue").style.width = progress + "%";
    document.getElementById("progressValue").innerText = progress.toString().substring(0, 4) + "% to Light Speed";

    updateUnlockedStuff();

    if (game.speed.gte(LIGHT_SPEED)) {
        game.timeTravel.unlocked = true;
        document.getElementById("everything").hidden = true;
        document.getElementById("timeTravelForcedScreen").hidden = false;
    }
}

function autoAcceleratorTick() {
    // credits: f_ypsilonnn
    if (game.timeTravel.tachyonUpgradesUnlocked.includes("03") && game.timeTravel.automation.autoAccel) {
        automateOneAccelerator(10);
        automateOneAccelerator(9);
        automateOneAccelerator(8);
        automateOneAccelerator(7);
        automateOneAccelerator(6);
        automateOneAccelerator(5);
        automateOneAccelerator(4);
        automateOneAccelerator(3);
        automateOneAccelerator(2);
        automateOneAccelerator(1);
    }
}

function autoAcceleratorBoostTick() {
    if (game.timeTravel.tachyonUpgradesUnlocked.includes("03") && game.timeTravel.automation.autoAccelBoost) {
        onclickAcceleratorBoosts(0, 0);
        onclickAcceleratorBoosts(0, 1);
    }
}

/**
 * ************************
 * DISPLAY UPDATE FUNCTIONS
 * ************************
 */

function updateUnlockedStuff() {
    document.getElementById("timeTravelTabButton").hidden = !game.timeTravel.unlocked;
    document.getElementById("automationTabButton").hidden = !game.timeTravel.tachyonUpgradesUnlocked.includes("03");
    document.getElementById("timeBreakTabButton").hidden = !game.timeTravel.tachyonUpgradesUnlocked.includes("10");
    document.getElementById("tachyons").hidden = !game.timeTravel.unlocked;
    document.getElementById("maxSpeed").hidden = !game.timeTravel.tachyonUpgradesUnlocked.includes("10");
    document.getElementById("acceleratorBoost00val").textContent = game.timeTravel.tachyonUpgradesUnlocked.includes("01") ? "2.1" : "2";
}

function updateAccelerators() {
    for (i=1; i<=10; i++) {
        let amount = format(game.accelerators["accel" + i].amount);
        let cost = formatSI(game.accelerators["accel" + i].cost);
        document.getElementById("acceleratorInfo" + i).innerText = "Amount: " + amount + (game.acceleratorBoostsUnlocked.includes("01") ? (" + " + format(game.accelerators["accel" + i].amount.mul(0.1).floor())) : "") + "\nSlowdown: " + cost.val + "\n" + cost.unit + "/s";
    }
}

function updateAcceleratorBoosts() {
    ACCELERATOR_BOOSTS.forEach(e => {
        document.getElementById("acceleratorBoost" + e).classList = game.acceleratorBoostsUnlocked.includes(e) ? ["acceleratorBoostUnlocked"] : ["acceleratorBoostLocked"];
    });
}

function updateTachyonUpgrades() {
    TACHYON_UPGRADES.forEach(e => {
        document.getElementById("tachyonUpgrade" + e).classList = game.timeTravel.tachyonUpgradesUnlocked.includes(e) ? ["tachyonUpgradeUnlocked"] : ["tachyonUpgradeLocked"];
    });
}

function updateAutomationToggleLabels() {
    document.getElementById("autoAcceleratorToogle").innerHTML = "Enabled: " + (game.timeTravel.automation.autoAccel ? "Yes" : "No");
    document.getElementById("autoAcceleratorBoostToogle").innerHTML = "Enabled: " + (game.timeTravel.automation.autoAccelBoost ? "Yes" : "No");
}

/**
 * ****************
 * FORMAT FUNCTIONS
 * ****************
 */

function format(value) {
    if (value.e >= 3) {
        return value.mantissa.toString().substring(0, 4) + "e" + value.e;
    } else if (value.e == 0) {
        return value.toNumber().toString().substring(0, 3);
    } else if (value.e == 1) {
        return value.toNumber().toString().substring(0, 2);
    } else if (value.e == 2) {
        return value.toNumber().toString().substring(0, 3);
    } else {
        return value.toNumber().toString().substring(0, 3);
    }
}

function formatSI(value) {
    if (value.e >= 48) {
        let tmpval = new Decimal(value).div(new Decimal(1e48));
        return {val: format(tmpval), unit: "yottameters"};
    } else {
        let units = ["yoctometers", "zeptometers", "attometers", "femtometers", "picometers", "nanometers", "micrometers", "millimeters", "meters", "kilometers", "megameters", "gigameters", "terameters", "petameters", "exameters", "zettameters", "yottameters"];
        let unit = (value.e-(value.e % 3))/3;
        let tmpval = new Decimal(value).div(new Decimal(10**(unit*3)));
        return {val: format(tmpval), unit: units[unit]};
    }
}

/**
 * *************
 * TAB SWITCHING
 * *************
 */

function onclickAccelerationTab() {
    document.getElementById("accelerationTab").hidden = false;
    document.getElementById("settingsTab").hidden = true;
    document.getElementById("statisticsTab").hidden = true;
    document.getElementById("timeTravelTab").hidden = true;
}

function onclickSettingsTab() {
    document.getElementById("accelerationTab").hidden = true;
    document.getElementById("settingsTab").hidden = false;
    document.getElementById("statisticsTab").hidden = true;
    document.getElementById("timeTravelTab").hidden = true;
}

function onclickStatisticsTab() {
    document.getElementById("accelerationTab").hidden = true;
    document.getElementById("settingsTab").hidden = true;
    document.getElementById("statisticsTab").hidden = false;
    document.getElementById("timeTravelTab").hidden = true;
}

function onclickTimeTravelTab() {
    document.getElementById("accelerationTab").hidden = true;
    document.getElementById("settingsTab").hidden = true;
    document.getElementById("statisticsTab").hidden = true;
    document.getElementById("timeTravelTab").hidden = false;
}

function onclickTachyonUpgradesSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = false;
    document.getElementById("automationSubTab").hidden = true;
    document.getElementById("breakTimeSubTab").hidden = true;
}

function onclickAutomationSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = true;
    document.getElementById("automationSubTab").hidden = false;
    document.getElementById("breakTimeSubTab").hidden = true;
}

function onclickBreakTimeSubTab() {
    document.getElementById("tachyonUpgradesSubTab").hidden = true;
    document.getElementById("automationSubTab").hidden = true;
    document.getElementById("breakTimeSubTab").hidden = false;
}

/**
 * ********************
 * CALCULATOR FUNCTIONS
 * ********************
 */

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
    .mul(Math.floor(game.accelerators.accel10.amount * (game.acceleratorBoostsUnlocked.includes("01") ? 1.1 : 1)));

    if (game.acceleratorBoostsUnlocked.includes("00")) {
        ret = ret.pow(game.timeTravel.tachyonUpgradesUnlocked.includes("01") ? 2.1 : 2);
    }

    if (game.timeTravel.tachyonUpgradesUnlocked.includes("02") && game.timeTravel.tachyons.gte(1)) {
        ret = ret.mul(new Decimal(game.timeTravel.tachyons.log(5)).add(1));
    }
    
    return ret;
}

function calcTachyonGain() {
    if (game.speed.lt(LIGHT_SPEED)) {
        return 0;
    } else {
        return new Decimal("10").pow(game.speed.log(LIGHT_SPEED).mul(new Decimal("0.2"))).floor();
    }
}

/**
 * ******
 * LAYERS
 * ******
 */

function timeTravel() {
    if (game.speed.gte(LIGHT_SPEED)) {
        game.timeTravel.tachyons = game.timeTravel.tachyons.add(calcTachyonGain());
        game.speed = new Decimal(0);
        game.acceleration = new Decimal(0);
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
        };
        game.acceleratorBoostsUnlocked = [];
    }
    document.getElementById("everything").hidden = false;
    document.getElementById("timeTravelForcedScreen").hidden = true;
    updateAccelerators();
    updateAcceleratorBoosts();
}

/**
 * **********
 * AUTOMATION
 * **********
 */

function automateOneAccelerator(accel) {
    const costFactor = new Decimal(game.timeTravel.tachyonUpgradesUnlocked.includes("00") ? 1.5 : 2);
    var count = new Decimal(1);
    var price = game.accelerators["accel" + accel].cost;
    if (price.gt(game.speed)) return;
    while (price.add(price.mul(costFactor)).lte(game.speed)) {
        count = count.add(1);
        price = price.add(price.mul(costFactor));
    }
    game.accelerators["accel" + accel].amount = game.accelerators["accel" + accel].amount.add(count);
    game.accelerators["accel" + accel].cost = game.accelerators["accel" + accel].cost.mul(costFactor.pow(count));
    game.speed = game.speed.sub(price);
    updateAccelerators();
}

/**
 * ****************
 * ONCLICK TRIGGERS
 * ****************
 */

function onclickBuyAccelerator(accel) {
    if (game.speed.gte(game.accelerators["accel" + accel].cost)) {
        game.speed = game.speed.sub(game.accelerators["accel" + accel].cost);
        game.accelerators["accel" + accel].amount = game.accelerators["accel" + accel].amount.add(new Decimal(1));
        game.accelerators["accel" + accel].cost = game.accelerators["accel" + accel].cost.mul(new Decimal(game.timeTravel.tachyonUpgradesUnlocked.includes("00") ? 1.5 : 2));
    }
    updateAccelerators();
}

function onclickAcceleratorBoosts(row, col) {
    if (game.speed.gte(ACCELERATOR_BOOST_COSTS[row][col]) && !game.acceleratorBoostsUnlocked.includes("" + row + col)) {
        game.speed = game.speed.sub(ACCELERATOR_BOOST_COSTS[row][col]);
        game.acceleratorBoostsUnlocked.push("" + row + col);
        updateAcceleratorBoosts();
        updateAccelerators();
    }
}

function onclickTachyonUpgrade(row, col) {
    if (game.timeTravel.tachyons.gte(TACHYON_UPGRADE_COSTS[row][col]) && !game.timeTravel.tachyonUpgradesUnlocked.includes("" + row + col)) {
        game.timeTravel.tachyons = game.timeTravel.tachyons.sub(TACHYON_UPGRADE_COSTS[row][col]);
        game.timeTravel.tachyonUpgradesUnlocked.push("" + row + col);
        updateTachyonUpgrades();
    }
}

function onclickAutomatorToggle(automator) {
    game.timeTravel.automation[automator] = !game.timeTravel.automation[automator];
    updateAutomationToggleLabels();
}

/**
 * ****
 * MAIN
 * ****
 */

(()=> {
    lastUpdate = Date.now();
    tickInterval = setInterval(tick, 0);
    
    autoAcceleratorInterval = setInterval(autoAcceleratorTick, 200);
    autoAcceleratorBoostInterval = window.setInterval(autoAcceleratorBoostTick, 200);

    updateAccelerators();
})();