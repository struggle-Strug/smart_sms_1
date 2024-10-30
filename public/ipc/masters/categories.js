const { ipcMain } = require('electron');
const { loadCategories, getCategoryById, saveCategory, deleteCategoryById, editCategory, searchCategories } = require('../../database/masters/categories');

// Load Categories
ipcMain.on('load-categories', (event) => {
    loadCategories((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-categories', rows);
        }
    });
});

// Get details of a specific Category
ipcMain.on('get-category-detail', (event, id) => {
    getCategoryById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('category-detail-data', row);
        }
    });
});

// Save a Category (new or update)
ipcMain.on('save-category', (event, categoryData) => {
    saveCategory(categoryData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadCategories((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-categories', rows);
                }
            });
        }
    });
});

// Delete a Category
ipcMain.on('delete-category', (event, id) => {
    deleteCategoryById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('category-deleted', id);
        }
    });
});

// Edit a Category
ipcMain.on('edit-category', (event, id) => {
    editCategory(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-category', row);
        }
    });
});

// Search Categories
ipcMain.on('search-categories', (event, query) => {
    searchCategories(query, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-categories-result', rows);
        }
    });
});
