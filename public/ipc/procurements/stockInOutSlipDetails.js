const { ipcMain } = require('electron');
const { 
    loadStockInOutSlipDetails, 
    getStockInOutSlipDetailById, 
    saveStockInOutSlipDetail, 
    deleteStockInOutSlipDetailById, 
    editStockInOutSlipDetail, 
    searchStockInOutSlipDetails ,
    searchStockInOutSlipDetailsBySlipId,
    deleteStockInOutSlipDetailsBySlipId
} = require('../../database/procurements/stockInOutSlipDetails');

// 在庫入出庫伝票明細のデータをロード
ipcMain.on('load-stock-in-out-slip-details', (event) => {
    loadStockInOutSlipDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-stock-in-out-slip-details', rows);
        }
    });
});

// 在庫入出庫伝票明細の詳細を取得
ipcMain.on('get-stock-in-out-slip-detail', (event, id) => {
    getStockInOutSlipDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('stock-in-out-slip-detail-data', row);
        }
    });
});

// 在庫入出庫伝票明細を保存
ipcMain.on('save-stock-in-out-slip-detail', (event, detailData) => {
    saveStockInOutSlipDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadStockInOutSlipDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-stock-in-out-slip-details', rows);
                }
            });
        }
    });
});

// 在庫入出庫伝票明細を削除
ipcMain.on('delete-stock-in-out-slip-detail', (event, id) => {
    deleteStockInOutSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('stock-in-out-slip-detail-deleted', id);
        }
    });
});

// 在庫入出庫伝票明細を編集
ipcMain.on('edit-stock-in-out-slip-detail', (event, id) => {
    editStockInOutSlipDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-stock-in-out-slip-detail', row);
        }
    });
});

// 在庫入出庫伝票明細の検索
ipcMain.on('search-stock-in-out-slip-details', (event, query) => {
    searchStockInOutSlipDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-stock-in-out-slip-details-result', results);
        }
    });
});


ipcMain.on('search-stock-in-out-slip-details-by-slip-id', (event, query) => {
    searchStockInOutSlipDetailsBySlipId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-stock-in-out-slip-details-by-slip-id-result', results);
        }
    });
});

ipcMain.on('delete-stock-in-out-slip-details-by-slip-id', (event, stockInOutSlipId) => {
    deleteStockInOutSlipDetailsBySlipId(stockInOutSlipId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('stock-in-out-slip-details-deleted-by-slip-id', stockInOutSlipId);
        }
    });
});

