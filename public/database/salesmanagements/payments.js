const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initialezeDatabase");
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deposit_date DATE DEFAULT (datetime('now')),
    claim_date DATE DEFAULT (datetime('now')),
    vender_name VARCHAR(255) DEFAULT NULL,
    claim_id INTEGER,
    commission_fee INTEGER,
    deposits INTEGER,
    status INTEGER
    )
    `);
}

module.exports = { 
  initializeDatabase,
 };