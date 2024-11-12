const { ipcMain } = require('electron');
const { 
    loadDepositSlipDetails, 
    getDepositSlipDetailById, 
    saveDepositSlipDetail, 
    deleteDepositSlipDetailById, 
    editDepositSlipDetail, 
    searchDepositSlipsByDepositSlipId,
    deleteDepositSlipDetailsBySlipId,
    searchDepositSlipsDetails,
    getDepositsTotalByVendorIds,
} = require('../../database/salesmanagements/depositSlipDetails');

// 購入注文明細のデータをロード
ipcMain.on('load-deposit-slip-details', (event) => {
    loadDepositSlipDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-deposit-slip-details', rows);
        }
    });
});

// 購入注文明細の詳細を取得
ipcMain.on('get-deposit-slip-detail-data', (event, id) => {
    getDepositSlipDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-detail-data-result', row);
        }
    });
});

// 購入注文明細を保存
ipcMain.on('save-deposit-slip-detail', (event, detailData) => {
    saveDepositSlipDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadDepositSlipDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-deposit-slip-details', rows);
                }
            });
        }
    });
});

// 購入注文明細を削除
ipcMain.on('delete-deposit-slip-detail', (event, id) => {
    deleteDepositSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-detail-deleted', id);
        }
    });
});

// 売上伝票明細を削除 (編集画面用)
ipcMain.on('deposit-slip-details-deleted-by-slip-id', (event, id) => {
    deleteDepositSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-detail-deleted', id);
        }
    });
});

// 購入注文明細を編集
ipcMain.on('edit-deposit-slip-detail', (event, id) => {
    editDepositSlipDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-deposit-slip-detail', row);
        }
    });
});

// 購入注文明細の検索
ipcMain.on('search-deposit-slip-details', (event, query) => {
    searchDepositSlipsDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-deposit-slip-details-result', results);
        }
    });
});

ipcMain.on('search-deposit-slip-details-by-vender-id', (event, query) => {
    searchDepositSlipsByDepositSlipId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-deposit-slip-details-by-vender-id-result', results);
        }
    });
});

ipcMain.on('delete-deposit-slip-details-by-slip-id', (event, depositSlipId) => {
    deleteDepositSlipDetailsBySlipId(depositSlipId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-details-deleted-by-slip-id', depositSlipId);
        }
    });
});


ipcMain.on('get-deposit-slip-sum-by-vender-id', (event, data) => {
    getDepositsTotalByVendorIds(data, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('get-deposit-slip-sum-by-vender-id-result', results);
        }
    });
});

ipcMain.on('get-deposit-slip-sum-by-vender-id', (event, data) => {
    getDepositsTotalByVendorIds(data, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('get-deposit-slip-sum-by-vender-id-result', results);
        }
    });
});


