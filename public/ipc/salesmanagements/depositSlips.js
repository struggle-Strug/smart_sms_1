const { ipcMain } = require('electron');
const { 
    loadDepositSlips, 
    getDepositSlipById, 
    saveDepositSlip, 
    deleteDepositSlipById, 
    editDepositSlip,
    searchDepositSlips,
    searchDepositSlipsOnPV
} = require('../../database/salesmanagements/depositSlips');

// 売上伝票のデータをロード
ipcMain.on('load-deposit-slips', (event, page) => {
    loadDepositSlips(page, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-deposit-slips', rows);
        }
    });
});

// 売上伝票の詳細を取得
ipcMain.on('get-deposit-slip-detail', (event, id) => {
    getDepositSlipById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-detail-data', row);
        }
    });
});

// 売上伝票を保存
ipcMain.on('save-deposit-slip', (event, depositSlips) => {
    saveDepositSlip(depositSlips, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('save-deposit-slip-result', { id: result.lastID });
        }
    });
});

// 売上伝票を削除
ipcMain.on('delete-deposit-slip', (event, id) => {
    deleteDepositSlipById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('deposit-slip-deleted', id);
        }
    });
});

// 売上伝票を編集
ipcMain.on('edit-deposit-slip', (event, id) => {
    editDepositSlip(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-deposit-slip', row);
        }
    });
});

// 売上伝票の検索（オプション）
ipcMain.on('search-deposit-slips', (event, query) => {
    searchDepositSlips(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-deposit-slips-result', results);
        }
    });

});
ipcMain.on('search-deposit-slips-on-pv', (event, query) => {
    searchDepositSlipsOnPV(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-deposit-slips-on-pv-result', results);
        }
    });
});
