const { ipcMain } = require('electron');
const { loadSalesTaxSettings, saveSalesTaxSetting, getSalesTaxSettingById, deleteSalesTaxSettingById } = require('../../database/dashboard/salesTaxSettings');

ipcMain.on('load-sales-tax-settings', (event) => {
    loadSalesTaxSettings((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-tax-settings-data', rows);
        }
    });
});


ipcMain.on('edit-sales-tax-setting', (event, id) => {
    getSalesTaxSettingById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-sales-tax-setting', row);
        }
    });
  });

ipcMain.on('save-sales-tax-setting', (event, salesTaxSettingData) => {
  saveSalesTaxSetting(salesTaxSettingData, (err) => {
      if (err) {
          console.error(err.message);
      } else {
          loadSalesTaxSettings((loadErr, rows) => {
              if (loadErr) {
                  console.error(loadErr.message);
              } else {
                  event.sender.send('load-sales-tax-settings', rows);
              }
          });
      }
  });
});

ipcMain.on('delete-sales-tax-setting', (event, id) => {
    deleteSalesTaxSettingById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-tax-setting-deleted', id);
        }
    });
  });

  ipcMain.on('get-sales-tax-setting-detail', (event, id) => {
    getSalesTaxSettingById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('set-sales-tax-setting-detail-data', row);
        }
    });
  });