const { ipcMain } = require('electron');
const { loadAllTablesData, loadAllTablesDataAndExportToCSV, importCSVToTable, importAllCsvToDatabase } = require('../../database/dashboard/backupsSettings');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// DBインスタンスの作成
const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);
const csvDirPath = '/Users/esakiryota/smart-sms/public/csv';

ipcMain.on('get-all-tables-data', (event) => {
  loadAllTablesData(db, (err, data) => { // dbを渡す
      if (err) {
          console.error("Error loading data:", err);
          event.reply('all-tables-data', { error: err.message });
      } else {
          console.log('data', { data });
          event.reply('all-tables-data', { data });
      }
  });
});

ipcMain.on('export-all-tables-to-csv', (event) => {
  loadAllTablesDataAndExportToCSV(db, (err, message) => {
    if (err) {
      console.error("Error exporting data:", err);
      event.reply('export-all-tables-to-csv-reply', { error: err.message });
    } else {
      console.log(message);
      event.reply('export-all-tables-to-csv-reply', { message });
    }
  });
});

ipcMain.on('import-csv-to-table', (event, tableName, filePath) => {
  const csvFilePath = path.resolve(filePath); // ファイルパスを解決
  importCSVToTable(tableName, csvFilePath, (err) => {
    if (err) {
      console.error('Error importing CSV:', err);
      event.reply('import-csv-to-table-reply', { error: err.message });
    } else {
      event.reply('import-csv-to-table-reply', { message: 'Data imported successfully' });
    }
  });
});

ipcMain.on('restore-all-tables-from-csv', (event) => {
  importAllCsvToDatabase(db, csvDirPath, (err, message) => {
      if (err) {
          console.error("Error restoring data:", err);
          event.reply('restore-all-tables-from-csv-reply', { error: err.message });
      } else {
          console.log(message);
          event.reply('restore-all-tables-from-csv-reply', { message });
      }
  });
});