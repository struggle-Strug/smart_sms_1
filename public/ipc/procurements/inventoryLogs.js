const { ipcMain } = require('electron');
const {
    loadInventoryLogs,
    deleteInventoryLogById,
    saveInventoryLog,
    searchInventoryLogs,
    editInventoryLog,
    getGroupedInventoryLogs,
    getFilteredInventoryLogs
} = require('../../database/procurements/inventoryLogs');

// ログをロード
ipcMain.on('load-inventory-logs', (event) => {
    loadInventoryLogs((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-inventory-logs', rows);
        }
    });
});

// 特定のログを削除
ipcMain.on('delete-inventory-log', (event, id) => {
    deleteInventoryLogById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('inventory-log-deleted', id);
        }
    });
});

// 特定のログを編集（取得）
ipcMain.on('edit-inventory-log', (event, id) => {
    editInventoryLog(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-inventory-log', row);
        }
    });
});

// ログを検索
ipcMain.on('search-inventory-logs', (event, query) => {
    searchInventoryLogs(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-inventory-logs-result', results);
        }
    });
});

// ログを保存（新規追加）
ipcMain.on('save-inventory-log', (event, log) => {
    saveInventoryLog(log, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('save-inventory-log-result', { id: result.lastID });
        }
    });
});

ipcMain.on('get-inventory-log-grouped-by-product', (event, log) => {
    getGroupedInventoryLogs(log, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('get-inventory-log-grouped-by-product-result', { id: result.lastID });
        }
    });
});

ipcMain.on('get-inventory-log-filtered', (event, query) => {
    getFilteredInventoryLogs(query, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('get-inventory-log-filtered-result', result);
        }
    });
});
