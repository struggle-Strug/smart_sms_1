const { ipcMain } = require('electron');
const { loadStorageFacilities, getStorageFacilityById, saveStorageFacility, deleteStorageFacilityById, searchStorageFacilities } = require('../../database/masters/storageFacilities');

ipcMain.on('load-storage-facilities', (event) => {
    loadStorageFacilities((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-storage-facilities', rows);
        }
    });
});

ipcMain.on('get-storage-facility-detail', (event, id) => {
    getStorageFacilityById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('storage-facility-detail-data', row);
        }
    });
});

ipcMain.on('edit-storage-facility', (event, id) => {
    getStorageFacilityById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-storage-facility', row);
        }
    });
});

ipcMain.on('save-storage-facility', (event, facilityData) => {
    saveStorageFacility(facilityData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadStorageFacilities((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-storage-facilities', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-storage-facility', (event, id) => {
    deleteStorageFacilityById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('storage-facility-deleted', id);
        }
    });
});

ipcMain.on('search-storage-facilities', (event, query) => {
    searchStorageFacilities(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-storage-facilities-result', query);
        }
    });
});
