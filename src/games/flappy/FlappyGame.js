import { Bird } from "./Bird.js";
import { Pipes } from "./Pipes.js";

export class FlappyGame {
  constructor(game) {
    const canvas = document.getElementById("flappyCanvas");
    this.ctx = canvas.getContext("2d");

    this.bird = new Bird(this.ctx, canvas);
    this.pipes = new Pipes(this.ctx, canvas, game);

    document.addEventListener("keydown", e => {
      if (e.code === "Space") this.bird.flap();
    });
  }

  update() {
    this.bird.update();
    this.pipes.update(this.bird);
  }

  render() {
    this.ctx.clearRect(0, 0, 800, 600);
    this.bird.draw();
    this.pipes.draw();
  }
}
