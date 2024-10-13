const { ipcMain } = require('electron');
const { 
    loadPurchaseOrders, 
    getPurchaseOrderById, 
    savePurchaseOrder, 
    deletePurchaseOrderById, 
    editPurchaseOrder 
} = require('../../database/procurements/purchaseOrders');

// 発注書のデータをロード
ipcMain.on('load-purchase-orders', (event) => {
    loadPurchaseOrders((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-purchase-orders', rows);
        }
    });
});

// 発注書の詳細を取得
ipcMain.on('get-purchase-order-detail', (event, id) => {
    getPurchaseOrderById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-order-detail-data', row);
        }
    });
});

// 発注書を保存
ipcMain.on('save-purchase-order', (event, orderData) => {
    savePurchaseOrder(orderData, (err) => {
        console.log(orderData);
        if (err) {
            console.error(err.message);
        } else {
            loadPurchaseOrders((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-purchase-orders', rows);
                }
            });
        }
    });
});

// 発注書を削除
ipcMain.on('delete-purchase-order', (event, id) => {
    deletePurchaseOrderById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-order-deleted', id);
        }
    });
});

// 発注書を編集
ipcMain.on('edit-purchase-order', (event, id) => {
    editPurchaseOrder(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-purchase-order', row);
        }
    });
});

// 発注書の検索（オプション）
ipcMain.on('search-purchase-orders', (event, query) => {
    searchPurchaseOrders(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-orders-result', results);
        }
    });
});
