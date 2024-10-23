const { ipcMain } = require('electron');
const { 
    loadPaymentVoucherDetails, 
    getPaymentVoucherDetailById, 
    savePaymentVoucherDetail, 
    deletePaymentVoucherDetailById, 
    editPaymentVoucherDetail, 
    searchPaymentVoucherDetails ,
    searchPaymentVouchersByPaymentVoucherId,
    deletePaymentVoucherDetailsByPvId,
} = require('../../database/procurements/paymentVoucherDetails');

// 支払伝票明細のデータをロード
ipcMain.on('load-payment-voucher-details', (event) => {
    loadPaymentVoucherDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-payment-voucher-details', rows);
        }
    });
});

// 支払伝票明細の詳細を取得
ipcMain.on('get-payment-voucher-detail', (event, id) => {
    getPaymentVoucherDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-voucher-detail-data', row);
        }
    });
});

// 支払伝票明細を保存
ipcMain.on('save-payment-voucher-detail', (event, detailData) => {
    savePaymentVoucherDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPaymentVoucherDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-payment-voucher-details', rows);
                }
            });
        }
    });
});

// 支払伝票明細を削除
ipcMain.on('delete-payment-voucher-detail', (event, id) => {
    deletePaymentVoucherDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-voucher-detail-deleted', id);
        }
    });
});

// 支払伝票明細を編集
ipcMain.on('edit-payment-voucher-detail', (event, id) => {
    editPaymentVoucherDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-payment-voucher-detail', row);
        }
    });
});

// 支払伝票明細の検索
ipcMain.on('search-payment-voucher-details', (event, query) => {
    searchPaymentVoucherDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-payment-voucher-details-result', results);
        }
    });
});

// payment_vouchers テーブルでの検索処理
ipcMain.on('search-payment-voucher-details-by-payment-voucher-id', (event, query) => {
    searchPaymentVouchersByPaymentVoucherId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-payment-voucher-details-by-payment-voucher-id-result', results);
        }
    });
});

// payment_vouchers テーブルでの削除処理
ipcMain.on('delete-payment-voucher-details-by-pv-id', (event, paymentVoucherId) => {
    deletePaymentVoucherDetailsByPvId(paymentVoucherId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-voucher-details-deleted-by-pv-id', paymentVoucherId);
        }
    });
});


