const { ipcMain } = require('electron');
const { loadContactPersons, getContactPersonById, saveContactPerson, deleteContactPersonById, editContactPerson, searchContactPersons } = require('../../database/masters/contactPersons');

ipcMain.on('load-contact-persons', (event) => {
    loadContactPersons((err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('load-contact-persons', rows);
        }
    });
});

ipcMain.on('get-contact-person-detail', (event, id) => {
    getContactPersonById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('contact-person-detail-data', row);
        }
    });
});

ipcMain.on('save-contact-person', (event, contactPersonData) => {
    saveContactPerson(contactPersonData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            loadContactPersons((loadErr, rows) => {
                if (loadErr) {
                    console.error(loadErr.message);
                } else {
                    event.sender.send('load-contact-persons', rows);
                }
            });
        }
    });
});

ipcMain.on('delete-contact-person', (event, id) => {
    deleteContactPersonById(id, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('contact-person-deleted', id);
        }
    });
});

ipcMain.on('edit-contact-person', (event, id) => {
    getContactPersonById(id, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('edit-contact-person', row);
        }
    });
});

ipcMain.on('search-contact-persons', (event, query) => {
    searchContactPersons(query, (err, query) => {
        if (err) {
            console.error(err.message);
        } else {
            event.sender.send('search-contact-persons-result', query);
        }
    });
});
