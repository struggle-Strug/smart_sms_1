const { ipcMain, dialog } = require('electron');
const { 
  loadAllTablesData, 
  importCSVToTable, 
  importAllCsvToDatabase, 
  // getTablesFromDB,
  // getTableData,
  convertToCSV 
} = require('../../database/dashboard/backupsSettings');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const archiver = require('archiver');

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

ipcMain.handle('export-all-tables-to-zip', async (event, db) => {
  try {
    // ユーザーにフォルダを選択させる
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length === 0) {
      return { error: 'Export canceled by user.' };
    }

    const outputFolder = filePaths[0];
    const zipPath = path.join(outputFolder, 'backup.zip');

    // ZIP ファイル作成準備
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`ZIP file created: ${zipPath}`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // 全テーブルのデータを取得し CSV を ZIP に追加
    // const tables = await getTablesFromDB(db); // コメントアウト
    // for (const tableName of tables) { // コメントアウト
    //   const rows = await getTableData(db, tableName); // コメントアウト

      if (rows.length > 0) {
        const csvContent = convertToCSV(rows); // データをCSV形式に変換する関数
        archive.append(csvContent, { name: `${tableName}.csv` });
      }
    // } // コメントアウト

    // ZIP ファイルの書き込み完了
    await archive.finalize();

    return { success: true, zipPath };
  } catch (error) {
    console.error('Error exporting data to ZIP:', error);
    return { error: error.message };
  }
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