function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return 0;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

let score = parseInt(getCookie('score')) || 0;
let multiplier = parseInt(getCookie('multiplier')) || 1;
let upgradeCost = parseInt(getCookie('upgradeCost')) || 100;

let buildings = [
    {name: "Ferme", baseCost: 50, baseProd: 1, count: 0, cost: 50},
    {name: "Usine", baseCost: 500, baseProd: 10, count: 0, cost: 500}
];

let buildingUpgrades = [
    { level: 0, cost: 200, multiplier: 2 },
    { level: 0, cost: 2000, multiplier: 2 }
];

function loadBuildings() {
    buildings.forEach((b, i) => {
        b.count = parseInt(getCookie('building_' + i + '_count')) || 0;
        b.cost = parseInt(getCookie('building_' + i + '_cost')) || b.baseCost;
        b.baseProd = parseInt(getCookie('building_' + i + '_baseProd')) || b.baseProd; // <-- Ajouté
    });
    buildingUpgrades.forEach((upg, i) => {
        upg.level = parseInt(getCookie('upgrade_' + i + '_level')) || 0;
        upg.cost = parseInt(getCookie('upgrade_' + i + '_cost')) || (i === 0 ? 200 : 2000);
    });
}

function saveBuildings() {
    buildings.forEach((b, i) => {
        setCookie('building_' + i + '_count', b.count, 365);
        setCookie('building_' + i + '_cost', b.cost, 365);
        setCookie('building_' + i + '_baseProd', b.baseProd, 365); // <-- Ajouté
    });
}

function updateBuildingsDisplay() {
    let html = "";
    buildings.forEach((b, i) => {
        html += `<div>
            <b>${b.name}</b> (Possédé : <span id="building_${i}_count">${b.count}</span>)<br>
            Production : ${b.baseProd} / sec<br>
            <button onclick="buyBuilding(${i})">Acheter (Coût : <span id="building_${i}_cost">${b.cost}</span>)</button>
        </div><hr>`;
    });
    document.getElementById('buildings').innerHTML = html;
}

function buyBuilding(i) {
    let b = buildings[i];
    if (score >= b.cost) {
        score -= b.cost;
        b.count += 1;
        b.cost = Math.floor(b.baseCost * Math.pow(1.5, b.count));
        updateDisplay();
        updateBuildingsDisplay();
    } else {
        alert("Pas assez de points !");
    }
}

function upgrade() {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        multiplier *= 2;
        upgradeCost = Math.floor(upgradeCost * 2.5);
        updateDisplay();
        updateUpgradeDisplay();
    } else {
        alert("Pas assez de points !");
    }
}

function upgradeBuilding(i) {
    let upg = buildingUpgrades[i];
    if (score >= upg.cost) {
        score -= upg.cost;
        buildings[i].baseProd *= upg.multiplier;
        upg.level += 1;
        upg.cost = Math.floor(upg.cost * 2.5);
        updateDisplay();
        updateBuildingsDisplay();
        updateUpgradeDisplay();
    } else {
        alert("Pas assez de points !");
    }
}

function updateUpgradeDisplay() {
    let html = `<p>Améliore ton clic : x2 points par clic</p>
        <button onclick="upgrade()">Acheter (Coût : <span id="upgradeCost">${upgradeCost}</span>)</button>
        <hr>
        <h3>Améliorations de bâtiments</h3>`;
    buildings.forEach((b, i) => {
        html += `<div>
            <b>${b.name}</b> (Niveau : <span id="upgrade_${i}_level">${buildingUpgrades[i].level}</span>)<br>
            Production x${Math.pow(buildingUpgrades[i].multiplier, buildingUpgrades[i].level)}<br>
            <button onclick="upgradeBuilding(${i})">Améliorer (Coût : <span id="upgrade_${i}_cost">${buildingUpgrades[i].cost}</span>)</button>
        </div>`;
    });
    document.getElementById('upgrades').innerHTML = html;
}

function updateDisplay() {
    const scoreEl = document.getElementById('score');
    const multiplierEl = document.getElementById('multiplier');
    const upgradeCostEl = document.getElementById('upgradeCost');

    if (scoreEl) scoreEl.textContent = score;
    if (multiplierEl) multiplierEl.textContent = multiplier;
    if (upgradeCostEl) upgradeCostEl.textContent = upgradeCost;
}

function saveUpgrades() {
    buildingUpgrades.forEach((upg, i) => {
        setCookie('upgrade_' + i + '_level', upg.level, 365);
        setCookie('upgrade_' + i + '_cost', upg.cost, 365);
    });
}

function saveAll() {
    setCookie('score', score, 365);
    setCookie('multiplier', multiplier, 365);
    setCookie('upgradeCost', upgradeCost, 365);
    saveBuildings();
    saveUpgrades();
}

setInterval(function() {
    let prod = 0;
    buildings.forEach(b => {
        prod += b.count * b.baseProd;
    });
    score += prod;
    updateDisplay();
    saveAll();
}, 1000);

setInterval(function() {
    saveAll();
}, 5000);

window.onload = function() {
    loadBuildings();
    updateDisplay();
    updateBuildingsDisplay();
    updateUpgradeDisplay();
};

function increment() {
    score += multiplier;
    updateDisplay();
    saveAll();
}
function resetGame() {
    // Liste de tous les cookies à supprimer
    const cookies = [
        'score', 'multiplier', 'upgradeCost',
        'building_0_count', 'building_0_cost', 'building_0_baseProd',
        'building_1_count', 'building_1_cost', 'building_1_baseProd',
        'upgrade_0_level', 'upgrade_0_cost',
        'upgrade_1_level', 'upgrade_1_cost'
    ];
    cookies.forEach(name => setCookie(name, '', -1));
    location.reload();
}
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('darkmode');
    setCookie('darkmode', isDark ? '1' : '', 365);
}

window.onload = function() {
    loadBuildings();
    updateDisplay();
    updateBuildingsDisplay();
    updateUpgradeDisplay();
    // Active le mode sombre si le cookie est présent
    if (getCookie('darkmode') === '1') {
        document.body.classList.add('darkmode');
    }
};