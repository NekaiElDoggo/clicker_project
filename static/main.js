// --- Gestion des cookies ---
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

// --- Variables principales ---
let score = parseFloat(getCookie('score')) || 0;
let totalScore = parseFloat(getCookie('totalScore')) || score;

// Upgrades de clic
let clickUpgradeLevel = parseInt(getCookie('clickUpgradeLevel')) || 0;
let multiplier = 1;
function loadClickUpgrade() {
    clickUpgradeLevel = parseInt(getCookie('clickUpgradeLevel')) || 0;
    multiplier = 1;
    for (let i = 0; i < clickUpgradeLevel; i++) {
        multiplier *= clickUpgrades[i].multiplier;
    }
}
function saveClickUpgrade() {
    setCookie('clickUpgradeLevel', clickUpgradeLevel, 365);
}

// Batiments et upgrades
let buildings = items.map((item, i) => ({
    name: item.name,
    baseCost: item.baseCost,
    baseProd: item.baseProd,
    count: 0,
    cost: item.baseCost,
    upgrades: item.upgrade.map((upg, j) => ({
        level: upg.level,
        cost: upg.cost,
        multiplier: upg.multiplier,
        condition: upg.condition,
        unlocked: false
    }))
}));

function loadBuildings() {
    buildings.forEach((b, i) => {
        b.count = parseInt(getCookie('building_' + i + '_count')) || 0;
        b.cost = parseInt(getCookie('building_' + i + '_cost')) || b.baseCost;
        b.baseProd = parseFloat(getCookie('building_' + i + '_baseProd')) || b.baseProd;
        b.upgrades.forEach((upg, j) => {
            upg.unlocked = getCookie('building_' + i + '_upgrade_' + j + '_unlocked') === '1';
        });
    });
}

function saveBuildings() {
    buildings.forEach((b, i) => {
        setCookie('building_' + i + '_count', b.count, 365);
        setCookie('building_' + i + '_cost', b.cost, 365);
        setCookie('building_' + i + '_baseProd', b.baseProd, 365);
        b.upgrades.forEach((upg, j) => {
            setCookie('building_' + i + '_upgrade_' + j + '_unlocked', upg.unlocked ? '1' : '', 365);
        });
    });
}

