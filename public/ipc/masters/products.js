const { ipcMain } = require('electron');
const { loadProducts, getProductById, saveProduct, deleteProductById } = require('../../database/masters/products');

ipcMain.on('load-products', (event) => {
    loadProducts((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-products', rows);
        }
    });
});

ipcMain.on('edit-product', (event, id) => {
    getProductById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-product', row);
        }
    });
});

ipcMain.on('save-product', (event, productData) => {
    saveProduct(productData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadProducts((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-products', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-product', (event, id) => {
    deleteProductById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('product-deleted', id);
        }
    });
});

ipcMain.on('get-product-detail', (event, id) => {
    getProductById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('product-detail-data', row);
        }
    });
});
