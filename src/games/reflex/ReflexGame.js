import { Ball } from "./Ball.js";
import { Paddle } from "./Paddle.js";

export class ReflexGame {
  constructor(game) {
    const canvas = document.getElementById("reflexCanvas");
    this.ctx = canvas.getContext("2d");

    this.paddle = new Paddle(canvas);
    this.ball = new Ball(game, canvas);

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
    });
  }

  update() {
    this.paddle.update(this.mouseX);
    this.ball.update(this.paddle);
  }

  render() {
    this.ctx.clearRect(0, 0, 800, 600);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
  }
}
