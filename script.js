const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winModal = document.getElementById('win-modal');
const finalMovesEl = document.getElementById('final-moves');

// Pirate/One Piece themed FontAwesome icons
const icons = [
    'fa-skull-crossbones', // Jolly Roger
    'fa-anchor',           // Anchor
    'fa-gem',              // Treasure
    'fa-map',              // Treasure Map
    'fa-ship',             // Ship
    'fa-coins',            // Berries/Coins
    'fa-compass',          // Log Pose / Compass
    'fa-hat-cowboy'        // Straw hat (closest generic)
];

let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let isLocked = false;

function initGame() {
    // Reset state
    grid.innerHTML = '';
    cards = [...icons, ...icons]; // Duplicate for pairs
    cards.sort(() => Math.random() - 0.5); // Shuffle
    
    flippedCards = [];
    moves = 0;
    matches = 0;
    isLocked = false;
    
    updateStats();
    winModal.classList.remove('active');

    // Create cards
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-face card-back">
                <i class="fa-solid fa-skull"></i>
            </div>
            <div class="card-face card-front">
                <i class="fa-solid ${icon}"></i>
            </div>
        `;

        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            updateStats();
            flippedCards = [];
            isLocked = false;

            if (matches === icons.length) {
                setTimeout(showWinModal, 500);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

function updateStats() {
    movesEl.textContent = moves;
    matchesEl.textContent = `${matches} / ${icons.length}`;
}

function showWinModal() {
    finalMovesEl.textContent = moves;
    winModal.classList.add('active');
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game on load
initGame();
