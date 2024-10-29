const { ipcMain } = require('electron');
const { loadSubcategories, getSubcategoryById, saveSubcategory, deleteSubcategoryById, editSubcategory, searchSubcategories } = require('../../database/masters/subcategories');

// Load Subcategories
ipcMain.on('load-subcategories', (event) => {
    loadSubcategories((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-subcategories', rows);
        }
    });
});

// Get details of a specific Subcategory
ipcMain.on('get-subcategory-detail', (event, id) => {
    getSubcategoryById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('subcategory-detail-data', row);
        }
    });
});

// Save a Subcategory (new or update)
ipcMain.on('save-subcategory', (event, subcategoryData) => {
    saveSubcategory(subcategoryData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadSubcategories((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-subcategories', rows);
                }
            });
        }
    });
});

// Delete a Subcategory
ipcMain.on('delete-subcategory', (event, id) => {
    deleteSubcategoryById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('subcategory-deleted', id);
        }
    });
});

// Edit a Subcategory
ipcMain.on('edit-subcategory', (event, id) => {
    editSubcategory(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-subcategory', row);
        }
    });
});

// Search Subcategories
ipcMain.on('search-subcategories', (event, query) => {
    searchSubcategories(query, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-subcategories-result', rows);
        }
    });
});
