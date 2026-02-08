const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export class LeaderboardAPI {
  static async saveScore(name, score) {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, time: Date.now() })
    });
    if (!response.ok) throw new Error('Failed to save score');
    return response.json();
  }

  static async getScores() {
    const response = await fetch(`${API_BASE_URL}/leaderboard?limit=10`);
    if (!response.ok) throw new Error('Failed to load scores');
    return response.json();
  }
}
