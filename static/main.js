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

// --- Sons ---
const clickSound = new Audio('static/click.mp3');
clickSound.preload = 'auto';
clickSound.volume = 0.2;
const buySound = new Audio('static/buy.mp3');
buySound.preload = 'auto';
buySound.volume = 0.2;
const successSound = new Audio('static/success.mp3');
successSound.preload = 'auto';
successSound.volume = 0.2;
let backgroundMusic = new Audio('static/background-day.mp3');
backgroundMusic.preload = 'auto';
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

// --- Contrôle musique de fond ---
let musicPlaying = true;
function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicPlaying = true;
        document.getElementById('music-btn').textContent = "⏸️";
    } else {
        backgroundMusic.pause();
        musicPlaying = false;
        document.getElementById('music-btn').textContent = "▶️";
    }
}
window.addEventListener('DOMContentLoaded', () => {
    // Ajoute le bouton musique
    let btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.className = 'darkmode-btn';
    btn.style.left = '30px'; // Met à gauche
    btn.style.position = 'absolute';
    btn.style.top = '20px';
    btn.title = "Musique de fond";
    btn.textContent = "▶️";
    btn.onclick = toggleMusic;
    document.body.appendChild(btn);
});

function setBackgroundMusicSource(isDark) {
    const src = isDark ? 'static/background-night.mp3' : 'static/background-day.mp3';
    const wasPlaying = !backgroundMusic.paused;
    backgroundMusic.pause();
    backgroundMusic.src = src;
    backgroundMusic.load();
    if (wasPlaying) {
        backgroundMusic.play().catch(() => {});
    }
}

// --- Variables principales ---
let score = parseFloat(getCookie('score')) || 0;
let totalScore = parseFloat(getCookie('totalScore')) || score;

let clickUpgradeLevel = parseInt(getCookie('clickUpgradeLevel')) || 0;
let multiplier = 1;

let achievements = achievementsList.map((a, i) => ({
    name: a.name,
    type: a.type,
    condition: a.condition,
    unlocked: getCookie('achievement_' + i) === '1'
}));

// --- Données des batiments et upgrades (injectées par Flask) ---
let buildings = items.map((item, i) => ({
    name: item.name,
    baseCost: item.baseCost,
    growthRate: item.growthRate,
    baseProd: item.baseProd,
    count: 0,
    upgrades: item.upgrade.map((upg, j) => ({
        level: upg.level,
        cost: upg.cost,
        multiplier: upg.multiplier,
        condition: upg.condition,
        unlocked: false
    }))
}));

// --- Chargement/Sauvegarde des upgrades de clic ---
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

// --- Chargement/Sauvegarde des bâtiments ---
function loadBuildings() {
    buildings.forEach((b, i) => {
        b.count = parseInt(getCookie('building_' + i + '_count')) || 0;
        b.baseProd = parseFloat(getCookie('building_' + i + '_baseProd')) || b.baseProd;
        b.upgrades.forEach((upg, j) => {
            upg.unlocked = getCookie('building_' + i + '_upgrade_' + j + '_unlocked') === '1';
        });
    });
}

function saveBuildings() {
    buildings.forEach((b, i) => {
        setCookie('building_' + i + '_count', b.count, 365);
        setCookie('building_' + i + '_baseProd', b.baseProd, 365);
        b.upgrades.forEach((upg, j) => {
            setCookie('building_' + i + '_upgrade_' + j + '_unlocked', upg.unlocked ? '1' : '', 365);
        });
    });
}

// --- Calcul du prix dynamique ---
function calculerPrix(Price, growthRate, ownedCount) {
    return Math.floor(Price * Math.pow(growthRate, ownedCount));
}

// --- Affichage des bâtiments ---
function updateBuildingsDisplay() {
    let html = "";
    buildings.forEach((b, i) => {
        let prix = calculerPrix(b.baseCost, b.growthRate, b.count);
        let prod = b.count * b.baseProd;
        html += `
        <div class="building-btn-wrapper" style="display:flex;align-items:center;gap:10px;">
            <button class="building-btn"
                onmouseover="showTooltip(event, '${b.name}<br>Production: ${formatNumber(b.baseProd)}/sec')"
                onmouseout="hideTooltip()"
                onclick="buyBuilding(${i})">
                ${b.name} <span class="building-count">${formatNumber(b.count)}</span>
                <br><span class="building-cost">${formatNumber(prix)}</span>
            </button>
            <span class="building-prod">+${formatNumber(prod)} /s</span>
        </div>`;
    });
    document.getElementById('buildings').innerHTML = html;
}

