const { ipcMain } = require('electron');
const { loadPaymentMethods, getPaymentMethodById, savePaymentMethod, deletePaymentMethodById, searchPaymentMethods } = require('../../database/masters/paymentMethods');

ipcMain.on('load-payment-methods', (event) => {
    loadPaymentMethods((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-payment-methods', rows);
        }
    });
});

ipcMain.on('get-payment-method-detail', (event, id) => {
    getPaymentMethodById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-method-detail-data', row);
        }
    });
});

ipcMain.on('save-payment-method', (event, paymentMethodData) => {
    savePaymentMethod(paymentMethodData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPaymentMethods((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-payment-methods', rows);
                }
            });
        }
    });
});

ipcMain.on('edit-payment-method', (event, id) => {
    getPaymentMethodById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-payment-method', row);
        }
    });
});

ipcMain.on('delete-payment-method', (event, id) => {
    deletePaymentMethodById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('payment-method-deleted', id);
        }
    });
});

ipcMain.on('search-payment-methods', (event, query) => {
    searchPaymentMethods(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-payment-methods-result', query);
        }
    });
});
