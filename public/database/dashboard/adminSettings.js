const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initialezeDatabase");
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name VARCHAR(255) DEFAULT NULL,
      access_level VARCHAR(255) DEFAULT NULL
    )
  `);
}

module.exports = { initializeDatabase };