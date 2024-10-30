const { ipcMain } = require('electron');
const { 
    loadPurchaseInvoiceDetails, 
    getPurchaseInvoiceDetailById, 
    savePurchaseInvoiceDetail, 
    deletePurchaseInvoiceDetailById, 
    editPurchaseInvoiceDetail, 
    searchPurchaseInvoiceDetails,
    searchPurchaseInvoicesByPurchaseInvoiceId,
    deletePurchaseInvoiceDetailsByPiId
} = require('../../database/procurements/purchaseInvoiceDetails');

// 購入請求明細のデータをロード
ipcMain.on('load-purchase-invoice-details', (event) => {
    loadPurchaseInvoiceDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-purchase-invoice-details', rows);
        }
    });
});

// 購入請求明細の詳細を取得
ipcMain.on('get-purchase-invoice-detail', (event, id) => {
    getPurchaseInvoiceDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-invoice-detail-data', row);
        }
    });
});

// 購入請求明細を保存
ipcMain.on('save-purchase-invoice-detail', (event, detailData) => {
    savePurchaseInvoiceDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPurchaseInvoiceDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-purchase-invoice-details', rows);
                }
            });
        }
    });
});

// 購入請求明細を削除
ipcMain.on('delete-purchase-invoice-detail', (event, id) => {
    deletePurchaseInvoiceDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-invoice-detail-deleted', id);
        }
    });
});

// 購入請求明細を編集
ipcMain.on('edit-purchase-invoice-detail', (event, id) => {
    editPurchaseInvoiceDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-purchase-invoice-detail', row);
        }
    });
});

// 購入請求明細の検索
ipcMain.on('search-purchase-invoice-details', (event, query) => {
    searchPurchaseInvoiceDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-invoice-details-result', results);
        }
    });
});

ipcMain.on('search-purchase-invoice-details-by-purchase-invoice-id', (event, query) => {
    searchPurchaseInvoicesByPurchaseInvoiceId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-invoice-details-by-purchase-invoice-id-result', results);
        }
    });
});

ipcMain.on('delete-purchase-invoice-details-by-pi-id', (event, purchaseInvoiceId) => {
    deletePurchaseInvoiceDetailsByPiId(purchaseInvoiceId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-invoice-details-deleted-by-pi-id', purchaseInvoiceId);
        }
    });
});

