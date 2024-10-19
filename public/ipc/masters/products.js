const { ipcMain } = require('electron');
const { loadProducts, getProductById, saveProduct, deleteProductById, searchProducts, searchIdProducts, searchNameProducts } = require('../../database/masters/products');

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

ipcMain.on('search-products', (event, query) => {
    searchProducts(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-products-result', query);
        }
    });
});

ipcMain.on('search-id-products', (event, query) => {
    searchIdProducts(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-id-products-result', query);
        }
    });
});

ipcMain.on('search-name-products', (event, query) => {
    searchNameProducts(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-name-products-result', query);
        }
    });
});
