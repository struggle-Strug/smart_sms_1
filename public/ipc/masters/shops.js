const { ipcMain } = require('electron');
const {
    loadShops,
    getShopById,
    saveShop,
    deleteShopById,
    editShop,
    searchShops
} = require('../../database/masters/shops');

ipcMain.on('load-shops', (event) => {
    loadShops((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-shops', rows);
        }
    });
});

ipcMain.on('get-shop-detail', (event, id) => {
    getShopById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('shop-detail-data', row);
        }
    });
});

ipcMain.on('save-shop', (event, shopData) => {
    saveShop(shopData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadShops((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-shops', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-shop', (event, id) => {
    deleteShopById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('shop-deleted', id);
        }
    });
});

ipcMain.on('edit-shop', (event, id) => {
    editShop(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-shop', row);
        }
    });
});

ipcMain.on('search-shops', (event, query) => {
    searchShops(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-shops-result', query);
        }
    });
});
