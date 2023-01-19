function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;


    if (obj instanceof Decimal) {
        return new Decimal(obj);
    }
    
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return mergeDeep(target, ...sources);
  }

const BASE_GAME = {
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
        breakTimeUnlocked: false
    }
}

function onclick_export() {
    prompt("Copy this (Crtl+C)", export_save())
}

function export_save() {
    return btoa(JSON.stringify(game))
}

function onclick_import() {
    import_save(prompt("Save Code"))
}


function import_save(obj) {
    try {
        
        let temp = clone(BASE_GAME)

        mergeDeep(temp, JSON.parse(atob(obj)))
        
        temp.speed = new Decimal(temp.speed)
        temp.acceleration = new Decimal(temp.acceleration)
        temp.accelerators.accel1.amount = new Decimal(temp.accelerators.accel1.amount)
        temp.accelerators.accel1.cost = new Decimal(temp.accelerators.accel1.cost)
        temp.accelerators.accel2.amount = new Decimal(temp.accelerators.accel2.amount)
        temp.accelerators.accel2.cost = new Decimal(temp.accelerators.accel2.cost)
        temp.accelerators.accel3.amount = new Decimal(temp.accelerators.accel3.amount)
        temp.accelerators.accel3.cost = new Decimal(temp.accelerators.accel3.cost)
        temp.accelerators.accel4.amount = new Decimal(temp.accelerators.accel4.amount)
        temp.accelerators.accel4.cost = new Decimal(temp.accelerators.accel4.cost)
        temp.accelerators.accel5.amount = new Decimal(temp.accelerators.accel5.amount)
        temp.accelerators.accel5.cost = new Decimal(temp.accelerators.accel5.cost)
        temp.accelerators.accel6.amount = new Decimal(temp.accelerators.accel6.amount)
        temp.accelerators.accel6.cost = new Decimal(temp.accelerators.accel6.cost)
        temp.accelerators.accel7.amount = new Decimal(temp.accelerators.accel7.amount)
        temp.accelerators.accel7.cost = new Decimal(temp.accelerators.accel7.cost)
        temp.accelerators.accel8.amount = new Decimal(temp.accelerators.accel8.amount)
        temp.accelerators.accel8.cost = new Decimal(temp.accelerators.accel8.cost)
        temp.accelerators.accel9.amount = new Decimal(temp.accelerators.accel9.amount)
        temp.accelerators.accel9.cost = new Decimal(temp.accelerators.accel9.cost)
        temp.accelerators.accel10.amount = new Decimal(temp.accelerators.accel10.amount)
        temp.accelerators.accel10.cost = new Decimal(temp.accelerators.accel10.cost)
        temp.timeTravel.tachyons = new Decimal(temp.timeTravel.tachyons)

        game = temp
    }
    catch (e) {
        console.log(e)
        alert("An error occurred.")
    }
    finally {
        updateAccelerators()
        updateAcceleratorBoosts()
        updateTachyonUpgrades()
        updateAutomationToggleLabels()
    }
}