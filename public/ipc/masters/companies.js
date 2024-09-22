const { ipcMain } = require('electron');
const { loadCompanies, getCompanyById, saveCompany, deleteCompanyById, editCompany, searchCompanies } = require('../../database/masters/companies');

ipcMain.on('load-companies', (event) => {
    loadCompanies((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-companies', rows);
        }
    });
});

// 会社の詳細を取得
ipcMain.on('get-company-detail', (event, id) => {
    getCompanyById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('company-detail-data', row);
        }
    });
});

// 会社を保存
ipcMain.on('save-company', (event, companyData) => {
    saveCompany(companyData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadCompanies((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-companies', rows);
                }
            });
        }
    });
});


// 会社を削除
ipcMain.on('delete-company', (event, id) => {
    deleteCompanyById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('company-deleted', id);
        }
    });
});

// 会社を編集
ipcMain.on('edit-company', (event, id) => {
    editCompany(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-company', row);
        }
    });
});

ipcMain.on('search-companies', (event, query) => {
    searchCompanies(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(query);
            event.sender.send('search-companies-result', query);
        }
    });
});
