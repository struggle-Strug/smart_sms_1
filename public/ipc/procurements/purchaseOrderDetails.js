const { ipcMain } = require('electron');
const { 
    loadPurchaseOrderDetails, 
    getPurchaseOrderDetailById, 
    savePurchaseOrderDetail, 
    deletePurchaseOrderDetailById, 
    editPurchaseOrderDetail, 
    searchPurchaseOrderDetails,
    searchPurchaseOrdersByPurchaseOrderId,
    deletePurchaseOrderDetailsByPoId
} = require('../../database/procurements/purchaseOrderDetails');

// 購入注文明細のデータをロード
ipcMain.on('load-purchase-order-details', (event) => {
    loadPurchaseOrderDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-purchase-order-details', rows);
        }
    });
});

// 購入注文明細の詳細を取得
ipcMain.on('get-purchase-order-detail-data', (event, id) => {
    getPurchaseOrderDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-order-detail-data-result', row);
        }
    });
});

// 購入注文明細を保存
ipcMain.on('save-purchase-order-detail', (event, detailData) => {
    savePurchaseOrderDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPurchaseOrderDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-purchase-order-details', rows);
                }
            });
        }
    });
});

// 購入注文明細を削除
ipcMain.on('delete-purchase-order-detail', (event, id) => {
    deletePurchaseOrderDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-order-detail-deleted', id);
        }
    });
});

// 購入注文明細を編集
ipcMain.on('edit-purchase-order-detail', (event, id) => {
    editPurchaseOrderDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-purchase-order-detail', row);
        }
    });
});

// 購入注文明細の検索
ipcMain.on('search-purchase-order-details', (event, query) => {
    searchPurchaseOrderDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-order-details-result', results);
        }
    });
});

ipcMain.on('search-purchase-order-details-by-vender-id', (event, query) => {
    searchPurchaseOrdersByPurchaseOrderId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-order-details-by-vender-id-result', results);
        }
    });
});

ipcMain.on('delete-purchase-order-details-by-po-id', (event, purchaseOrderId) => {
    deletePurchaseOrderDetailsByPoId(purchaseOrderId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-order-details-deleted-by-po-id', purchaseOrderId);
        }
    });
});
