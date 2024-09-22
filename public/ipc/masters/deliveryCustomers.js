const { ipcMain } = require('electron');
const { loadDeliveryCustomers, getDeliveryCustomerById, saveDeliveryCustomer, deleteDeliveryCustomerById, searchDeliveryCustomers } = require('../../database/masters/deliveryCustomers');

ipcMain.on('load-delivery-customers', (event) => {
    loadDeliveryCustomers((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-delivery-customers', rows);
        }
    });
});

ipcMain.on('edit-delivery-customer', (event, id) => {
    getDeliveryCustomerById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-delivery-customer', row);
        }
    });
});

ipcMain.on('save-delivery-customer', (event, customerData) => {
    saveDeliveryCustomer(customerData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadDeliveryCustomers((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-delivery-customers', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-delivery-customer', (event, id) => {
    deleteDeliveryCustomerById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('delivery-customer-deleted', id);
        }
    });
});

ipcMain.on('get-delivery-customer-detail', (event, id) => {
    getDeliveryCustomerById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('delivery-customer-detail-data', row);
        }
    });
});
ipcMain.on('search-delivery-customers', (event, query) => {
    searchDeliveryCustomers(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-delivery-customers-result', query);
        }
    });
});
