const { ipcMain } = require('electron');
const { loadStatementSettings, getStatementSettingById, saveStatementSetting, deleteStatementSettingById, editStatementSetting } = require('../../database/procurements/statementSettings');

// statement_settings の全データを読み込む
ipcMain.on('load-statement-settings', (event) => {
    loadStatementSettings((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-statement-settings', rows);
        }
    });
});

// statement_settings の詳細を取得
ipcMain.on('get-statement-setting-detail', (event, id) => {
    getStatementSettingById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('statement-setting-detail-data', row);
        }
    });
});

// statement_settings を保存
ipcMain.on('save-statement-setting', (event, settingData) => {
    saveStatementSetting(settingData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadStatementSettings((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-statement-settings', rows);
                }
            });
        }
    });
});

// statement_settings を削除
ipcMain.on('delete-statement-setting', (event, id) => {
    deleteStatementSettingById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('statement-setting-deleted', id);
        }
    });
});

// statement_settings を編集
ipcMain.on('edit-statement-setting', (event, id) => {
    editStatementSetting(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-statement-setting', row);
        }
    });
});
