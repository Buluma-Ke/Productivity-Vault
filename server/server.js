const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const db = require("./database"); // database.js exports the SQLite connection

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// GET /state → loads all habits and tasks
app.get("/state", (req, res) => {
  const state = { habits: [], tasks: [] };

  db.all("SELECT * FROM habits", [], (err, habits) => {
    if (err) return res.status(500).json({ error: err.message });
    state.habits = habits;

    db.all("SELECT * FROM tasks", [], (err, tasks) => {
      if (err) return res.status(500).json({ error: err.message });
      state.tasks = tasks;

      res.json(state);
    });
  });
});

// POST /state → save all habits and tasks (replaces existing)
app.post("/state", (req, res) => {
  const { habits = [], tasks = [] } = req.body;

  db.serialize(() => {
    // Clear existing habits
    db.run("DELETE FROM habits");

    // Insert new habits
    const habitStmt = db.prepare("INSERT INTO habits (id, title) VALUES (?, ?)");
    habits.forEach(h => habitStmt.run([h.id, h.title]));
    habitStmt.finalize();

    // Clear existing tasks
    db.run("DELETE FROM tasks");

    // Insert new tasks
    const taskStmt = db.prepare(`
      INSERT INTO tasks (id, title, dueDate, completed, projectId)
      VALUES (?, ?, ?, ?, ?)
    `);
    tasks.forEach(t => taskStmt.run([t.id, t.title, t.dueDate, t.completed || 0, t.projectId || null]));
    taskStmt.finalize();

    res.json({ message: "State saved successfully" });
  });
});

// Existing task routes

// Create a new task
app.post("/tasks", (req, res) => {
  const { id, title, dueDate, projectId } = req.body;

  const sql = `
    INSERT INTO tasks (id, title, dueDate, projectId)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [id, title, dueDate, projectId || null], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to insert task");
    }

    res.status(201).json({ message: "Task created" });
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  const sql = `SELECT * FROM tasks`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch tasks");
    }

    res.json(rows);
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});