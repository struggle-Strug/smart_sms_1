const { ipcMain } = require('electron');
const {
  loadSalesSlips,
  getSalesSlipById,
  saveSalesSlip,
  deleteSalesSlipById,
  editSalesSlip,
  searchSalesSlips,
  searchSalesSlipsOnPV
} = require('../../database/salesmanagements/salesSlips');

// 売上伝票のデータをロード
ipcMain.on('load-sales-slips', (event, page) => {
  loadSalesSlips(page, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('load-sales-slips', rows);
    }
  });
});

// 売上伝票の詳細を取得
ipcMain.on('get-sales-slip-detail', (event, id) => {
  getSalesSlipById(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('sales-slip-detail-data', row);
    }
  });
});

// 売上伝票を保存
ipcMain.on('save-sales-slip', (event, salesSlips) => {
  saveSalesSlip(salesSlips, (err, result) => {
    if (err) {
      console.error(err.message);
    } else {
      // 挿入したレコードのIDを返す
      event.sender.send('save-sales-slip-result', { id: result.lastID });
    }
  });
});

// 売上伝票を削除
ipcMain.on('delete-sales-slip', (event, id) => {
  deleteSalesSlipById(id, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('sales-slip-deleted', id);
    }
  });
});

// 売上伝票を編集
ipcMain.on('edit-sales-slip', (event, id) => {
  editSalesSlip(id, (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('edit-sales-slip', row);
    }
  });
});

// 売上伝票の検索（オプション）
ipcMain.on('search-sales-slips', (event, query) => {
  searchSalesSlips(query, (err, results) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('search-sales-slips-result', results);
    }
  });

});
ipcMain.on('search-sales-slips-on-pv', (event, query) => {
  searchSalesSlipsOnPV(query, (err, results) => {
    if (err) {
      console.error(err.message);
    } else {
      event.sender.send('search-sales-slips-on-pv-result', results);
    }
  });
});
