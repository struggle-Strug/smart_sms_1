const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initializeDatabase");
  db.run(`
    CREATE TABLE IF NOT EXISTS pos_coordinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key VARCHAR(255) DEFAULT NULL,
      created DATE DEFAULT (datetime('now')),
      sync_interval VARCHAR(255) DEFAULT NULL
    )
  `);
}

function loadPosCoordinationSettings(callback) {
  db.all('SELECT * FROM pos_coordinations', [], callback);
}

function getPosCoordinationSettingById(id, callback) {
  db.get('SELECT * FROM pos_coordinations WHERE id = ?', [id], callback);
}

// 1. テーブルに `updated` カラムがない場合に追加
db.run(`ALTER TABLE pos_coordinations ADD COLUMN updated DATETIME`, [], (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error("Error adding column:", err.message);
  }
});

// 2. データの更新または挿入
function savePosCoodinationSetting(posCoordinationSettingData, callback) {
  const { api_key } = posCoordinationSettingData;

  db.get(`SELECT id FROM pos_coordinations LIMIT 1`, [], (err, row) => {
    if (err) {
      return callback(err);
    }

    if (row) {
      const id = row.id;
      db.run(
        `UPDATE pos_coordinations SET api_key = ?, updated = datetime('now') WHERE id = ?`,
        [api_key, id],
        callback
      );
    } else {
      db.run(
        `INSERT INTO pos_coordinations (api_key, created) VALUES (?, datetime('now'))`,
        [api_key],
        callback
      );
    }
  });
}


function deletePosCoodinationSettingById(id, callback) {
  db.run('DELETE FROM pos_coordinations WHERE id = ?', [id], callback);
}

module.exports = { 
  initializeDatabase,
  loadPosCoordinationSettings,
  getPosCoordinationSettingById,
  savePosCoodinationSetting,
  deletePosCoodinationSettingById
};