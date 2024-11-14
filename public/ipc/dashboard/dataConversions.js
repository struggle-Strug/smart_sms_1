const { ipcMain} = require('electron');
const { loadDataConversions, importExcelToDatabase } = require('../../database/dashboard/dataConversions');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

ipcMain.on('load-data-conversions', (event) => {
  loadDataConversions((err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("送信するデータ:", rows);
      event.sender.send('data-conversions-data', rows);
    }
  });
});

ipcMain.on('import-excel-to-database', (event, { excelDirPath, csvDirPath }) => {
  importExcelToDatabase(db, excelDirPath, csvDirPath, (err, message) => {
    if (err) {
      console.error("Error importing Excel data:", err);
      event.reply('import-excel-to-database-reply', { error: err.message });
    } else {
      console.log(message);
      event.reply('import-excel-to-database-reply', { message });
    }
  });
});