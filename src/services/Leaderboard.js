import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./Firebase.js";

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
  // Firebase replacements
  // -------------------------

  async saveScore(name, score) {
    if (name.length > 20) return;
    if (score < 0) return;

    await addDoc(collection(db, "leaderboard"), {
      name,
      score,
      time: Date.now()
    });
  }

  async load() {
    const listElement = document.getElementById("leaderboardList");
    listElement.innerHTML = '<p class="loading">Loading scores...</p>';

    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      listElement.innerHTML =
        '<p class="loading">No scores yet. Be the first!</p>';
      return;
    }

    listElement.innerHTML = snapshot.docs
      .map((doc, index) => {
        const data = doc.data();
        return `
          <div class="leaderboard-entry">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${this.escapeHtml(data.name)}</span>
            <span class="leaderboard-score">${data.score}</span>
          </div>
        `;
      })
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
