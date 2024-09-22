const { ipcMain } = require('electron');
const {
    loadShippingMethods,
    getShippingMethodById,
    saveShippingMethod,
    deleteShippingMethodById,
    editShippingMethod,
    searchShippingMethods
} = require('../../database/masters/shippingMethods');

ipcMain.on('load-shipping-methods', (event) => {
    loadShippingMethods((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-shipping-methods', rows);
        }
    });
});

ipcMain.on('get-shipping-method-detail', (event, id) => {
    getShippingMethodById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('shipping-method-detail-data', row);
        }
    });
});

ipcMain.on('save-shipping-method', (event, shippingMethodData) => {
    saveShippingMethod(shippingMethodData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadShippingMethods((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-shipping-methods', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-shipping-method', (event, id) => {
    deleteShippingMethodById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('shipping-method-deleted', id);
        }
    });
});

ipcMain.on('edit-shipping-method', (event, id) => {
    editShippingMethod(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-shipping-method', row);
        }
    });
});

ipcMain.on('search-shipping-methods', (event, query) => {
    searchShippingMethods(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-shipping-methods-result', query);
        }
    });
});
