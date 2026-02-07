import { STATES } from "./State.js";
import { Timer } from "./Timer.js";
import { GameLoop } from "./GameLoop.js";
import { FlappyGame } from "../games/flappy/FlappyGame.js";
import { ReflexGame } from "../games/reflex/ReflexGame.js";
import { GAME_DURATION } from "../utils/Constants.js";

export class Game {
  constructor() {
    this.state = STATES.MENU;
    this.score = 0;
    this.countdown = 0;
    this.countdownStartTime = 0;


    this.flappy = new FlappyGame(this);
    this.reflex = new ReflexGame(this);
    this.timer = new Timer(GAME_DURATION);

    this.loop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    );
  }

  start(now) {
    this.loop.stop();
    this.score = 0;
    // Initialize countdown
    this.state = STATES.PAUSED; // freeze game logic
    this.countdown = 3;
    this.countdownStartTime = now;
    this.flappy.reset();
    this.reflex.reset();
    this.loop.start();
    this.updateHUD();
  }

  pause(now) {
    if (this.state === STATES.PLAYING) {
      this.state = STATES.PAUSED;
      this.timer.pause(now);
    }
  }

  resume(now) {
    if (this.state === STATES.PAUSED) {
      this.state = STATES.PLAYING;
      this.timer.resume(now);
    }
  }

  end() {
    this.state = STATES.GAME_OVER;
    this.loop.stop();
  }

  update(dt, now) {
    // Handle 3-2-1 countdown
    if (this.countdown > 0) {
      const elapsed = now - this.countdownStartTime;
      const remaining = 3 - Math.floor(elapsed / 1000);

      this.countdown = remaining;

      if (remaining <= 0) {
        this.countdown = 0;
        this.state = STATES.PLAYING;
        this.timer.start(now);
      }

      return; // block game updates during countdown
    }
    if (this.state !== STATES.PLAYING) return;

    this.timer.update(now);
    this.updateHUD();
    
    if (this.timer.isOver()) {
      this.end();
      return;
    }

    this.flappy.update(dt);
    this.reflex.update(dt);
  }

  render() {
    this.flappy.render();
    this.reflex.render();
    // Draw countdown overlay
    if (this.countdown > 0) {
      const canvases = [this.flappy.canvas, this.reflex.canvas];
      const contexts = [this.flappy.ctx, this.reflex.ctx];

      contexts.forEach((ctx, i) => {
        const canvas = canvases[i];

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 96px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.countdown, canvas.width / 2, canvas.height / 2);
        ctx.restore();
      });
    }
  }


  addScore(value) {
    this.score = Math.max(0, this.score + value);
    this.updateHUD();
  }

  updateHUD() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (scoreDisplay) {
      scoreDisplay.textContent = this.score;
    }
    
    if (timerDisplay) {
      timerDisplay.textContent = this.timer.getTimeString();
    }
  }
}