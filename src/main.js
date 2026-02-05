import { Game } from "./core/Game.js";

const game = new Game();

document.getElementById("startBtn").onclick = e => {
  game.start(performance.now());
};
