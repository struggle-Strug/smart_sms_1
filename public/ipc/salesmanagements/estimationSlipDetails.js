const { ipcMain } = require('electron');
const { 
    loadestimationSlipDetails, 
    getEstimationSlipDetailById, 
    saveEstimationSlipDetail, 
    deleteEstimationSlipDetailById, 
    editEstimationSlipDetail,
    searchestimationSlipDetails,
    searchestimationSlipDetailsOnPV
} = require('../../database/salesmanagements/estimationSlipDetails');

// 見積書のデータをロード
ipcMain.on('load-estimation-slip-details', (event) => {
    loadestimationSlipDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-estimation-slip-details', rows);
        }
    });
});

// 見積書の詳細を取得
ipcMain.on('get-estimation-slip-detail-data', (event, id) => {
    getEstimationSlipDetailById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('estimation-slip-detail-data-result', row);
        }
    });
});

// 見積書を保存
ipcMain.on('save-estimation-slip-detail', (event, EstimationSlipDetail) => {
    saveEstimationSlipDetail(EstimationSlipDetail, (err, result) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('save-estimation-slip-detail-result', { id: result.lastID });
        }
    });
});

// 見積書を削除
ipcMain.on('delete-estimation-slip-detail', (event, id) => {
    deleteEstimationSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('estimation-slip-detail-deleted', id);
        }
    });
});

// 見積書を編集
ipcMain.on('edit-estimation-slip-detail', (event, id) => {
    editEstimationSlipDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-estimation-slip-detail', row);
        }
    });
});

// 見積書の検索（オプション）
ipcMain.on('search-estimation-slip-details', (event, query) => {
    searchestimationSlipDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-estimation-slip-details-result', results);
        }
    });

});
ipcMain.on('search-estimation-slip-detail-on-pv', (event, query) => {
    searchestimationSlipDetailsOnPV(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-estimation-slip-detail-on-pv-result', results);
        }
    });
});
