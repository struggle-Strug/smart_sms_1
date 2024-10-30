const { ipcMain } = require('electron');
const { 
    loadSalesSlipDetails, 
    getSalesSlipDetailById, 
    saveSalesSlipDetail, 
    deleteSalesSlipDetailById, 
    editSalesSlipDetail, 
    searchSalesSlipDetails,
    searchSalesSlipsBySalesSlipId,
    deleteSalesSlipDetailsBySlipId,
    getMonthlySalesWithJoin
} = require('../../database/salesmanagements/salesSlipDetails');

// 売上伝票明細のデータをロード
ipcMain.on('load-sales-slip-details', (event) => {
    loadSalesSlipDetails((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-sales-slip-details', rows);
        }
    });
});

// 売上伝票明細の詳細を取得
ipcMain.on('get-sales-slip-detail-data', (event, query) => {
    getSalesSlipDetailById(query, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-slip-detail-data-result', row);
        }
    });
});

ipcMain.on('get-monthly-sales-slip-detail-data', (event, id) => {
    getMonthlySalesWithJoin(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('monthly-sales-slip-detail-data-result', row);
        }
    });
});

// 売上伝票明細を保存
ipcMain.on('save-sales-slip-detail', (event, detailData) => {
    saveSalesSlipDetail(detailData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadSalesSlipDetails((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-sales-slip-details', rows);
                }
            });
        }
    });
});

// 売上伝票明細を削除
ipcMain.on('delete-sales-slip-detail', (event, id) => {
    deleteSalesSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-slip-detail-deleted', id);
        }
    });
});

// 売上伝票明細を削除 (編集画面用)
ipcMain.on('sales-slip-details-deleted-by-slip-id', (event, id) => {
    deleteSalesSlipDetailById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-slip-detail-deleted', id);
        }
    });
});

// 売上伝票明細を編集
ipcMain.on('edit-sales-slip-detail', (event, id) => {
    editSalesSlipDetail(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-sales-slip-detail', row);
        }
    });
});

// 売上伝票明細の検索
ipcMain.on('search-sales-slip-details', (event, query) => {
    searchSalesSlipDetails(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-sales-slip-details-result', results);
        }
    });
});

ipcMain.on('search-sales-slip-details-by-vender-id', (event, query) => {
    searchSalesSlipsBySalesSlipId(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-sales-slip-details-by-vender-id-result', results);
        }
    });
});

ipcMain.on('delete-sales-slip-details-by-slip-id', (event, salesSlipId) => {
    deleteSalesSlipDetailsBySlipId(salesSlipId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('sales-slip-details-deleted-by-slip-id', salesSlipId);
        }
    });
});
