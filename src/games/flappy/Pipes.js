import { FLAPPY } from "../../utils/Constants.js";

export class Pipes {
  constructor(ctx, canvas, game) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.game = game;
    this.pipes = [];
  }

  update(bird) {
    if (
      this.pipes.length === 0 ||
      this.pipes[this.pipes.length - 1].x < this.canvas.width - 400
    ) {
      const top = Math.random() * 200 + 50;
      this.pipes.push({
        x: this.canvas.width,
        top,
        bottom: top + FLAPPY.PIPE_GAP,
        passed: false
      });
    }

    this.pipes.forEach(p => {
      p.x -= FLAPPY.PIPE_SPEED;

      if (!p.passed && p.x + FLAPPY.PIPE_WIDTH < bird.x) {
        p.passed = true;
        this.game.addScore(100);
      }
    });

    this.pipes = this.pipes.filter(p => p.x > -FLAPPY.PIPE_WIDTH);
  }

  draw() {
    this.ctx.fillStyle = "green";
    this.pipes.forEach(p => {
      this.ctx.fillRect(p.x, 0, FLAPPY.PIPE_WIDTH, p.top);
      this.ctx.fillRect(
        p.x,
        p.bottom,
        FLAPPY.PIPE_WIDTH,
        this.canvas.height
      );
    });
  }
}