// --- Affichage des bâtiments ---
function updateBuildingsDisplay() {
    let html = "";
    buildings.forEach((b, i) => {
        let prod = b.count * b.baseProd;
        html += `
        <div class="building-btn-wrapper" style="display:flex;align-items:center;gap:10px;">
            <button class="building-btn"
                onmouseover="showTooltip(event, '${b.name}<br>Production: ${b.baseProd}/sec')"
                onmouseout="hideTooltip()"
                onclick="buyBuilding(${i})">
                ${b.name} <span class="building-count">${b.count}</span>
                <br><span class="building-cost">${b.cost}</span>
            </button>
            <span class="building-prod">+${prod.toFixed(2)} /s</span>
        </div>`;
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
        updateUpgradeDisplay();
    } else {
        alert("Pas assez de points !");
    }
}

// --- Upgrades de clic ---
function upgradeClick() {
    if (clickUpgradeLevel < clickUpgrades.length) {
        let upg = clickUpgrades[clickUpgradeLevel];
        if (score >= upg.cost) {
            score -= upg.cost;
            clickUpgradeLevel += 1;
            multiplier *= upg.multiplier;
            updateDisplay();
            updateUpgradeDisplay();
            saveClickUpgrade();
        } else {
            alert("Pas assez de points !");
        }
    }
}

// --- Upgrades de bâtiments ---
function upgradeBuilding(i, j) {
    let b = buildings[i];
    let upg = b.upgrades[j];
    if (score >= upg.cost && b.count >= upg.condition && !upg.unlocked) {
        score -= upg.cost;
        b.baseProd *= upg.multiplier;
        upg.unlocked = true;
        updateDisplay();
        updateBuildingsDisplay();
        updateUpgradeDisplay();
    } else {
        alert("Condition non remplie ou pas assez de points !");
    }
}

// --- Affichage des upgrades ---
function updateUpgradeDisplay() {
    // Upgrades de clic
    let html = `<h3>Améliorations du clic</h3>`;
    if (clickUpgradeLevel < clickUpgrades.length) {
        let upg = clickUpgrades[clickUpgradeLevel];
        html += `
        <div class="upgrade-btn-wrapper">
            <button class="upgrade-btn"
                onmouseover="showTooltip(event, 'Niveau ${upg.level}<br>x${upg.multiplier} par clic<br>Coût: ${upg.cost}')"
                onmouseout="hideTooltip()"
                onclick="upgradeClick()">
                Clic <span class="upgrade-level">${clickUpgradeLevel + 1}</span>
                <br><span class="upgrade-cost">${upg.cost}</span>
            </button>
        </div>`;
    } else {
        html += `<i>Toutes les améliorations de clic achetées</i>`;
    }
    html += `<hr><h3>Améliorations de bâtiments</h3>`;
    buildings.forEach((b, i) => {
        const upgIndex = b.upgrades.findIndex(upg => !upg.unlocked);
        html += `<div class="upgrade-btn-wrapper">`;
        if (upgIndex !== -1) {
            const upg = b.upgrades[upgIndex];
            html += `
            <button class="upgrade-btn"
                onmouseover="showTooltip(event, '${b.name}<br>Niveau ${upg.level}<br>Production x${upg.multiplier}<br>Condition: ${upg.condition} possédés<br>Coût: ${upg.cost}')"
                onmouseout="hideTooltip()"
                onclick="upgradeBuilding(${i},${upgIndex})"
                ${b.count >= upg.condition ? '' : 'disabled'}>
                ${b.name} Upg <span class="upgrade-level">${upg.level}</span>
                <br><span class="upgrade-cost">${upg.cost}</span>
            </button>`;
        } else {
            html += `<i>Toutes les améliorations achetées</i>`;
        }
        html += `</div>`;
    });
    document.getElementById('upgrades').innerHTML = html;
}

// --- Tooltip ---
function showTooltip(e, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.background = '#222';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '6px 10px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = 1000;
        document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 10) + 'px';
}
function hideTooltip() {
    let tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

// --- Affichage général ---
function updateDisplay() {
    const scoreEl = document.getElementById('score');
    const multiplierEl = document.getElementById('multiplier');
    const totalScoreEl = document.getElementById('totalScore');
    const totalProdEl = document.getElementById('totalProd');
    if (scoreEl) scoreEl.textContent = Math.floor(score);
    if (multiplierEl) multiplierEl.textContent = multiplier;
    if (totalScoreEl) totalScoreEl.textContent = Math.floor(totalScore);
    if (totalProdEl) totalProdEl.textContent = getTotalProd().toFixed(2);
}

// --- Calcul de la prod totale ---
function getTotalProd() {
    let prod = 0;
    buildings.forEach(b => {
        prod += b.count * b.baseProd;
    });
    return prod;
}

// --- Sauvegarde globale ---
function saveAll() {
    setCookie('score', score, 365);
    setCookie('totalScore', totalScore, 365);
    saveClickUpgrade();
    saveBuildings();
}

// --- Production automatique ---
setInterval(function() {
    let prod = getTotalProd();
    score += prod;
    totalScore += prod;
    updateDisplay();
    saveAll();
}, 1000);

setInterval(function() {
    saveAll();
}, 5000);

// --- Initialisation ---
window.onload = function() {
    loadBuildings();
    loadClickUpgrade();
    updateDisplay();
    updateBuildingsDisplay();
    updateUpgradeDisplay();
    if (getCookie('darkmode') === '1') {
        document.body.classList.add('darkmode');
    }
};

// --- Clic principal ---
function increment() {
    score += multiplier;
    totalScore += multiplier;
    updateDisplay();
    saveAll();
}

// --- Reset ---
function resetGame() {
    const cookies = [
        'score', 'totalScore', 'clickUpgradeLevel',
        'building_0_count', 'building_0_cost', 'building_0_baseProd',
        'building_1_count', 'building_1_cost', 'building_1_baseProd',
        'building_2_count', 'building_2_cost', 'building_2_baseProd'
    ];
    buildings.forEach((b, i) => {
        b.upgrades.forEach((upg, j) => {
            cookies.push('building_' + i + '_upgrade_' + j + '_unlocked');
        });
    });
    cookies.forEach(name => setCookie(name, '', -1));
    location.reload();
}

// --- Dark mode ---
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('darkmode');
    setCookie('darkmode', isDark ? '1' : '', 365);
}