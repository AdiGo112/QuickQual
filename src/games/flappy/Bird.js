import { FLAPPY } from "../../utils/Constants.js";

export class Bird {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 4;
    this.y = this.canvas.height / 2;
    this.vy = 0;
  }

  flap() {
    this.vy = FLAPPY.JUMP;
  }

  update() {
    this.vy += FLAPPY.GRAVITY;
    this.y += this.vy;

    if (this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw() {
    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
  }
}
