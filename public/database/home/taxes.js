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





module.exports = {
  initializeDatabase,
};