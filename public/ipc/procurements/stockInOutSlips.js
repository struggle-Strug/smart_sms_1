const { ipcMain } = require('electron');
const { 
    loadStockInOutSlips, 
    getStockInOutSlipById, 
    saveStockInOutSlip, 
    deleteStockInOutSlipById, 
    editStockInOutSlip, 
    searchStockInOutSlips 
} = require('../../database/procurements/stockInOutSlips');

// 在庫入出庫伝票のデータをロード
ipcMain.on('load-stock-in-out-slips', (event) => {
    loadStockInOutSlips((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-stock-in-out-slips', rows);
        }
    });
});

// 在庫入出庫伝票の詳細を取得
ipcMain.on('get-stock-in-out-slip-data', (event, id) => {
    getStockInOutSlipById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('stock-in-out-slip-data-result', row);
        }
    });
});

// 在庫入出庫伝票を保存
ipcMain.on('save-stock-in-out-slip', (event, slipData) => {
    saveStockInOutSlip(slipData, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('get-stock-in-out-slip-data-result',  { id: result.lastID });
        }
    });
});

// 在庫入出庫伝票を削除
ipcMain.on('delete-stock-in-out-slip', (event, id) => {
    deleteStockInOutSlipById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('stock-in-out-slip-deleted', id);
        }
    });
});

// 在庫入出庫伝票を編集
ipcMain.on('edit-stock-in-out-slip', (event, id) => {
    editStockInOutSlip(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-stock-in-out-slip', row);
        }
    });
});

// 在庫入出庫伝票の検索（オプション）
ipcMain.on('search-stock-in-out-slips', (event, query) => {
    searchStockInOutSlips(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-stock-in-out-slips-result', results);
        }
    });
});
