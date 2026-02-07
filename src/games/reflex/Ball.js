import { REFLEX } from "../../utils/Constants.js";
import { FloatingText } from "../../utils/FloatingText.js";

export class Ball {
  constructor(ctx, canvas, game) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.game = game;
    this.floatingTexts = [];
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = 100;

    // Reset speed to base
    this.speed = REFLEX.BALL_SPEED;

    const angle = (Math.random() * 60 + 60) * (Math.PI / 180);
    const dir = Math.random() > 0.5 ? 1 : -1;

    this.dx = Math.cos(angle) * this.speed * dir;
    this.dy = Math.sin(angle) * this.speed;

    this.floatingTexts = [];
  }

  update(paddle) {
    this.x += this.dx;
    this.y += this.dy;

    // Side walls
    if (
      this.x - REFLEX.BALL_RADIUS < 0 ||
      this.x + REFLEX.BALL_RADIUS > this.canvas.width
    ) {
      this.dx *= -1;
      this.x = Math.max(
        REFLEX.BALL_RADIUS,
        Math.min(this.canvas.width - REFLEX.BALL_RADIUS, this.x)
      );
    }

    // Top wall
    if (this.y - REFLEX.BALL_RADIUS < 0) {
      this.dy *= -1;
      this.y = REFLEX.BALL_RADIUS;
    }

    // Paddle collision
    const paddleY = this.canvas.height - 30;

    if (
      this.y + REFLEX.BALL_RADIUS >= paddleY &&
      this.y - REFLEX.BALL_RADIUS <= paddleY + REFLEX.PADDLE_HEIGHT &&
      this.x >= paddle.x &&
      this.x <= paddle.x + REFLEX.PADDLE_WIDTH &&
      this.dy > 0
    ) {
      // 🔥 Multiplicative acceleration with cap
      this.speed = Math.min(
        this.speed * (1 + REFLEX.BALL_ACCELERATION),
        8
      );

      const paddleCenter = paddle.x + REFLEX.PADDLE_WIDTH / 2;
      const relative =
        (this.x - paddleCenter) / (REFLEX.PADDLE_WIDTH / 2);
      const clamped = Math.max(-1, Math.min(1, relative));

      const maxAngle = (60 * Math.PI) / 180;
      const angle = clamped * maxAngle;

      this.dx = Math.sin(angle) * this.speed;
      this.dy = -Math.cos(angle) * this.speed;

      this.y = paddleY - REFLEX.BALL_RADIUS;
    }

    // Miss
    if (this.y - REFLEX.BALL_RADIUS > this.canvas.height) {
      this.game.addScore(-100);
      this.floatingTexts.push(
        new FloatingText(
          this.ctx,
          this.canvas.width / 2,
          this.canvas.height / 2,
          "-100",
          "#F44336"
        )
      );
      this.reset(); // speed resets here
    }

    this.floatingTexts = this.floatingTexts.filter(ft => ft.update());
  }

  draw() {
    this.ctx.fillStyle = "#1f9dd7";
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = "#156887";

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, REFLEX.BALL_RADIUS, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
    this.floatingTexts.forEach(ft => ft.draw());
  }
}
