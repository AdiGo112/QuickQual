import { REFLEX } from "../../utils/Constants.js";

export class Paddle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2;
  }

  update(mouseX) {
    this.x = Math.max(
      0,
      Math.min(
        this.canvas.width - REFLEX.PADDLE_WIDTH,
        mouseX - REFLEX.PADDLE_WIDTH / 2
      )
    );
  }

  draw(ctx) {
    ctx.fillRect(
      this.x,
      this.canvas.height - 30,
      REFLEX.PADDLE_WIDTH,
      REFLEX.PADDLE_HEIGHT
    );
  }
}
