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

function loadDataConversions(callback) {
  db.all('SELECT * FROM data_conversions', [], callback);
}

function importExcelToDatabase(db, excelDirPath, csvDirPath, callback) {
  fs.readdir(excelDirPath, (err, files) => {
    if (err) return callback(err);

    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    let remaining = excelFiles.length;

    if (remaining === 0) return callback(null, "No Excel files to import.");

    excelFiles.forEach((file) => {
      const tableName = path.basename(file, '.xlsx'); // Excelファイル名からテーブル名を取得
      const excelFilePath = path.join(excelDirPath, file);
      const csvFilePath = path.join(csvDirPath, `${tableName}.csv`);

      // ExcelをCSVに変換
      convertExcelToCsv(excelFilePath, csvFilePath, (err) => {
        if (err) return callback(err);

        // CSVをテーブルにインポート
        importCsvToTable(db, tableName, csvFilePath, (err) => {
          if (err) return callback(err);

          remaining -= 1;
          if (remaining === 0) {
            callback(null, "All Excel files imported successfully.");
          }
        });
      });
    });
  });
}

// ExcelをCSVに変換する関数
function convertExcelToCsv(excelFilePath, csvFilePath, callback) {
  try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // 最初のシートを使用
    const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);

    fs.writeFile(csvFilePath, csvData, (err) => {
      if (err) return callback(err);
      callback(null);
    });
  } catch (error) {
    callback(error);
  }
}

// CSVをSQLiteテーブルにインポートする関数
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
  initializeDatabase,
  loadDataConversions,
  importExcelToDatabase,
  convertExcelToCsv
};






//Excel取込み
// function dataConversionsImport(db, csvDirPath, callback) {
//   fs.readdir(csvDirPath, (err, files) => {
//       if (err) return callback(err);

//       const csvFiles = files.filter(file => file.endsWith('.csv'));
//       let remaining = csvFiles.length;

//       if (remaining === 0) return callback(null, "No CSV files to import.");

//       csvFiles.forEach((file) => {
//           const tableName = path.basename(file, '.csv'); // ファイル名からテーブル名を取得
//           const filePath = path.join(csvDirPath, file);

//           importCsvToTable(db, tableName, filePath, (err) => {
//               if (err) return callback(err);

//               remaining -= 1;
//               if (remaining === 0) {
//                   callback(null, "復元に成功しました。");
//               }
//           });
//       });
//   });
// }

// // 単一CSVファイルを対応するテーブルにインポートする関数
// function importCsvToTable(db, tableName, filePath, callback) {
//   const columns = []; // CSVのカラム名を格納する配列
//   const rows = [];    // CSVデータの行を格納する配列

//   fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('headers', (headers) => {
//           columns.push(...headers);
//       })
//       .on('data', (data) => {
//           rows.push(data);
//       })
//       .on('end', () => {
//           db.serialize(() => {
//               db.run(`DELETE FROM ${tableName}`); // 既存データを削除
//               const placeholders = columns.map(() => '?').join(',');
//               const insertStmt = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

//               const stmt = db.prepare(insertStmt);
//               rows.forEach(row => {
//                   stmt.run(columns.map(col => row[col]));
//               });
//               stmt.finalize(callback);
//           });
//       })
//       .on('error', callback);
// }


// 1. ExcelファイルをCSVに変換
// function convertExcelToCsv(excelDirPath, csvDirPath, callback) {
//   fs.readdir(excelDirPath, (err, files) => {
//     if (err) return callback(err);

//     // .xlsx ファイルのみを取得
//     const excelFiles = files.filter(file => file.endsWith('.xlsx'));
//     if (excelFiles.length === 0) return callback(null, "No Excel files to convert.");

//     excelFiles.forEach((file) => {
//       const filePath = path.join(excelDirPath, file);
//       const workbook = xlsx.readFile(filePath);

//       workbook.SheetNames.forEach(sheetName => {
//         const csvFileName = `${path.basename(file, '.xlsx')}_${sheetName}.csv`;
//         const csvFilePath = path.join(csvDirPath, csvFileName);
        
//         const worksheet = workbook.Sheets[sheetName];
//         const csvData = xlsx.utils.sheet_to_csv(worksheet);

//         fs.writeFileSync(csvFilePath, csvData, 'utf8');
//       });
//     });

//     callback(null, "All Excel files converted to CSV.");
//   });
// }

// // 2. CSVをデータベースにインポートして更新
// function importExcelToDatabase(db, excelDirPath, csvDirPath, callback) {
//   // ExcelをCSVに変換
//   convertExcelToCsv(excelDirPath, csvDirPath, (err, message) => {
//     if (err) return callback(err);

//     console.log(message);  // 変換が完了したメッセージを表示

//     // CSVデータベースへのインポート
//     importAllCsvToDatabase(db, csvDirPath, callback);
//   });
// }


