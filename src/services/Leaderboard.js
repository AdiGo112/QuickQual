import { LeaderboardAPI } from './LeaderboardAPI.js';

export class Leaderboard {
  constructor(game) {
    this.game = game;
    this.gameOverScreen = document.getElementById("gameOver");
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Submit score button
    document.getElementById("submitScoreBtn").addEventListener("click", async () => {
      const nameInput = document.getElementById("playerName");
      const name = nameInput.value.trim();

      if (!name) {
        alert("Please enter your name!");
        return;
      }

      await this.saveScore(name, this.game.score);
      nameInput.value = "";
      this.hide();
      this.showLeaderboard();
    });

    // Play again button
    document.getElementById("playAgainBtn").addEventListener("click", () => {
      this.hide();
      this.game.start(performance.now());
    });

    // Menu button
    document.getElementById("menuBtn").addEventListener("click", () => {
      this.hide();
      document.getElementById("game").classList.remove("active");
      document.getElementById("menu").classList.add("active");
    });
  }

  show() {
    document.getElementById("finalScore").textContent = this.game.score;
    this.gameOverScreen.classList.add("active");
  }

  hide() {
    this.gameOverScreen.classList.remove("active");
  }

  showLeaderboard() {
    document.getElementById("leaderboard").classList.add("active");
    this.load();
  }

  // -------------------------
  // API-based methods
  // -------------------------

  async saveScore(name, score) {
    if (name.length > 20) return;
    if (score < 0) return;

    try {
      await LeaderboardAPI.saveScore(name, score);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  async load() {
    const listElement = document.getElementById("leaderboardList");
    listElement.innerHTML = '<p class="loading">Loading scores...</p>';

    try {
      const rows = await LeaderboardAPI.getScores();

      if (!rows || rows.length === 0) {
        listElement.innerHTML =
          '<p class="loading">No scores yet. Be the first!</p>';
        return;
      }

      listElement.innerHTML = rows
        .map((row, index) => {
          return `
            <div class="leaderboard-entry">
              <span class="leaderboard-rank">#${index + 1}</span>
              <span class="leaderboard-name">${this.escapeHtml(row.name)}</span>
              <span class="leaderboard-score">${row.score}</span>
            </div>
          `;
        })
        .join("");
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      const msg = this.escapeHtml(error && (error.message || String(error)) || 'Unknown error');
      listElement.innerHTML = `<p class="loading">Error loading scores: ${msg}</p>`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
