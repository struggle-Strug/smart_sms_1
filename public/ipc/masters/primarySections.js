const { ipcMain } = require('electron');
const { loadPrimarySections, getPrimarySectionById, savePrimarySection, deletePrimarySectionById, editPrimarySection, searchPrimarySections } = require('../../database/masters/primarySections');

// Primary Sectionsをロードする
ipcMain.on('load-primary-sections', (event) => {
    loadPrimarySections((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-primary-sections', rows);
        }
    });
});

// 特定のPrimary Sectionの詳細を取得する
ipcMain.on('get-primary-section-detail', (event, id) => {
    getPrimarySectionById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('primary-section-detail-data', row);
        }
    });
});

// Primary Sectionを保存する（新規および更新）
ipcMain.on('save-primary-section', (event, primarySectionData) => {
    savePrimarySection(primarySectionData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadPrimarySections((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-primary-sections', rows);
                }
            });
        }
    });
});

// Primary Sectionを削除する
ipcMain.on('delete-primary-section', (event, id) => {
    deletePrimarySectionById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('primary-section-deleted', id);
        }
    });
});

// Primary Sectionを編集する
ipcMain.on('edit-primary-section', (event, id) => {
    editPrimarySection(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-primary-section', row);
        }
    });
});

ipcMain.on('search-primary-sections', (event, query) => {
    searchPrimarySections(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-primary-sections-result', query);
        }
    });
});
