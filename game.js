const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let playerImg = new Image();
playerImg.src = "assets/player.png";

let player = {
    x: 80,
    y: 250,
    width: 60,
    height: 60,
    velocity: 0,
    gravity: 0.35,   // slower fall
    lift: -8         // softer jump
};

let pipes = [];
let score = 0;
let gameRunning = false;

const music = document.getElementById("bgMusic");

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("scoreBox").style.display = "block";

    player.y = 250;
    player.velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById("score").innerText = score;

    gameRunning = true;
    music.currentTime = 0;
    music.play();

    gameLoop();
}

/* Controls */
document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && gameRunning) {
        player.velocity = player.lift;
    }
});

document.addEventListener("click", function () {
    if (gameRunning) {
        player.velocity = player.lift;
    }
});

document.addEventListener("touchstart", function () {
    if (gameRunning) {
        player.velocity = player.lift;
    }
});

function createPipe() {
    let gap = 180; // bigger gap = easier game
    let topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        width: 80,
        passed: false
    });
}

function update() {
    player.velocity += player.gravity;
    player.y += player.velocity;

    if (player.y < 0) {
        player.y = 0;
        player.velocity = 0;
    }

    if (player.y + player.height > canvas.height) {
        endGame();
    }

    pipes.forEach(pipe => {
        pipe.x -= 1.8; // slower pipe speed

        if (!pipe.passed && pipe.x + pipe.width < player.x) {
            pipe.passed = true;
            score++;
            document.getElementById("score").innerText = score;
        }

        // collision
        if (
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.top || player.y + player.height > pipe.bottom)
        ) {
            endGame();
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    pipes.forEach(pipe => {

        // Draw Yellow Walls
        ctx.fillStyle = "yellow";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);

        // Draw Photo inside top wall
        ctx.drawImage(
            playerImg,
            pipe.x + 10,
            pipe.top / 2 - 30,
            60,
            60
        );

        // Draw Photo inside bottom wall
        ctx.drawImage(
            playerImg,
            pipe.x + 10,
            pipe.bottom + (canvas.height - pipe.bottom) / 2 - 30,
            60,
            60
        );
    });
}

function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

setInterval(() => {
    if (gameRunning) createPipe();
}, 2500); // slower pipe creation

function endGame() {
    gameRunning = false;
    music.pause();

    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverScreen").style.display = "block";
}
function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";

    player.y = 250;
    player.velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById("score").innerText = score;

    gameRunning = true;
    music.currentTime = 0;
    music.play();

    gameLoop();
}