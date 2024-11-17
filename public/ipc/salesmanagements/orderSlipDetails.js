const { ipcMain } = require('electron');
const { 
    loadOrderSlipDetails, 
    getOrderSlipDetailById, 
    saveOrderSlipDetail, 
    deleteOrderSlipDetailById, 
    editOrderSlipDetail, 
    searchOrderSlipDetails,
    searchOrderSlipsByOrderSlipId,
    deleteOrderSlipDetailsBySlipId,
    deleteOrderSlipDetailsBySoId,
    searchOrderSlipDepositDetails
} = require('../../database/salesmanagements/orderSlipDetails');

// 購入注文明細のデータをロード
ipcMain.on('load-order-slip-details', (event) => {
    loadOrderSlipDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-order-slip-details', rows);
        }
    });
});

// 購入注文明細の詳細を取得
ipcMain.on('get-order-slip-detail-data', (event, id) => {
    getOrderSlipDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-detail-data-result', row);
        }
    });
});

// 購入注文明細を保存
ipcMain.on('save-order-slip-detail', (event, detailData) => {
    saveOrderSlipDetail(detailData, (err,result) => {
        if (err) {
            console.error(err.message);
        } else {
            loadOrderSlipDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-order-slip-details', rows);
                }
            });
        }
    });
});

// 購入注文明細を削除
ipcMain.on('delete-order-slip-detail', (event, id) => {
    deleteOrderSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-detail-deleted', id);
        }
    });
});

// 購入注文明細を削除
ipcMain.on('order-slip-details-deleted-by-slip-id', (event, id) => {
    deleteOrderSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-detail-deleted', id);
        }
    });
});

// 購入注文明細を編集
ipcMain.on('edit-order-slip-detail', (event, id) => {
    editOrderSlipDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-order-slip-detail', row);
        }
    });
});

// 購入注文明細の検索
ipcMain.on('search-order-slip-details', (event, query) => {
    searchOrderSlipDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-order-slip-details-result', results);
        }
    });
});

// 購入注文明細の検索
ipcMain.on('search-order-slip-deposit-details', (event, query) => {
    searchOrderSlipDepositDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-order-slip-details-result', results);
        }
    });
});

ipcMain.on('search-order-slip-details-by-vender-id', (event, query) => {
    console.log("ipc search-order-slip-details-by-vender-id");
    searchOrderSlipsByOrderSlipId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-order-slip-details-by-vender-id-result', results);
        }
    });
});

ipcMain.on('delete-order-slip-details-by-slip-id', (event, orderSlipId) => {
    deleteOrderSlipDetailsBySlipId(orderSlipId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-details-deleted-by-slip-id', orderSlipId);
        }
    });
});
