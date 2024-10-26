const { ipcMain } = require('electron');
const { 
    loadPosPvsMappings, 
    getPosPvsMappingById, 
    savePosPvsMapping, 
    deletePosPvsMappingById, 
    editPosPvsMapping, 
    searchPosPvsMappings,
    searchPosPvsMappingsByPvsId,
    deletePosPvsMappingsByPvsId,
    searchPosPvsMappingsByPos
} = require('../../database/procurements/posPvsMappings');

// pos_pvs_mappingsのデータを全てロード
ipcMain.on('load-pos-pvs-mappings', (event) => {
    loadPosPvsMappings((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-pos-pvs-mappings', rows);
        }
    });
});

// pos_pvs_mappingの詳細を取得
ipcMain.on('get-pos-pvs-mapping-detail', (event, id) => {
    getPosPvsMappingById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('pos-pvs-mapping-detail-data', row);
        }
    });
});

// pos_pvs_mappingを保存
ipcMain.on('save-pos-pvs-mapping', (event, mappingData) => {
    savePosPvsMapping(mappingData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPosPvsMappings((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-pos-pvs-mappings', rows);
                }
            });
        }
    });
});

// pos_pvs_mappingを削除
ipcMain.on('delete-pos-pvs-mapping', (event, id) => {
    deletePosPvsMappingById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('pos-pvs-mapping-deleted', id);
        }
    });
});

// pos_pvs_mappingを編集
ipcMain.on('edit-pos-pvs-mapping', (event, id) => {
    editPosPvsMapping(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-pos-pvs-mapping', row);
        }
    });
});

// pos_pvs_mappingsテーブルの検索機能
ipcMain.on('search-pos-pvs-mappings', (event, query) => {
    searchPosPvsMappings(query, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-pos-pvs-mappings-result', rows);
        }
    });
});

ipcMain.on('search-pos-pvs-mappings-by-pvs-id', (event, query) => {
    searchPosPvsMappingsByPvsId(query, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-pos-pvs-mappings-by-pvs-id-result', rows);
        }
    });
});

ipcMain.on('delete-pos-pvs-mappings-by-pvs-id', (event, paymentVoucherId) => {
    deletePosPvsMappingsByPvsId(paymentVoucherId, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('delete-pos-pvs-mappings-by-pvs-id-result', paymentVoucherId);
        }
    });
});

ipcMain.on('search-payment-voucher-details-by-purchase-order-id', (event, query) => {
    searchPosPvsMappingsByPos(query, (err, results) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-payment-voucher-details-by-purchase-order-id-result', results);
        }
    });
});