// --- Achat d'un bâtiment ---
function buyBuilding(i) {
    let b = buildings[i];
    let prix = calculerPrix(b.baseCost, b.growthRate, b.count);
    if (score >= prix) {
        score -= prix;
        b.count += 1;
        buySound.currentTime = 0;
        buySound.play();
        checkAchievements();
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
            buySound.currentTime = 0;
            buySound.play();
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
        buySound.currentTime = 0;
        buySound.play();
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
                onmouseover="showTooltip(event, 'Niveau ${upg.level}<br>x${upg.multiplier} par clic<br>Coût: ${formatNumber(upg.cost)}')"
                onmouseout="hideTooltip()"
                onclick="upgradeClick()">
                Clic <span class="upgrade-level">${clickUpgradeLevel + 1}</span>
                <br><span class="upgrade-cost">${formatNumber(upg.cost)}</span>
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
                onmouseover="showTooltip(event, '${b.name}<br>Niveau ${upg.level}<br>Production x${upg.multiplier}<br>Condition: ${formatNumber(upg.condition)} possédés<br>Coût: ${formatNumber(upg.cost)}')"
                onmouseout="hideTooltip()"
                onclick="upgradeBuilding(${i},${upgIndex})"
                ${b.count >= upg.condition ? '' : 'disabled'}>
                ${b.name} Upg <span class="upgrade-level">${upg.level}</span>
                <br><span class="upgrade-cost">${formatNumber(upg.cost)}</span>
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
    if (scoreEl) scoreEl.textContent = formatNumber(score);
    if (multiplierEl) multiplierEl.textContent = multiplier;
    if (totalScoreEl) totalScoreEl.textContent = formatNumber(totalScore);
    if (totalProdEl) totalProdEl.textContent = formatNumber(getTotalProd());
}

// --- Calcul de la prod totale ---
function getTotalProd() {
    let prod = 0;
    buildings.forEach(b => {
        prod += b.count * b.baseProd;
    });
    // Ajoute +1 par achievement débloqué
    prod += achievements.filter(a => a.unlocked).length;
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
    checkAchievements();
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
    checkAchievements();
    updateDisplay();
    updateBuildingsDisplay();
    updateUpgradeDisplay();
    updateAchievementsDisplay();
    const isDark = getCookie('darkmode') === '1';
    if (isDark) {
        document.body.classList.add('darkmode');
    }
    setBackgroundMusicSource(isDark);
    backgroundMusic.play().catch(() => {
        const startMusic = () => {
            backgroundMusic.play();
            document.removeEventListener('click', startMusic);
        };
        document.addEventListener('click', startMusic);
    });
    document.getElementById('music-btn').textContent = "⏸️";
    musicPlaying = true;
};

// --- Clic principal ---
function increment() {
    score += multiplier;
    totalScore += multiplier;
    clickSound.currentTime = 0;
    clickSound.play();
    updateDisplay();
    saveAll();
}

// --- Reset ---
function resetGame() {
    const cookies = [
        'score', 'totalScore', 'clickUpgradeLevel',
        'building_0_count', 'building_0_baseProd',
        'building_1_count', 'building_1_baseProd',
        'building_2_count', 'building_2_baseProd'
    ];
    buildings.forEach((b, i) => {
        b.upgrades.forEach((upg, j) => {
            cookies.push('building_' + i + '_upgrade_' + j + '_unlocked');
        });
    });
    cookies.forEach(name => setCookie(name, '', -1));
    achievements.forEach(a => a.unlocked = false);
    location.reload();
}

// --- Affichage des succès ---
function checkAchievements() {
    let changed = false;
    achievements.forEach((a, idx) => {
        if (!a.unlocked) {
            // Trouve le bon bâtiment
            let b = buildings.find(b => b.name === a.type);
            if (b && b.count >= a.condition) {
                a.unlocked = true;
                changed = true;
                successSound.currentTime = 0;
                successSound.play();
            }
        }
    });
    if (changed) updateAchievementsDisplay();
}

function updateAchievementsDisplay() {
    let html = `<h2>Succès</h2>
    <div style="display:flex;flex-direction:row;flex-wrap:nowrap;gap:10px;overflow-x:auto;overflow-y:hidden;width:100%;">`;
    achievements.forEach(a => {
        html += `<div class="achievement${a.unlocked ? ' unlocked' : ''}">
            ${a.name}<br>
            <span style="font-size:0.9em;">(${formatNumber(a.condition)} ${a.type})</span>
            <br>
            ${a.unlocked ? '<span style="color:#388e3c;">Débloqué</span>' : '<span style="color:#bdbdbd;">Non débloqué</span>'}
        </div>`;
    });
    html += `</div>`;
    document.getElementById('achievements').innerHTML = html;
}

// --- Dark mode ---
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('darkmode');
    setCookie('darkmode', isDark ? '1' : '', 365);
    setBackgroundMusicSource(isDark);
}

// --- Formatage des nombres ---
function formatNumber(n) {
    if (n >= 1e30) return Math.floor(n / 1e30) + "C" + (Math.floor((n % 1e30) / 1e27) || "");
    if (n >= 1e27) return Math.floor(n / 1e27) + "Qa" + (Math.floor((n % 1e27) / 1e24) || "");
    if (n >= 1e24) return Math.floor(n / 1e24) + "Q" + (Math.floor((n % 1e24) / 1e21) || "");
    if (n >= 1e21) return Math.floor(n / 1e21) + "Z" + (Math.floor((n % 1e21) / 1e18) || "");
    if (n >= 1e18) return Math.floor(n / 1e18) + "E" + (Math.floor((n % 1e18) / 1e15) || "");
    if (n >= 1e15) return Math.floor(n / 1e15) + "P" + (Math.floor((n % 1e15) / 1e12) || "");
    if (n >= 1e12) return Math.floor(n / 1e12) + "T" + (Math.floor((n % 1e12) / 1e9) || "");
    if (n >= 1e9)  return Math.floor(n / 1e9)  + "G" + (Math.floor((n % 1e9) / 1e6) || "");
    if (n >= 1e6)  return Math.floor(n / 1e6)  + "M" + (Math.floor((n % 1e6) / 1e3) || "");
    if (n >= 1e3)  return Math.floor(n / 1e3)  + "k" + (Math.floor(n % 1e3) || "");
    return Math.floor(n);
}