const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake1 = [{x: 160, y: 160}];
let snake2 = [{x: 200, y: 160}];
let food = {x: 0, y: 0};
let direction1 = 'RIGHT';
let direction2 = 'LEFT';
let score1 = 0;
let score2 = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let gameInterval;
let isTwoPlayerMode = false;

document.getElementById("highScore").textContent = highScore;

// Elemente für die Steuerung
const startButton = document.getElementById("startButton");
const instructions = document.getElementById("instructions");
const modeSelection = document.getElementById("modeSelection");

// Steuerung durch Modus-Auswahl
const onePlayerButton = document.getElementById("onePlayerButton");
const twoPlayerButton = document.getElementById("twoPlayerButton");

onePlayerButton.addEventListener("click", () => {
  isTwoPlayerMode = false;
  startButton.disabled = false;
  modeSelection.style.display = 'none'; // Modus-Auswahl ausblenden
  instructions.style.display = 'none'; // Anleitung ausblenden
});

twoPlayerButton.addEventListener("click", () => {
  isTwoPlayerMode = true;
  startButton.disabled = false;
  modeSelection.style.display = 'none'; // Modus-Auswahl ausblenden
  instructions.style.display = 'none'; // Anleitung ausblenden
});

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (!gameInterval) return; // Nur steuern, wenn das Spiel läuft

  // Spieler 1 Steuerung (Pfeiltasten)
  if (e.key === 'ArrowUp' && direction1 !== 'DOWN') direction1 = 'UP';
  if (e.key === 'ArrowDown' && direction1 !== 'UP') direction1 = 'DOWN';
  if (e.key === 'ArrowLeft' && direction1 !== 'RIGHT') direction1 = 'LEFT';
  if (e.key === 'ArrowRight' && direction1 !== 'LEFT') direction1 = 'RIGHT';

  // Spieler 2 Steuerung (WASD) nur im 2-Spieler-Modus
  if (isTwoPlayerMode) {
    if (e.key === 'w' && direction2 !== 'DOWN') direction2 = 'UP';
    if (e.key === 's' && direction2 !== 'UP') direction2 = 'DOWN';
    if (e.key === 'a' && direction2 !== 'RIGHT') direction2 = 'LEFT';
    if (e.key === 'd' && direction2 !== 'LEFT') direction2 = 'RIGHT';
  }
});

function gameLoop() {
  moveSnake(snake1, direction1);
  if (isTwoPlayerMode) moveSnake(snake2, direction2); // Nur im 2-Spieler-Modus
  checkCollisions(snake1, 1);
  if (isTwoPlayerMode) checkCollisions(snake2, 2); // Nur im 2-Spieler-Modus
  drawGame();
}

function moveSnake(snake, direction) {
  const head = {...snake[0]};
  
  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'RIGHT') head.x += gridSize;

  snake.unshift(head); // Hinzufügen des neuen Kopfes
  if (head.x === food.x && head.y === food.y) {
    foodEaten(snake);
  } else {
    snake.pop(); // Entfernen des letzten Schwanzsegments
  }
}

function foodEaten(snake) {
  if (snake === snake1) {
    score1++;
  } else {
    score2++;
  }
  spawnFood(); // Neues Essen generieren
}

function checkCollisions(snake, player) {
  const head = snake[0];

  // Wandkollision
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    endGame(player);
  }

  // Selbstkollision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame(player);
    }
  }
}

function endGame(player) {
  if (player === 1) {
    if (score1 > highScore) {
      highScore = score1;
      localStorage.setItem('highScore', highScore);
    }
    alert(`Spieler 1 hat verloren! Höchststand: ${highScore}`);
  } else {
    if (score2 > highScore) {
      highScore = score2;
      localStorage.setItem('highScore', highScore);
    }
    alert(`Spieler 2 hat verloren! Höchststand: ${highScore}`);
  }

  // Spiel zurücksetzen
  snake1 = [{x: 160, y: 160}];
  snake2 = [{x: 200, y: 160}];
  score1 = 0;
  score2 = 0;
  direction1 = 'RIGHT';
  direction2 = 'LEFT';
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function spawnFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake zeichnen
  snake1.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'green' : 'darkgreen';
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  if (isTwoPlayerMode) {
    snake2.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'blue' : 'darkblue';
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
  }

  // Essen zeichnen
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // Punktestand aktualisieren
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
  document.getElementById("highScore").textContent = highScore;
}

// Spiel starten
function startGame() {
  // Spiel zurücksetzen
  spawnFood();
  gameInterval = setInterval(gameLoop, 100);  // Spiel-Loop alle 100ms
}