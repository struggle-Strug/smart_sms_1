const { ipcMain } = require('electron');
const { loadBnakApiSettings, getBankApiSettingById, saveBankApiSetting, deleteBankApiSettingById} = require('../../database/dashboard/bankApiSettings');

ipcMain.on('load-band-api-settings', (event) => {
  loadBnakApiSettings((err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('bank-api-settings-data', rows);
    }
  });
});

ipcMain.on('edit-bank-api-setting', (event, id) => {
  getBankApiSettingById(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('edit-bank-api-setting', row);
    }
  });
});

ipcMain.on('save-bank-api-setting', (event, bankApiSettingData) => {
  console.log("受け取ったデータ", bankApiSettingData);
  saveBankApiSetting(bankApiSettingData, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      loadBnakApiSettings((loadErr, rows) => {
        if (loadErr) {
          console.error(loadErr.message);
        } else {
          event.sender.send('load-bank-api-settings', rows);
        }
      });
    }
  });
});

ipcMain.on('delete-bank-api-setting', (event, id) => {
  deleteBankApiSettingById(id, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('bank-api-setting-deleted', id);
    }
  });
});

ipcMain.on('get-bank-api-setting-detail', (event, id) => {
  getBankApiSettingById(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('set-bnak-api-setting-detail-data', row);
    }
  });
});
