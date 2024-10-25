const { ipcMain } = require('electron');
const { 
    loadorderSlips, 
    getOrderSlipById, 
    saveOrderSlip, 
    deleteOrderSlipById, 
    editOrderSlip,
    searchorderSlips,
    searchorderSlipsOnPV
} = require('../../database/salesmanagements/orderSlips');

// 受注伝票のデータをロード
ipcMain.on('load-order-slips', (event) => {
    loadorderSlips((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-order-slips', rows);
        }
    });
});

// 受注伝票の詳細を取得
ipcMain.on('get-order-slip-detail', (event, id) => {
    getOrderSlipById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-detail-data', row);
        }
    });
});

// 受注伝票を保存
ipcMain.on('save-order-slip', (event, OrderSlip) => {
    saveOrderSlip(OrderSlip, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('save-order-slip-result', { id: result.lastID });
        }
    });
});

// 受注伝票を削除
ipcMain.on('delete-order-slip', (event, id) => {
    deleteOrderSlipById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('order-slip-deleted', id);
        }
    });
});

// 受注伝票を編集
ipcMain.on('edit-order-slip', (event, id) => {
    editOrderSlip(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-order-slip', row);
        }
    });
});

// 受注伝票の検索（オプション）
ipcMain.on('search-order-slips', (event, query) => {
    searchorderSlips(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-order-slips-result', results);
        }
    });

});
ipcMain.on('search-order-slips-on-pv', (event, query) => {
    searchorderSlipsOnPV(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-order-slips-on-pv-result', results);
        }
    });
});
