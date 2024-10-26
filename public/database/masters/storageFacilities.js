const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS storage_facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(255) DEFAULT NULL,
            address VARCHAR(255) NOT NULL,
            phone_number INTEGER DEFAULT NULL,
            fax_number INTEGER DEFAULT NULL,
            contact_person VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            storage_method VARCHAR(255) DEFAULT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            created DATE NOT NULL DEFAULT (datetime('now')),
            updated DATE NOT NULL DEFAULT (datetime('now'))
        )
    `);
}

function loadStorageFacilities(callback) {
    db.all('SELECT * FROM storage_facilities', [], callback);
}

function getStorageFacilityById(id, callback) {
    db.get('SELECT * FROM storage_facilities WHERE id = ?', [id], callback);
}

function saveStorageFacility(facilityData, callback) {
    const { id, name, code, address, phone_number, fax_number, contact_person, email, storage_method, remarks } = facilityData;

    if (id) {
        db.run(
            `UPDATE storage_facilities SET name = ?, code = ?, address = ?, phone_number = ?, fax_number = ?, contact_person = ?, email = ?, storage_method = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, address, phone_number, fax_number, contact_person, email, storage_method, remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO storage_facilities (name, code, address, phone_number, fax_number, contact_person, email, storage_method, remarks, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name, code, address, phone_number, fax_number, contact_person, email, storage_method, remarks],
            callback
        );
    }
}

function deleteStorageFacilityById(id, callback) {
    db.run('DELETE FROM storage_facilities WHERE id = ?', [id], callback);
}

function searchStorageFacilities(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM storage_facilities 
        WHERE name LIKE ? 
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM storage_facilities`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadStorageFacilities,
    getStorageFacilityById,
    saveStorageFacility,
    deleteStorageFacilityById,
    searchStorageFacilities
};
