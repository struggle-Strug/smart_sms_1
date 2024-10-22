const { ipcMain } = require('electron');
const { 
    loadPaymentVouchers, 
    getPaymentVoucherById, 
    savePaymentVoucher, 
    deletePaymentVoucherById, 
    editPaymentVoucher, 
    searchPaymentVouchers 
} = require('../../database/procurements/paymentVouchers');

// 支払伝票のデータをロード
ipcMain.on('load-payment-vouchers', (event) => {
    loadPaymentVouchers((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-payment-vouchers', rows);
        }
    });
});

// 支払伝票の詳細を取得
ipcMain.on('get-payment-voucher-data', (event, id) => {
    getPaymentVoucherById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('get-payment-voucher-data-result', row);
        }
    });
});

// 支払伝票を保存
ipcMain.on('save-payment-voucher', (event, voucherData) => {
    console.log(voucherData)
    savePaymentVoucher(voucherData, (err,result) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('save-payment-voucher-result', { id: result.lastID });
        }
    });
});

// 支払伝票を削除
ipcMain.on('delete-payment-voucher', (event, id) => {
    deletePaymentVoucherById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-voucher-deleted', id);
        }
    });
});

// 支払伝票を編集
ipcMain.on('edit-payment-voucher', (event, id) => {
    editPaymentVoucher(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-payment-voucher', row);
        }
    });
});

// 支払伝票の検索
ipcMain.on('search-payment-vouchers', (event, query) => {
    searchPaymentVouchers(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-payment-vouchers-result', results);
        }
    });
});
