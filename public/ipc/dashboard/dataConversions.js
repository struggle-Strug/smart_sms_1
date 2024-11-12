const { ipcMain} = require('electron');
const { loadDataConversions } = require('../../database/dashboard/dataConversions');

ipcMain.on('load-data-conversions', (event) => {
  loadDataConversions((err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("送信するデータ:", rows);
      event.sender.send('data-conversions-data', rows);
    }
  });
});