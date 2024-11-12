const { ipcMain } = require('electron');
const { 
    loadInventories, 
    deleteInventoryById, 
    saveInventory, 
    searchInventories, 
    editInventory, 
} = require('../../database/procurements/inventories');

ipcMain.on('load-inventories', (event) => {
  loadInventories((err, rows) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('load-inventories', rows);
      }
  });
});

ipcMain.on('delete-inventory', (event, id) => {
  deleteInventoryById(id, (err) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('inventory-deleted', id);
      }
  });
});

ipcMain.on('edit-inventory', (event, id) => {
  editInventory(id, (err, row) => {
      if (err) {
          console.error(err.message);
      } else {
          event.sender.send('edit-inventory', row);
      }
  });
});

ipcMain.on('search-inventories', (event, query) => {
    searchInventories(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-inventories-result', results);
        }
    });

});

ipcMain.on('save-inventory', (event, inventory) => {
  saveInventory(inventory, (err, result) => {
      if (err) {
          console.error(err.message);
      } else {
          // 挿入したレコードのIDを返す
          event.sender.send('save-inventory-result', { id: result.lastID });
      }
  });
});