const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const menu = document.getElementById("menu");
const scoreDisplay = document.getElementById("score");
const playButton = document.getElementById("play-button");
const soundToggle = document.getElementById("sound-toggle");

let birdY = 250;
let gravity = 0.5;
let jump = -20;
let vx = 5;
let score = 0;
let gameOver = false;
let isSoundOn = true;
let gameInterval;
let obstacleInterval;

let jumpSound = new Audio('jump-sound.mp3');
let backgroundSound = new Audio('background-music.mp3');

// Mengatur suara
function toggleSound() {
    if (soundToggle.checked) {
        isSoundOn = true;
        backgroundSound.loop = true;
        backgroundSound.play();
    } else {
        isSoundOn = false;
        backgroundSound.pause();
        backgroundSound.currentTime = 0;
    }
}

// Memulai game
function startGame() {
    menu.style.display = "none";
    gameContainer.style.display = "block";
    birdY = 250;
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
    gameOver = false;
    bird.style.top = birdY + "px";
    
    // Mulai game loop dan obstacle
    gameLoop();  
    obstacleInterval = setInterval(createObstacle, 2000);  // Mulai rintangan setiap 2 detik
}

// Event listener untuk tombol Play
playButton.addEventListener("click", startGame);
soundToggle.addEventListener("change", toggleSound);

// Burung melompat
function flap() {
    if (!gameOver) {
        birdY += jump;
        if (isSoundOn) jumpSound.play(); // Mainkan suara loncat jika sound aktif
    }
}

// Membuat rintangan
function createObstacle() {
    const obstacle = document.createElement("div");
    const obstacleTop = document.createElement("div");

    obstacle.classList.add("obstacle");
    obstacleTop.classList.add("obstacle-top");

    // Tentukan tinggi rintangan secara acak
    const randomHeight = Math.floor(Math.random() * 200) + 100;
    obstacle.style.height = randomHeight + "px";
    obstacleTop.style.height = 600 - randomHeight - 150 + "px";  // Tinggi rintangan atas

    // Menambahkan rintangan ke dalam game
    gameContainer.appendChild(obstacle);
    gameContainer.appendChild(obstacleTop);

    // Tentukan posisi awal dari rintangan
    obstacle.style.left = "400px";  // Posisi awal rintangan di sisi kanan
    obstacleTop.style.left = "400px";  // Posisi rintangan atas di sisi kanan

    // Gerakkan rintangan
    const moveInterval = setInterval(() => {
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
        const birdRect = bird.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        const obstacleTopRect = obstacleTop.getBoundingClientRect();

        // Cek tabrakan antara burung dan rintangan
        if (
            (birdRect.left < obstacleRect.right && birdRect.right > obstacleRect.left &&
                birdRect.bottom > obstacleRect.top) ||
            (birdRect.left < obstacleTopRect.right && birdRect.right > obstacleTopRect.left &&
                birdRect.top < obstacleTopRect.bottom)
        ) {
            clearInterval(moveInterval);
            clearInterval(obstacleInterval);
            gameOver = true;
            alert("Game Over! Final Score: " + score);
            window.location.reload();
        }

        // Menghapus rintangan setelah lewat dari layar
        if (obstacleLeft < -50) {
            clearInterval(moveInterval);
            gameContainer.removeChild(obstacle);
            gameContainer.removeChild(obstacleTop);
        } else {
            obstacle.style.left = obstacleLeft - 5 + "px";  // Rintangan bergerak ke kiri
            obstacleTop.style.left = obstacleLeft - 5 + "px";  // Rintangan atas bergerak ke kiri

            if (obstacleLeft === 50) {
                score++;
                scoreDisplay.textContent = "Score: " + score;
            }
        }
    }, 20);
}

// Game loop untuk menggerakkan burung
function gameLoop() {
    if (!gameOver) {
        birdY += gravity;
        bird.style.top = birdY + "px";

        if (birdY > 570 || birdY < 0) {
            gameOver = true;
            alert("Game Over! Final Score: " + score);
            window.location.reload();
        }

        gameInterval = requestAnimationFrame(gameLoop);
    }
}

// Event listener untuk tap atau klik
gameContainer.addEventListener("mousedown", flap);
gameContainer.addEventListener("touchstart", flap);