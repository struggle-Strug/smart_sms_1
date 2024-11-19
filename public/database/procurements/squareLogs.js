const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadSquareLogs(callback) {
  const sql = `SELECT * FROM square_logs`;
  db.all(sql, [], (err, rows) => {
      callback(err, rows);
  });
}

function saveSquareLog(logData, callback) {
  const {
      id,
      status,
      request_date_time,
      remarks,
  } = logData;

  if (id) {
      // IDが存在する場合は更新 (UPDATE)
      db.run(
          `UPDATE square_logs SET 
                  status = ?, 
                  request_date_time = ?, 
                  remarks = ?, 
                  updated = datetime('now') 
              WHERE id = ?`,
          [
              status,
              request_date_time,
              remarks,
              id
          ],
          function (err) {
              if (err) {
                  return callback(err);
              }
              callback(null, { lastID: id });
          }
      );
  } else {
      // IDが存在しない場合は新規追加 (INSERT)
      db.run(
          `INSERT INTO square_logs 
              (status, request_date_time, remarks, created, updated) 
              VALUES 
              (?, ?, ?, datetime('now'), datetime('now'))`,
          [
              status,
              request_date_time,
              remarks,
          ],
          function (err) {
              if (err) {
                  return callback(err);
              }
              callback(null, { lastID: this.lastID });
          }
      );
  }
}

function deleteSquareLogById(id, callback) {
  const sql = `DELETE FROM square_logs WHERE id = ?`;
  db.run(sql, [id], (err) => {
      callback(err);
  });
}

function editSquareLog(id, callback) {
  const sql = `SELECT * FROM square_logs WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
      callback(err, row);
  });
}

function initializeDatabase() {
  const sql = `
  CREATE TABLE IF NOT EXISTS square_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status STRING DEFAULT NULL,
      request_date_time TIMESTAMP DEFAULT NULL,
      remarks STRING DEFAULT NULL,
      updated DATE DEFAULT CURRENT_DATE,
      created DATE DEFAULT CURRENT_DATE
  )
  `;
  db.run(sql);
}

function searchSquareLogs(query, callback) {
  let sql;
  let params = [];

  // 検索クエリがある場合は各カラムをLIKEで検索
  if (query && query.trim() !== '') {
      sql = `
      SELECT * FROM square_logs 
      WHERE status LIKE ?
      OR remarks LIKE ? 
      `;
      params = Array(2).fill(`%${query}%`);
  } else {
      sql = `SELECT * FROM square_logs`;
  }

  db.all(sql, params, (err, rows) => {
      callback(err, rows);
  });
}

function getLatestLogByRequestDateTime(callback) {
    const sql = `
    SELECT * FROM square_logs
    ORDER BY request_date_time DESC
    LIMIT 1
    `;
    db.get(sql, [], (err, row) => {
        callback(err, row);
    });
  }

module.exports = {
  loadSquareLogs, 
  deleteSquareLogById, 
  saveSquareLog, 
  editSquareLog, 
  initializeDatabase,
  searchSquareLogs,
  getLatestLogByRequestDateTime
};
