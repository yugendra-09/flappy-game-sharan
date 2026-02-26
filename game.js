const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ✅ Responsive Canvas */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let playerImg = new Image();
playerImg.src = "assets/player.png";

let player = {
    x: 80,
    y: canvas.height * 0.45,
    width: 60,
    height: 60,
    velocity: 0,
   gravity: 0.28,   // slower falling
lift: -6         // softer jump (less height) 
};

let pipes = [];
let score = 0;
let gameRunning = false;

const music = document.getElementById("bgMusic");

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("scoreBox").style.display = "block";

    player.y = canvas.height * 0.45;
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
    let gap = canvas.height * 0.35;   // bigger gap // responsive gap
    let topHeight = Math.random() * (canvas.height * 0.5);

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
        pipe.x -= 1.4;   // slower movement

        if (!pipe.passed && pipe.x + pipe.width < player.x) {
            pipe.passed = true;
            score++;
            document.getElementById("score").innerText = score;
        }

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

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    pipes.forEach(pipe => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);

        ctx.drawImage(
            playerImg,
            pipe.x + 10,
            pipe.top / 2 - 30,
            60,
            60
        );

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
}, 2500);

function endGame() {
    gameRunning = false;
    music.pause();

    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";

    player.y = canvas.height / 2;
    player.velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById("score").innerText = score;

    gameRunning = true;
    music.currentTime = 0;
    music.play();

    gameLoop();
}