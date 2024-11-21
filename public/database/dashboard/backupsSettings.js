const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const { ipcMain } = require('electron');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const { createObjectCsvWriter: createCsvWriter } = require('csv-writer');
const fs = require('fs');
const csv = require('csv-parser'); // CSVファイル読み込みに使用
const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadAllTablesData(db, callback) {
  // 全テーブル名を取得
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      callback(err);
      return;
    }
    console.log(tables);

    const allData = {};
    let remaining = tables.length;

    if (remaining === 0) {
      // テーブルがない場合は空のオブジェクトを返す
      callback(null, allData);
      return;
    }

    // 各テーブルのデータを取得
    tables.forEach((table) => {
      const tableName = table.name;
      db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
          callback(err);
          return;
        }

        allData[tableName] = rows;
        remaining--;

        // すべてのテーブルのデータが取得できたらコールバックを実行
        if (remaining === 0) {
          callback(null, allData);
        }
      });
    });
  });
}




// DBインスタンスの作成

// 全テーブルのデータを取得してCSVファイルに出力する関数
// SQLiteから全テーブル名を取得する関数
function getTablesFromDB(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.name));
    });
  });
}

// SQLiteから指定テーブルのデータを取得する関数
function getTableData(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// データをCSV形式に変換する関数
function convertToCSV(rows) {
  const headers = Object.keys(rows[0]);
  const csvRows = rows.map(row => headers.map(header => `"${row[header] || ''}"`).join(','));
  return [headers.join(','), ...csvRows].join('\n');
}
// /**
//  * CSVファイルを読み込んで指定テーブルにデータを上書きする
//  * @param {string} tableName - テーブル名
//  * @param {string} csvFilePath - CSVファイルのパス
//  * @param {function} callback - 終了時に呼び出すコールバック関数
//  */
// function importCSVToTable(tableName, csvFilePath, callback) {
//   const rows = [];

//   // CSVファイルを読み込み
//   fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('data', (data) => rows.push(data)) // 行ごとにデータを格納
//     .on('end', () => {
//       // データベーストランザクションの開始
//       db.serialize(() => {
//         // テーブルのデータを全削除
//         db.run(`DELETE FROM ${tableName}`, (err) => {
//           if (err) return callback(err);

//           // CSVデータを挿入
//           const columns = Object.keys(rows[0]);
//           const placeholders = columns.map(() => '?').join(',');
//           const insertStmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`);

//           db.run('BEGIN TRANSACTION');
//           rows.forEach((row) => {
//             insertStmt.run(Object.values(row));
//           });
//           db.run('COMMIT', (commitErr) => {
//             insertStmt.finalize();
//             callback(commitErr);
//           });
//         });
//       });
//     })
//     .on('error', (err) => {
//       callback(err);
//     });
// }

function importAllCsvToDatabase(db, csvDirPath, callback) {
  fs.readdir(csvDirPath, (err, files) => {
      if (err) return callback(err);

      const csvFiles = files.filter(file => file.endsWith('.csv'));
      let remaining = csvFiles.length;

      if (remaining === 0) return callback(null, "No CSV files to import.");

      csvFiles.forEach((file) => {
          const tableName = path.basename(file, '.csv'); // ファイル名からテーブル名を取得
          const filePath = path.join(csvDirPath, file);

          importCsvToTable(db, tableName, filePath, (err) => {
              if (err) return callback(err);

              remaining -= 1;
              if (remaining === 0) {
                  callback(null, "復元に成功しました。");
              }
          });
      });
  });
}

// 単一CSVファイルを対応するテーブルにインポートする関数
function importCsvToTable(db, tableName, filePath, callback) {
  const columns = []; // CSVのカラム名を格納する配列
  const rows = [];    // CSVデータの行を格納する配列

  fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headers) => {
          columns.push(...headers);
      })
      .on('data', (data) => {
          rows.push(data);
      })
      .on('end', () => {
          db.serialize(() => {
              db.run(`DELETE FROM ${tableName}`); // 既存データを削除
              const placeholders = columns.map(() => '?').join(',');
              const insertStmt = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

              const stmt = db.prepare(insertStmt);
              rows.forEach(row => {
                  stmt.run(columns.map(col => row[col]));
              });
              stmt.finalize(callback);
          });
      })
      .on('error', callback);
}




module.exports = {
  loadAllTablesData,
  importCsvToTable,
  importAllCsvToDatabase,
  getTablesFromDB,
  getTableData,
  convertToCSV
};