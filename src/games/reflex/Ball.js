import { REFLEX } from "../../utils/Constants.js";

export class Ball {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = 100;
    this.dx = REFLEX.BALL_SPEED;
    this.dy = REFLEX.BALL_SPEED;
  }

  update(paddle) {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > this.canvas.width) this.dx *= -1;
    if (this.y < 0) this.dy *= -1;

    if (this.y > this.canvas.height) {
      this.game.addScore(-100);
      this.reset();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, REFLEX.BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
