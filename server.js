import express from 'express';
import cors from 'cors';
import { sql } from './src/config/postgresConfig.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    const result = await sql`SELECT 1`;
    console.log('✓ Database connected');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Initialize database table
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        score INTEGER NOT NULL,
        time BIGINT NOT NULL
      )
    `;
    console.log('✓ Database initialized');
  } catch (error) {
    console.error('✗ Database initialization error:', error.message);
  }
}

// Save score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, score, time } = req.body;

    if (!name || name.length > 20) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    if (score < 0) {
      return res.status(400).json({ error: 'Invalid score' });
    }

    await sql`
      INSERT INTO leaderboard (name, score, time)
      VALUES (${name}, ${score}, ${time})
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const rows = await sql`
      SELECT name, score FROM leaderboard
      ORDER BY score DESC
      LIMIT ${limit}
    `;

    res.json(rows);
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// Start server
async function start() {
  await testConnection();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
