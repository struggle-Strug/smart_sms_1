const { ipcMain} = require('electron');
const { loadPosCoordinationSettings, getPosCoordinationSettingById, savePosCoodinationSetting, deletePosCoodinationSettingById } = require('../../database/dashboard/posCoordinationSettings');

ipcMain.on('load-pos-coodination-settings', (event) => {
  loadPosCoordinationSettings((err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("送信するデータ:", rows);
      event.sender.send('pos-coodination-settings-data', rows);
    }
  });
});

ipcMain.on('save-pos-coodination-setting', (event, posCoodinationSettingData) => {
  console.log("受け取ったデータ", posCoodinationSettingData);
  savePosCoodinationSetting(posCoodinationSettingData, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      loadPosCoordinationSettings((loadErr, rows) => {
        if (loadErr) {
          console.error(loadErr.message);
        } else {
          event.sender.send('load-pos-coodination-settings', rows);
        }
      });
    }
  });
});

ipcMain.on('get-pos-coodination-setting-detail', (event, id) => {
  getPosCoordinationSettingById(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('set-pos-coodination-setting-detail-data', row);
    }
  });
});