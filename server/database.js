const sqlite3 = require("sqlite3").verbose();

// This creates a file called vault.db (your database)
const db = new sqlite3.Database("./vault.db");

// This runs when the server starts
db.serialize(() => {
  console.log("Connected to SQLite database.");
//   db.run(`
//     DROP TABLE habits
//     `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      deadline TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      dueDate TEXT,
      completed INTEGER DEFAULT 0,
      projectId TEXT,
      completedAt TEXT,
      FOREIGN KEY(projectId) REFERENCES projects(id)
      
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      startDate TEXT NOT NULL,
      frequency TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
  );
  `)
});

module.exports = db;
