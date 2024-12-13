// Setup canvas
const canvas = document.getElementById('flappy-game');
const ctx = canvas.getContext('2d');

// Adjust canvas size for responsive design
canvas.width = window.innerWidth < 320 ? 320 : window.innerWidth * 0.8;  // Set width dynamically (max 80% of screen width)
canvas.height = window.innerHeight < 480 ? 480 : window.innerHeight * 0.8;  // Set height dynamically (max 80% of screen height)

// Game variables
let birdX = 50;
let birdY = canvas.height / 2;
let birdWidth = 30;
let birdHeight = 30;
let birdSpeedY = 0;
let gravity = 0.6;
let lift = -8;  // Adjust jump height here, -8 to lower jump
let isGameOver = false;

// Pipes
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let pipeFrequency = 90;
let pipeCounter = 0;

// Score
let score = 0;

// Event listener for keydown (for desktop/laptop)
document.addEventListener('keydown', () => {
    if (isGameOver) {
        resetGame();
    } else {
        birdSpeedY = lift;  // Make bird flap
    }
});

// Event listener for touchstart (for mobile)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();  // Prevent default touch behavior (like scrolling)
    if (isGameOver) {
        resetGame();
    } else {
        birdSpeedY = lift;  // Make bird flap
    }
});

// Draw Bird
function drawBird() {
    birdSpeedY += gravity;
    birdY += birdSpeedY;

    // Check if the bird hits the ground (canvas bottom)
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight; // Set bird to ground level
        isGameOver = true;
    }

    ctx.fillStyle = '#FF0000'; // Red Bird
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Draw Pipes
function drawPipes() {
    if (pipeCounter % pipeFrequency === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            y: pipeHeight
        });
    }

    pipes.forEach((pipe, index) => {
        ctx.fillStyle = '#32CD32'; // Green pipes
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y); // Top pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap); // Bottom pipe

        // Move pipes
        pipe.x -= pipeSpeed;

        // Remove pipes that are out of the canvas
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }

        // Collision Detection
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth &&
            (birdY < pipe.y || birdY + birdHeight > pipe.y + pipeGap)) {
            isGameOver = true;
        }
    });
}

// Draw Score
function drawScore() {
    ctx.fillStyle = '#000000'; // Black text
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Reset the Game
function resetGame() {
    birdY = canvas.height / 2;
    birdSpeedY = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    pipeCounter = 0; // Reset the pipe counter
    gameLoop(); // Start the game loop again
}

// Main Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawBird();
    drawPipes();
    drawScore();

    if (!isGameOver) {
        pipeCounter++;
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = '#000000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Tap or press any key to Restart', 30, canvas.height / 2);
    }
}

// Start the game loop initially
gameLoop();
