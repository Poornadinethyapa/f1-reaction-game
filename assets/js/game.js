// ========================
// DOM Elements
// ========================
const lightsContainer = document.getElementById('lightsContainer');
const clickArea = document.getElementById('clickArea');
const statusText = document.getElementById('statusText');
const resultMessage = document.getElementById('resultMessage');
const bestTimeEl = document.getElementById('bestTime');
const lastTimeEl = document.getElementById('lastTime');
const attemptsEl = document.getElementById('attempts');
const leaderboardList = document.getElementById('leaderboardList');
const clearBtn = document.getElementById('clearBtn');

// Modal elements
const howToPlayBtn = document.getElementById('howToPlayBtn');
const aboutBtn = document.getElementById('aboutBtn');
const howToPlayModal = document.getElementById('howToPlayModal');
const aboutModal = document.getElementById('aboutModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');
const closeAbout = document.getElementById('closeAbout');

// ========================
// Game State
// ========================
const lights = document.querySelectorAll('.light');
let state = 'idle'; // idle, running, ready
let startTime = 0;
let bestTime = null;
let attempts = 0;
let leaderboard = [];
let currentColumn = 0;

// ========================
// Initialization
// ========================
function init() {
    loadLeaderboard();
    displayLeaderboard();
    attachEventListeners();
}

// ========================
// Event Listeners
// ========================
function attachEventListeners() {
    clickArea.addEventListener('click', handleClick);
    clearBtn.addEventListener('click', handleClearLeaderboard);
    
    // Modal handlers
    howToPlayBtn.addEventListener('click', () => openModal(howToPlayModal));
    aboutBtn.addEventListener('click', () => openModal(aboutModal));
    closeHowToPlay.addEventListener('click', () => closeModal(howToPlayModal));
    closeAbout.addEventListener('click', () => closeModal(aboutModal));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === howToPlayModal) closeModal(howToPlayModal);
        if (e.target === aboutModal) closeModal(aboutModal);
    });
}

// ========================
// Modal Functions
// ========================
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// ========================
// Leaderboard Functions
// ========================
function loadLeaderboard() {
    leaderboard = [];
}

function updateLeaderboard(time) {
    leaderboard.push(time);
    leaderboard.sort((a, b) => a - b);
    leaderboard = leaderboard.slice(0, 10);
    displayLeaderboard();
}

function displayLeaderboard() {
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<li class="empty-leaderboard">No times recorded yet. Start racing!</li>';
        return;
    }

    leaderboardList.innerHTML = '';
    leaderboard.forEach((time, index) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        
        if (index === 0) li.classList.add('gold');
        else if (index === 1) li.classList.add('silver');
        else if (index === 2) li.classList.add('bronze');

        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        
        li.innerHTML = `
            <span class="rank">${medal} #${index + 1}</span>
            <span class="time">${time}ms</span>
        `;
        leaderboardList.appendChild(li);
    });
}

function handleClearLeaderboard() {
    if (confirm('Are you sure you want to clear the leaderboard?')) {
        leaderboard = [];
        displayLeaderboard();
    }
}

// ========================
// Game Controls
// ========================
function handleClick() {
    if (state === 'idle') {
        startGame();
    } else if (state === 'running') {
        jumpStart();
    } else if (state === 'ready') {
        recordTime();
    }
}

function resetLights() {
    lights.forEach(light => {
        light.classList.remove('on', 'green');
    });
}

async function startGame() {
    state = 'running';
    resetLights();
    clickArea.classList.add('disabled');
    clickArea.textContent = 'WAIT FOR LIGHTS...';
    statusText.textContent = '';
    resultMessage.textContent = '';
    currentColumn = 0;

    // Turn on lights column by column (like F1)
    for (let col = 0; col < 5; col++) {
        await sleep(600 + Math.random() * 200);
        if (state !== 'running') return;
        
        for (let row = 0; row < 3; row++) {
            lights[col * 3 + row].classList.add('on');
        }
        currentColumn++;
    }

    // Random delay before lights go out (1-3 seconds)
    const delay = Math.random() * 2000 + 1000;
    await sleep(delay);
    
    if (state !== 'running') return;

    // All lights go out!
    resetLights();
    state = 'ready';
    clickArea.classList.remove('disabled');
    clickArea.textContent = 'GO GO GO!';
    clickArea.style.background = 'rgba(0, 255, 0, 0.2)';
    startTime = Date.now();
}

function jumpStart() {
    state = 'idle';
    resetLights();
    clickArea.classList.remove('disabled');
    clickArea.textContent = 'JUMP START!';
    clickArea.style.background = 'rgba(255, 0, 0, 0.2)';
    statusText.textContent = '';
    resultMessage.textContent = '🚫 FALSE START! You clicked too early. Try again!';
    attempts++;
    attemptsEl.textContent = attempts;
    
    setTimeout(() => {
        clickArea.textContent = 'CLICK TO START';
        clickArea.style.background = 'rgba(255,255,255,0.05)';
    }, 2000);
}

function recordTime() {
    const reactionTime = Date.now() - startTime;
    state = 'idle';
    
    clickArea.classList.remove('disabled');
    clickArea.textContent = 'CLICK TO RACE AGAIN';
    clickArea.style.background = 'rgba(255,255,255,0.05)';
    
    lastTimeEl.textContent = reactionTime + 'ms';
    attempts++;
    attemptsEl.textContent = attempts;

    updateLeaderboard(reactionTime);

    if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        bestTimeEl.textContent = reactionTime + 'ms';
        resultMessage.textContent = `🏆 ${reactionTime}ms - NEW PERSONAL BEST!`;
        statusText.textContent = '🎉 INCREDIBLE!';
    } else {
        let rating = '';
        if (reactionTime < 150) rating = '🔥 SUPERHUMAN!';
        else if (reactionTime < 200) rating = '⚡ F1 DRIVER LEVEL!';
        else if (reactionTime < 250) rating = '🏎️ AMAZING REFLEXES!';
        else if (reactionTime < 300) rating = '👍 GREAT START!';
        else if (reactionTime < 400) rating = '😊 GOOD REACTION!';
        else rating = '🐌 KEEP PRACTICING!';
        
        statusText.textContent = rating;
        resultMessage.textContent = `Your time: ${reactionTime}ms`;
    }
}

// ========================
// Utility Functions
// ========================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================
// Start the game
// ========================
init();