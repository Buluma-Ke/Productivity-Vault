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
  const state = { habits: [], tasks: [], projects: [] };

  db.all("SELECT * FROM habits", [], (err, habits) => {
    if (err) return res.status(500).json({ error: err.message });
    state.habits = habits;

    db.all("SELECT * FROM tasks", [], (err, tasks) => {
      if (err) return res.status(500).json({ error: err.message });
      state.tasks = tasks;

      db.all("SELECT * FROM projects", [], (err, projects) => {
        if (err) return res.status(500).json({ error: err.message });
        state.projects = projects;

        res.json(state); // ← send ONLY after everything is loaded
      });
    });
  });
});

// POST /state → save all habits and tasks (replaces existing)
app.post("/state", (req, res) => {
  const { habits = [], tasks = [], projects = [] } = req.body;

  db.serialize(() => {
    // Start a transaction
    db.run("BEGIN TRANSACTION");

    try {
      // --------------------------
      // 1️⃣ Projects
      // --------------------------
      db.run("DELETE FROM projects");
      const projectStmt = db.prepare("INSERT INTO projects (id, title) VALUES (?, ?)");
      projects.forEach(p => projectStmt.run([p.id, p.title]));
      projectStmt.finalize();

      // --------------------------
      // 2️⃣ Habits
      // --------------------------
      db.run("DELETE FROM habits");
      const habitStmt = db.prepare("INSERT INTO habits (id, title) VALUES (?, ?)");
      habits.forEach(h => habitStmt.run([h.id, h.title]));
      habitStmt.finalize();

      // --------------------------
      // 3️⃣ Tasks
      // --------------------------
      // Note: tasks reference projects, so must come AFTER projects
      db.run("DELETE FROM tasks");
      const taskStmt = db.prepare(`
        INSERT INTO tasks (id, title, dueDate, completed, projectId)
        VALUES (?, ?, ?, ?, ?)
      `);
      tasks.forEach(t =>
        taskStmt.run([t.id, t.title, t.dueDate, t.completed || 0, t.projectId || null])
      );
      taskStmt.finalize();

      // Commit everything
      db.run("COMMIT");

      res.json({ message: "State saved successfully" });
    } catch (err) {
      // Rollback on error
      db.run("ROLLBACK");
      res.status(500).json({ error: err.message });
    }
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


// projects

app.post("/projects", (req, res) => {
  const { id, title, deadline } = req.body;

  const sql = `
    INSERT INTO tasks (id, title, deadline)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [id, title, deadline], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to insert projects");
    }

    res.status(201).json({ message: "project created" });
  });
});


app.post("/habits", (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: "id and title are required" });
  }

  const sql = `INSERT INTO habits (id, title) VALUES (?, ?)`;

  db.run(sql, [id, title], function (err) {
    if (err) {
      console.error("Failed to insert habit:", err);
      return res.status(500).json({ error: "Failed to insert habit" });
    }

    // Success
    res.status(201).json({ message: "Habit created", habitId: id });
  });
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});