const { ipcMain } = require('electron');
const { loadSetProducts, saveSetProduct, getSetProductById, deleteSetProductById, searchSetProducts } = require('../../database/masters/setProducts');

ipcMain.on('load-set-products', (event) => {
    loadSetProducts((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-set-products', rows);
        }
    });
});

ipcMain.on('edit-set-product', (event, id) => {
  getSetProductById(id, (err, row) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('edit-set-product', row);
      }
  });
});


ipcMain.on('save-set-product', (event, productData) => {
  saveSetProduct(productData, (err) => {
      if (err) {
          console.error(err.message);
      } else {
          loadSetProducts((loadErr, rows) => {
              if (loadErr) {
                  console.error(loadErr.message);
              } else {
                  event.sender.send('load-set-products', rows);
              }
          });
      }
  });
});

ipcMain.on('delete-set-product', (event, id) => {
  deleteSetProductById(id, (err) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('product-set-deleted', id);
      }
  });
});

ipcMain.on('get-set-product-detail', (event, id) => {
  getSetProductById(id, (err, row) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('set-product-detail-data', row);
      }
  });
});

ipcMain.on('search-set-products', (event, query) => {
    searchSetProducts(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-set-products-result', query);
        }
    });
});