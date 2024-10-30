const { ipcMain } = require('electron');
const { loadVendors, getVendorById, saveVendor, deleteVendorById, searchVendors, searchIdVendors, searchNameVendors } = require('../../database/masters/vendors');

ipcMain.on('load-vendors', (event) => {
    loadVendors((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-vendors', rows);
        }
    });
});

ipcMain.on('get-vendor-detail', (event, id) => {
    getVendorById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('vendor-detail-data', row);
        }
    });
});

ipcMain.on('edit-vendor', (event, id) => {
    getVendorById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-vendor', row);
        }
    });
});

ipcMain.on('save-vendor', (event, vendorData) => {
    saveVendor(vendorData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadVendors((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-vendors', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-vendor', (event, id) => {
    deleteVendorById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('vendor-deleted', id);
        }
    });
});

ipcMain.on('search-vendors', (event, query) => {
    searchVendors(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-vendors-result', query);
        }
    });
});

ipcMain.on('search-id-vendors', (event, query) => {
    searchIdVendors(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-id-vendors-result', query);
        }
    });
});

ipcMain.on('search-name-vendors', (event, query) => {
    searchNameVendors(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-name-vendors-result', query);
        }
    });
});
