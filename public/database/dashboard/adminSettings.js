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
      access_level VARCHAR(255) DEFAULT NULL,
      password VARCHAR(255) DEFAULT NULL
    )
  `);
}

function loadAdminSettings(callback) {
  db.all('SELECT * FROM users', [], callback);
}

// function getAdminSettingById(id, callback) {
//   db.get('SELECT * FROM users WHERE id = ?', [id], callback);
// }


function getAdminSettingById(id, callback) {
  db.get('SELECT * FROM users WHERE id = ?', [id], callback);
}






function saveAdminSetting(adminSettingData, callback) {
  const { id, user_name, access_level, password } = adminSettingData;

  if (id) {
    db.run(
      `UPDATE users SET user_name = ?, access_level = ?, password = ? WHERE id = ?`,
      [user_name, access_level, password, id],
      callback
    );
  } else {
    db.run(
      `INSERT INTO users (user_name, access_level, password ) VALUES (?, ?, ?)`,
      [user_name, access_level, password],
      callback
    );
  }
}

module.exports = { 
  initializeDatabase,
  loadAdminSettings,
  getAdminSettingById,
  saveAdminSetting
 };