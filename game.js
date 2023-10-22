const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRAVITY = 0.4;
const FLAP_STRENGTH = 6;

const bird = {
    x: 100,
    y: canvas.height / 2,
    velocity: 0,
    radius: 20,
    image: new Image(),
};

bird.image.src = 'bird.png';

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let pipeSpeed = 2;
let pipeCounter = 0;
const pipeImage = new Image();
pipeImage.src = 'pipe.png';
let score = 0;
let bestScore = 0;
let isGameOver = false;
const restartButton = document.getElementById('restartButton');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function updateGameSpeed() {
    if (score >= 10) {
        pipeSpeed *= 1.2; 
    }
}
function gameLoop() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        restartButton.style.display = 'block';
        gameOverText.style.display = 'block';
        ctx.fillStyle = '#000';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        restartButton.addEventListener('click', restartGame);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    ctx.drawImage(bird.image, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
    if (pipeCounter === 200) {
        const pipeY = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, y: 0, height: pipeY, image: pipeImage });
        pipes.push({ x: canvas.width, y: pipeY + pipeGap, height: canvas.height - (pipeY + pipeGap), image: pipeImage });
        pipeCounter = 0;
        updateGameSpeed();
    }
    pipes.forEach((pipe) => {
        pipe.x -= pipeSpeed;
        ctx.drawImage(pipe.image, pipe.x, pipe.y, pipeWidth, pipe.height);
        if (
            bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth &&
            bird.y + bird.radius > pipe.y && bird.y - bird.radius < pipe.y + pipe.height
        ) {
            gameOver();
        }
        if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
            pipe.passed = true;
            score++;
            if (score > bestScore) {
                bestScore = score;
            }
        }
    });
    pipes.forEach((pipe, index) => {
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }
    });
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Best: ${bestScore}`, 10, 60);
    if (bird.y + bird.radius > canvas.height) {
        gameOver();
    }
    pipeCounter++;
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 32) {
        bird.velocity = -FLAP_STRENGTH;
    }
});
function gameOver() {
    isGameOver = true;
    restartButton.style.display = 'block';
    gameOverText.style.display = 'block';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    restartButton.addEventListener('click', restartGame);
    if (score > bestScore) {
        bestScore = score;
    }
}
function restartGame() {
    isGameOver = false;
    score = 0;
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipeSpeed = 2;
    pipeCounter = 0;
    restartButton.style.display = 'none';
    gameOverText.style.display = 'none';
    gameLoop();
}
let frames = 0;
gameLoop();
