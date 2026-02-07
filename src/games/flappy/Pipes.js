import { FLAPPY } from "../../utils/Constants.js";
import { FloatingText } from "../../utils/FloatingText.js";

export class Pipes {
  constructor(ctx, canvas, game) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.game = game;
    this.pipes = [];
    this.floatingTexts = [];
  }

  reset() {
    this.pipes = [];
    this.floatingTexts = [];
  }

  update(bird) {
    // Spawn new pipes
    if (
      this.pipes.length === 0 ||
      this.pipes[this.pipes.length - 1].x <
        this.canvas.width - FLAPPY.PIPE_SPACING
    ) {
      // Random pipe width
      const minWidth = 50;
      const maxWidth = 150;
      const width = Math.random() * (maxWidth - minWidth) + minWidth;

      // Random gap size (optional but feels more natural)
      const minGap = FLAPPY.PIPE_GAP * 0.8;
      const maxGap = FLAPPY.PIPE_GAP * 1.2;
      const gap = Math.random() * (maxGap - minGap) + minGap;

      // Random top pipe height
      const minTop = 40;
      const maxTop = this.canvas.height - gap - 40;
      const top = Math.random() * (maxTop - minTop) + minTop;

      this.pipes.push({
        x: this.canvas.width,
        width,              // 👈 random width
        top,
        bottom: top + gap,  // 👈 random gap position/size
        passed: false
      });
    }

    // Update pipes
    this.pipes.forEach(p => {
      p.x -= FLAPPY.PIPE_SPEED;

      // Check if bird passed the pipe
      if (!p.passed && p.x + FLAPPY.PIPE_WIDTH < bird.x) {
        p.passed = true;
        this.game.addScore(100);
        
        // Create floating text
        this.floatingTexts.push(
          new FloatingText(this.ctx, bird.x, bird.y, "+100", "#4CAF50")
        );
      }

      // Check collision
      if (!bird.isDead) {
        const birdBounds = bird.getBounds();
        
        // Check if bird is within pipe's x range
        if (
          birdBounds.x + birdBounds.width > p.x &&
          birdBounds.x < p.x + FLAPPY.PIPE_WIDTH
        ) {
          // Check if bird hit top or bottom pipe
          if (birdBounds.y < p.top || birdBounds.y + birdBounds.height > p.bottom) {
            bird.isDead = true;
            this.game.addScore(-50);
            this.floatingTexts.push(
              new FloatingText(this.ctx, bird.x, bird.y, "-50", "#F44336")
            );
          }
        }
      }
    });

    // Remove off-screen pipes
    this.pipes = this.pipes.filter(p => p.x > -FLAPPY.PIPE_WIDTH);

    // Update floating texts
    this.floatingTexts = this.floatingTexts.filter(ft => ft.update());
  }

  draw() {
    // Draw pipes
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = "#000";
    
    this.pipes.forEach(p => {
      // Top pipe
      this.ctx.fillStyle = "#4CAF50";
      this.ctx.fillRect(p.x, 0, FLAPPY.PIPE_WIDTH, p.top);
      
      // Pipe cap
      this.ctx.fillStyle = "#45a049";
      this.ctx.fillRect(p.x - 5, p.top - 20, FLAPPY.PIPE_WIDTH + 10, 20);
      
      // Bottom pipe
      this.ctx.fillStyle = "#4CAF50";
      this.ctx.fillRect(p.x, p.bottom, FLAPPY.PIPE_WIDTH, this.canvas.height);
      
      // Pipe cap
      this.ctx.fillStyle = "#45a049";
      this.ctx.fillRect(p.x - 5, p.bottom, FLAPPY.PIPE_WIDTH + 10, 20);
    });

    this.ctx.shadowBlur = 0;

    // Draw floating texts
    this.floatingTexts.forEach(ft => ft.draw());
  }
}