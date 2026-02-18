const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

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

