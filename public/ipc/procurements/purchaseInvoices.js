const { ipcMain } = require('electron');
const { 
    loadPurchaseInvoices, 
    getPurchaseInvoiceById, 
    savePurchaseInvoice, 
    deletePurchaseInvoiceById, 
    editPurchaseInvoice, 
    searchPurchaseInvoices 
} = require('../../database/procurements/purchaseInvoices');

// 仕入請求書のデータをロード
ipcMain.on('load-purchase-invoices', (event) => {
    loadPurchaseInvoices((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-purchase-invoices', rows);
        }
    });
});

// 仕入請求書の詳細を取得
ipcMain.on('get-purchase-invoice-detail', (event, id) => {
    getPurchaseInvoiceById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-invoice-detail-data', row);
        }
    });
});

// 仕入請求書を保存
ipcMain.on('save-purchase-invoice', (event, invoiceData) => {
    savePurchaseInvoice(invoiceData, (err) => {
        console.log(invoiceData);
        if (err) {
            console.error(err.message);
        } else {
            loadPurchaseInvoices((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-purchase-invoices', rows);
                }
            });
        }
    });
});

// 仕入請求書を削除
ipcMain.on('delete-purchase-invoice', (event, id) => {
    deletePurchaseInvoiceById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('purchase-invoice-deleted', id);
        }
    });
});

// 仕入請求書を編集
ipcMain.on('edit-purchase-invoice', (event, id) => {
    editPurchaseInvoice(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-purchase-invoice', row);
        }
    });
});

// 仕入請求書の検索（オプション）
ipcMain.on('search-purchase-invoices', (event, query) => {
    searchPurchaseInvoices(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-purchase-invoices-result', results);
        }
    });
});
