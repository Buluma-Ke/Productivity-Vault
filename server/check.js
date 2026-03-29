const db = require("./database");

db.all("PRAGMA table_info(projects)", (err, rows) => {
  console.log("Projects columns:", rows);
});