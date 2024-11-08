const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initialezeDatabase");
  db.run(`
    CREATE TABLE IF NOT EXISTS bank_apis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key VARCHAR(255) DEFAULT NULL
    )
  `);
}

function loadBnakApiSettings(callback) {
  db.all('SELECT * FROM bank_apis', [], callback);
}

function getBankApiSettingById(id, callback) {
  db.get('SELECT * FROM  bank_apis WHERE id = ?', [id], callback);
}

function saveBankApiSetting(bankApiSettingData, callback) {
  const { id, api_key } = bankApiSettingData;

  if (id) {
    db.run(
      `UPDATE bank_apis SET api_key = ? WHERE id = ?`,
      [api_key],
      callback
    );
  } else {
    db.run(
      `INSERT INTO bank_apis (api_key) VALUES (?)`,
      [api_key],
      callback
    );
  }
}

function deleteBankApiSettingById(id, callback) {
  db.run('DELETE FROM bank_api WHERE id = ?', [id], callback);
}

module.exports = { 
  initializeDatabase ,
  loadBnakApiSettings,
  getBankApiSettingById,
  saveBankApiSetting,
  deleteBankApiSettingById
};
