const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ================= GAME STATE ================= */
let running = false;
let paused = false;
let difficulty = "easy";

/* ================= BALL ================= */
let ballSpeed = 3;
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  r: 7,
  dx: ballSpeed,
  dy: -ballSpeed
};

/* ================= PADDLE ================= */
const paddle = {
  w: 120,
  h: 12,
  x: canvas.width / 2 - 60,
  y: canvas.height - 30,
  speed: 8
};

/* ================= BRICKS ================= */
const rows = 6;
const cols = 12;
const bricks = [];
const colors = ["#ff6b6b", "#ffa502", "#ffd32a", "#2ed573", "#1e90ff", "#c56cf0"];

function createBricks() {
  bricks.length = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({
        x: c * 70 + 30,
        y: r * 22 + 40,
        w: 65,
        h: 16,
        alive: true,
        color: colors[r]
      });
    }
  }
}
createBricks();

/* ================= INPUT ================= */
document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

document.addEventListener("keydown", e => {
  if (e.key === " ") paused = !paused;
  if (e.key === "ArrowLeft") paddle.x -= paddle.speed;
  if (e.key === "ArrowRight") paddle.x += paddle.speed;
});

canvas.addEventListener("click", () => {
  if (!running) running = true;
});

/* ================= DIFFICULTY ================= */
function setDifficulty(level) {
  difficulty = level;
  if (level === "easy") ballSpeed = 3;
  if (level === "normal") ballSpeed = 4;
  if (level === "hard") ballSpeed = 5;
  resetBall();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = ballSpeed;
  ball.dy = -ballSpeed;
}

/* ================= COLLISION ================= */
function hitRect(b) {
  return (
    ball.x > b.x &&
    ball.x < b.x + b.w &&
    ball.y > b.y &&
    ball.y < b.y + b.h
  );
}

/* ================= DRAW ================= */
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
}

function drawPaddle() {
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

function drawBricks() {
  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  });
}

/* ================= UPDATE ================= */
function update() {
  if (!running || paused) return;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.dx *= -1;
  if (ball.y < ball.r) ball.dy *= -1;

  // Paddle
  if (
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    ball.dy *= -1;
    ballSpeed += 0.05; // gradual speed increase
    ball.dx = Math.sign(ball.dx) * ballSpeed;
    ball.dy = -ballSpeed;
  }

  // Bricks
  bricks.forEach(b => {
    if (b.alive && hitRect(b)) {
      b.alive = false;
      ball.dy *= -1;
      ballSpeed += 0.03;
    }
  });

  // Fall
  if (ball.y > canvas.height) {
    running = false;
    paused = false;
    resetBall();
    createBricks();
  }
}

/* ================= LOOP ================= */
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  update();
  requestAnimationFrame(loop);
}

loop();
