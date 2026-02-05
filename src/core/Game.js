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

    this.flappy = new FlappyGame(this);
    this.reflex = new ReflexGame(this);
    this.timer = new Timer(GAME_DURATION);

    this.loop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    );
  }

  start(now) {
    this.score = 0;
    this.state = STATES.PLAYING;
    this.timer.start(now);
    this.loop.start();
  }

  update(dt, now) {
    if (this.state !== STATES.PLAYING) return;

    this.timer.update(now);
    if (this.timer.isOver()) {
      this.state = STATES.GAME_OVER;
      return;
    }

    this.flappy.update(dt);
    this.reflex.update(dt);
  }

  render() {
    this.flappy.render();
    this.reflex.render();
  }

  addScore(value) {
    this.score = Math.max(0, this.score + value);
  }
}
