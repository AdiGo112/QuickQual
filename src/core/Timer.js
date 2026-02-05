export class Timer {
  constructor(duration) {
    this.duration = duration;
    this.startTime = 0;
    this.remaining = duration;
  }

  start(now) {
    this.startTime = now;
  }

  update(now) {
    this.remaining = Math.max(
      0,
      this.duration - (now - this.startTime)
    );
  }

  isOver() {
    return this.remaining <= 0;
  }
}
