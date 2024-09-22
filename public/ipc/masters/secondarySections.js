const { ipcMain } = require('electron');
const {
    loadSecondarySections,
    getSecondarySectionById,
    saveSecondarySection,
    deleteSecondarySectionById,
    editSecondarySection,
    searchSecondarySections
} = require('../../database/masters/secondarySections');

ipcMain.on('load-secondary-sections', (event) => {
    loadSecondarySections((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-secondary-sections', rows);
        }
    });
});

ipcMain.on('get-secondary-section-detail', (event, id) => {
    getSecondarySectionById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('secondary-section-detail-data', row);
        }
    });
});

ipcMain.on('save-secondary-section', (event, sectionData) => {
    saveSecondarySection(sectionData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadSecondarySections((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-secondary-sections', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-secondary-section', (event, id) => {
    deleteSecondarySectionById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadSecondarySections((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-secondary-sections', rows);
                }
            });
        }
    });
});

ipcMain.on('edit-secondary-section', (event, id) => {
    editSecondarySection(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-secondary-section', row);
        }
    });
});

ipcMain.on('search-secondary-sections', (event, query) => {
    searchSecondarySections(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-secondary-sections-result', query);
        }
    });
});