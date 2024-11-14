const { ipcMain} = require('electron');
const { loadAdminSettings, saveAdminSetting, getAdminSettingById, checkLogin } = require('../../database/dashboard/adminSettings');

ipcMain.on('load-admin-settings', (event) => {
  loadAdminSettings((err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("送信するデータ",rows);
      event.sender.send('admin-settings-data', rows);
    }
  });
});

ipcMain.on('edit-admin-setting', (event, id) => {
  console.log("フロントから受け取った値:", id); // ここでフロントから受け取った id を出力
  getAdminSettingById(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("フロントに渡す値:", row); // フロントに渡す値も出力
      event.sender.send('edit-admin-setting', row);
    }
  });
});

ipcMain.on('save-admin-setting', (event,adminSettingData) => {
  console.log("受け取ったデータ",adminSettingData);
  saveAdminSetting(adminSettingData, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      loadAdminSettings((loadErr, rows) => {
        if (loadErr) {
          console.error(loadErr, message); 
        } else {
          event.sender.send('load-admin-settings', rows);
        }
      });
    }
  });
});

ipcMain.on('login-request', (event, loginData) => {
  console.log("受け取ったデータ",loginData);
  checkLogin(loginData, (err, result) => {
    if (err) {
      // エラーが発生した場合、エラーメッセージを送信
      console.error('ログインエラー:', err.message);
      event.reply('login-response', { success: false, message: err.message });
    } else {
      // 成功した場合、ユーザーIDを送信
      event.reply('login-response', { success: true, user_id: result.user_id });
    }
  });
});