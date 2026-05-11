const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new sqlite3.Database(process.env.DATABASE_URL || './household.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create Household table
    db.run(`CREATE TABLE IF NOT EXISTS household (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      stability_score INTEGER,
      stability_label TEXT
    )`);

    // Create Members table
    db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      score INTEGER
    )`);

    // Create Logs tables
    db.run(`CREATE TABLE IF NOT EXISTS chore_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_name TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS expense_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_name TEXT,
      amount REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Data if empty
    db.get("SELECT COUNT(*) as count FROM household", (err, row) => {
      if (row.count === 0) {
        db.run("INSERT INTO household (name, stability_score, stability_label) VALUES ('The Maple Street House', 74, 'Moderate')");
        db.run("INSERT INTO members (name, score) VALUES ('Sara', 78), ('Jordan', 95), ('Alex', 42), ('Priya', 70)");
      }
    });
  });
}

// API Routes

// Get Household Data
app.get('/api/household', (req, res) => {
  const data = {};
  
  db.get("SELECT * FROM household LIMIT 1", (err, household) => {
    if (err) return res.status(500).json({ error: err.message });
    data.household = household;

    db.all("SELECT * FROM members", (err, members) => {
      if (err) return res.status(500).json({ error: err.message });
      data.members = members;

      // Mock calculation for demo purposes based on real logs could go here
      // For now, returning the seeded/stored scores
      res.json(data);
    });
  });
});

// Log a Chore
app.post('/api/logs/chore', (req, res) => {
  const { memberName } = req.body;
  if (!memberName) return res.status(400).json({ error: 'Member name required' });

  db.run("INSERT INTO chore_logs (member_name) VALUES (?)", [memberName], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Slightly increase member score for demo effect
    db.run("UPDATE members SET score = MIN(100, score + 2) WHERE name = ?", [memberName], (updateErr) => {
        res.json({ message: 'Chore logged successfully', id: this.lastID });
    });
  });
});

// Log an Expense
app.post('/api/logs/expense', (req, res) => {
  const { memberName, amount } = req.body;
  if (!memberName || !amount) return res.status(400).json({ error: 'Member name and amount required' });

  db.run("INSERT INTO expense_logs (member_name, amount) VALUES (?, ?)", [memberName, amount], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense logged successfully', id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
