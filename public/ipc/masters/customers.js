const { ipcMain } = require('electron');
const { loadCustomers, getCustomerById, saveCustomer, deleteCustomerById, searchCustomers } = require('../../database/masters/customers');

ipcMain.on('load-customers', (event) => {
    loadCustomers((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-customers', rows);
        }
    });
});

ipcMain.on('edit-customer', (event, id) => {
    getCustomerById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-customer', row);
        }
    });
});

ipcMain.on('save-customer', (event, customerData) => {
    saveCustomer(customerData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadCustomers((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-customers', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-customer', (event, id) => {
    deleteCustomerById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('customer-deleted', id);
        }
    });
});

ipcMain.on('get-customers', (event) => {
    loadCustomers((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('customers-data', rows);
        }
    });
});

ipcMain.on('get-customer-detail', (event, id) => {
    getCustomerById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('customer-detail-data', row);
        }
    });
});

ipcMain.on('search-customers', (event, query) => {
    searchCustomers(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(query);
            event.sender.send('search-customers-result', query);
        }
    });
});
