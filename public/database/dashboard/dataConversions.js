const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const { importAllCsvToDatabase } = require('../dashboard/backupsSettings');
//require('../../database/dashboard/backupsSettings');
// データベースとExcelディレクトリのパスを設定
const excelDirPath = '/public/excel/xlsx';  // Excelファイルが置かれているディレクトリ
const csvDirPath = '/public/excel/csv';  // 一時的なCSVファイル保存ディレクトリ

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

function getFormattedDate() {
  const now = new Date();
  now.setHours(now.getHours() + 9); // 日本時間に変換 (UTC+9)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function loadDataConversions(callback) {
  db.all('SELECT * FROM data_conversions', [], callback);
}

function importExcelToDatabase(db, excelDirPath, csvDirPath, callback) {
  fs.readdir(excelDirPath, (err, files) => {
    if (err) return callback(err);

    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    let remaining = excelFiles.length;
    const logs = [];

    if (remaining === 0) return callback(null, "No Excel files to import.");

    excelFiles.forEach((file) => {
      const tableName = path.basename(file, '.xlsx'); // Excelファイル名からテーブル名を取得
      const excelFilePath = path.join(excelDirPath, file);
      const csvFilePath = path.join(csvDirPath, `${tableName}.csv`);

      // ExcelをCSVに変換
      convertExcelToCsv(excelFilePath, csvFilePath, (err) => {
        if (err) return callback(err);

        // CSVをテーブルにインポート
        importCsvToTable(db, tableName, csvFilePath, (err, stats) => {
          if (err) return callback(err);

          // 更新ログを記録
          const log = {
            file_name: file,
            complete_time: getFormattedDate(),
            total_line_count: stats.newRecords,
            // total_line_count: stats.totalLines,
            updated_record: stats.updatedLines,
            imported_line_count: stats.importedLines,
            new_record: stats.totalLines,
            // new_record: stats.newRecords,
          };
          logs.push(log);

          saveImportLog(db, log, (err) => {
            if (err) console.error("Failed to save import log:", err);
          });

          remaining -= 1;
          if (remaining === 0) {
            callback(null, logs);
          }
        });
      });
    });
  });
}

// ExcelをCSVに変換する関数
function convertExcelToCsv(excelFilePath, csvFilePath, callback) {
  const xlsx = require('xlsx');

  try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    fs.writeFile(csvFilePath, sheetData, callback);
  } catch (error) {
    callback(error);
  }
}

// CSVをSQLiteテーブルにインポートする関数
function importCsvToTable(db, tableName, csvFilePath, callback) {
  const csv = require('csv-parser');
  const fs = require('fs');

  const data = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      let totalLines = data.length;
      let updatedLines = 0;
      let importedLines = 0;
      let newRecords = 0;

      // データベース更新処理
      data.forEach((row) => {
        const keys = Object.keys(row);
        const values = Object.values(row);

        // データが既に存在する場合は更新、存在しない場合は挿入
        const placeholders = keys.map(() => '?').join(',');
        const updateFields = keys.map((key) => `${key} = ?`).join(',');
        const query = `
          INSERT INTO ${tableName} (${keys.join(',')})
          VALUES (${placeholders})
          ON CONFLICT (id) DO UPDATE SET ${updateFields};
        `;

        db.run(query, [...values, ...values], function (err) {
          if (err) {
            console.error(`Failed to insert/update ${tableName}:`, err);
          } else {
            if (this.changes === 1) newRecords++;
            if (this.changes === 2) updatedLines++;
            importedLines++;
          }
        });
      });

      callback(null, { totalLines, updatedLines, importedLines, newRecords });
    })
    .on('error', (err) => {
      callback(err);
    });
}

function saveImportLog(db, log, callback) {
  const query = `
    INSERT INTO data_conversions (file_name, complete_time, total_line_count, updated_record, imported_line_count, new_record)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    log.file_name,
    log.complete_time,
    log.total_line_count,
    log.updated_record,
    log.imported_line_count,
    log.new_record,
  ];

  db.run(query, params, callback);
}

module.exports = { 
  initializeDatabase,
  loadDataConversions,
  importExcelToDatabase,
  convertExcelToCsv,
  // saveExcelToDataConversionsTable
};