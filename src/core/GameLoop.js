export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.last = 0;
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(ts) {
    const dt = ts - this.last;
    this.last = ts;

    this.update(dt, ts);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
