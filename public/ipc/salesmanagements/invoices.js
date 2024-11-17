const { ipcMain } = require('electron');
const { loadInvoices, getInvoiceById, saveInvoice, deleteInvoiceById, editInvoice, searchInvoices, countInvoicesForToday } = require('../../database/salesmanagements/invoices');

// Load Invoices
ipcMain.on('load-invoices', (event) => {
    loadInvoices((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-invoices', rows);
        }
    });
});

// Get details of a specific Invoice
ipcMain.on('get-invoice-detail', (event, id) => {
    getInvoiceById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('invoice-detail-data', row);
        }
    });
});

// Save an Invoice (new or update)
ipcMain.on('save-invoice', (event, invoiceData) => {
    saveInvoice(invoiceData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadInvoices((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-invoices', rows);
                }
            });
        }
    });
});

// Delete an Invoice
ipcMain.on('delete-invoice', (event, id) => {
    deleteInvoiceById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('invoice-deleted', id);
        }
    });
});

// Edit an Invoice
ipcMain.on('edit-invoice', (event, id) => {
    editInvoice(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-invoice', row);
        }
    });
});

// Search Invoices
ipcMain.on('search-invoices', (event, query) => {
    searchInvoices(query, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-invoices-result', rows);
        }
    });
});
// Search Invoices
ipcMain.on('count-today-invoices', (event, query) => {
    countInvoicesForToday((err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('count-today-invoices-result', data);
        }
    });
});
