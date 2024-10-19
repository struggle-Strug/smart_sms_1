const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log("initializeDatabase");
  db.run(`
      CREATE TABLE IF NOT EXISTS taxes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,  -- カラム1: 消費税コード（主キー・自動増分）
          tax_rate INTEGER NOT NULL,             -- カラム2: 消費税率（null不可）
          start_date DATE NOT NULL,              -- カラム3: 適用開始日（null不可）
          end_date DATE DEFAULT NULL,            -- カラム4: 適用終了日（null可）
          updated DATE DEFAULT (datetime('now')),-- カラム5: 更新日時（null可、デフォルトは現在の日時）
          created DATE DEFAULT (datetime('now')) -- カラム6: 作成日時（null可、デフォルトは現在の日時）
      );

  `);
}

function loadSalesTaxSettings(callback) {
  db.all('SELECT * FROM taxes', [], callback);
}

function getSalesTaxSettingById(id, callback) {
  db.get('SELECT * FROM taxes WHERE id = ?', [id], callback);
}

function saveSalesTaxSetting(salesTaxSettingData, callback) {
  const { id, tax_rate, start_date, end_date } = salesTaxSettingData;

  if (id) {
      db.run(
          `UPDATE taxes SET tax_rate = ?, start_date = ?, end_date = ?, updated = datetime('now') WHERE id = ?`,
          [tax_rate, start_date, end_date, id],
          callback
      );
  } else {
      db.run(
          `INSERT INTO taxes (tax_rate, start_date, end_date, created, updated) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
          [tax_rate, start_date, end_date],
          callback
      );
  }
}

function deleteSalesTaxSettingById(id, callback) {
  db.run('DELETE FROM taxes WHERE id = ?', [id], callback);
}



module.exports = {
  initializeDatabase,
  loadSalesTaxSettings,
  getSalesTaxSettingById,
  saveSalesTaxSetting,
  deleteSalesTaxSettingById
};