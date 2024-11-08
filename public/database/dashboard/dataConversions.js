const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initialezeDatabase");
  db.run(`
    CREATE TABLE IF NOT EXISTS data_conversions (
      file_name VARCHAR(255) DEFAULT NULL,
      complete_time DATE NOT NULL,
      total_line_count INTEGER NOT NULL,
      updated_record INTEGER NOT NULL,
      imported_line_count INTEGER NOT NULL,
      new_record INTEGER NOT NULL
    )
  `);
}

module.exports = { initializeDatabase };