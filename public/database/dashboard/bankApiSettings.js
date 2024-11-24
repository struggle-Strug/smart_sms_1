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
  const { api_key } = bankApiSettingData;

  // `bank_apis` テーブルにデータが存在するかを確認
  db.get(`SELECT id FROM bank_apis LIMIT 1`, [], (err, row) => {
    if (err) {
      console.error("Error checking existing data:", err);
      return callback(err);
    }

    if (row) {
      // データが存在する場合は更新
      const id = row.id; // 既存データのIDを取得
      db.run(
        `UPDATE bank_apis SET api_key = ? WHERE id = ?`,
        [api_key, id],
        (err) => {
          if (err) {
            console.error("Error updating data:", err);
            return callback(err);
          }
          console.log("Data updated successfully.");
          callback(null, "Data updated successfully.");
        }
      );
    } else {
      // データが存在しない場合は新規追加
      db.run(
        `INSERT INTO bank_apis (api_key) VALUES (?)`,
        [api_key],
        (err) => {
          if (err) {
            console.error("Error inserting data:", err);
            return callback(err);
          }
          console.log("Data inserted successfully.");
          callback(null, "Data inserted successfully.");
        }
      );
    }
  });
}


function deleteBankApiSettingById(id, callback) {
  db.run('DELETE FROM bank_api WHERE id = ?', [id], callback);
}

module.exports = { 
  initializeDatabase,
  loadBnakApiSettings,
  getBankApiSettingById,
  saveBankApiSetting,
  deleteBankApiSettingById
};
