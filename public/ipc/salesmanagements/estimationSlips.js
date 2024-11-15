const { ipcMain } = require('electron');
const { 
    loadEstimationSlips, 
    getEstimationSlipById, 
    saveEstimationSlip, 
    deleteEstimationSlipById, 
    editEstimationSlip,
    searchEstimationSlips,
    searchEstimationSlipsOnPV
} = require('../../database/salesmanagements/estimationSlips');

// 見積書のデータをロード
ipcMain.on('load-estimation-slips', (event, page) => {
  console.log(page);
    loadEstimationSlips(page, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-estimation-slips', rows);
        }
    });
});

// 見積書の詳細を取得
ipcMain.on('get-estimation-slip-detail', (event, id) => {
    getEstimationSlipById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('estimation-slip-detail-data', row);
        }
    });
});

// 見積書を保存
ipcMain.on('save-estimation-slip', (event, EstimationSlip) => {
    saveEstimationSlip(EstimationSlip, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            // 挿入したレコードのIDを返す
            event.sender.send('save-estimation-slip-result', { id: result.lastID });
        }
    });
});

// 見積書を削除
ipcMain.on('delete-estimation-slip', (event, id) => {
    deleteEstimationSlipById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('estimation-slip-deleted', id);
        }
    });
});

// 見積書を編集
ipcMain.on('edit-estimation-slip', (event, id) => {
    editEstimationSlip(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-estimation-slip', row);
        }
    });
});

// 見積書の検索（オプション）
ipcMain.on('search-estimation-slips', (event, query) => {
    searchEstimationSlips(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-estimation-slips-result', results);
        }
    });

});
ipcMain.on('search-estimation-slips-on-pv', (event, query) => {
    searchEstimationSlipsOnPV(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-estimation-slips-on-pv-result', results);
        }
    });
});
