const { ipcMain } = require('electron');
const {
    loadSquareLogs,
    deleteSquareLogById,
    saveSquareLog,
    editSquareLog,
    searchSquareLogs,
    getLatestLogByRequestDateTime
} = require('../../database/procurements/squareLogs');

// ログをロードする
ipcMain.on('load-square-logs', (event) => {
    loadSquareLogs((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-logs', rows);
        }
    });
});

// ログを削除する
ipcMain.on('delete-square-log', (event, id) => {
    deleteSquareLogById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('log-deleted', id);
        }
    });
});

// 特定のログを編集するために取得する
ipcMain.on('edit-square-log', (event, id) => {
    editSquareLog(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-log', row);
        }
    });
});

// ログを検索する
ipcMain.on('search-square-logs', (event, query) => {
    searchSquareLogs(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-logs-result', results);
        }
    });
});

// ログを保存する（新規または更新）
ipcMain.on('save-square-log', (event, log) => {
    saveSquareLog(log, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入または更新したレコードのIDを返す
            event.sender.send('save-log-result', { id: result.lastID });
        }
    });
});
// ログを保存する（新規または更新）
ipcMain.on('get-last-square-log', (event, log) => {
    getLatestLogByRequestDateTime((err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入または更新したレコードのIDを返す
            event.sender.send('get-last-square-log-result', result);
        }
    });
});
