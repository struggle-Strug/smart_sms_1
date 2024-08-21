const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_primary VARCHAR(255) NOT NULL,
            name_secondary VARCHAR(255) DEFAULT NULL,
            name_kana VARCHAR(255) DEFAULT NULL,
            phone_number INTEGER NOT NULL,
            fax_number INTEGER DEFAULT NULL,
            zip_code INTEGER DEFAULT NULL,
            address VARCHAR(255) NOT NULL,
            contact_person VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            terms_of_trade VARCHAR(255) DEFAULT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            created DATE DEFAULT (datetime('now')),
            updated DATE DEFAULT (datetime('now'))
        )
    `);
}

function loadVendors(callback) {
    db.all('SELECT * FROM vendors', [], callback);
}

function getVendorById(id, callback) {
    db.get('SELECT * FROM vendors WHERE id = ?', [id], callback);
}

function saveVendor(vendorData, callback) {
    const {
        id, name_primary, name_secondary, name_kana, phone_number, fax_number,
        zip_code, address, contact_person, email, terms_of_trade, remarks
    } = vendorData;

    if (id) {
        db.run(
            `UPDATE vendors SET name_primary = ?, name_secondary = ?, name_kana = ?, phone_number = ?, fax_number = ?, zip_code = ?, address = ?, contact_person = ?, email = ?, terms_of_trade = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name_primary, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO vendors (name_primary, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name_primary, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks],
            callback
        );
    }
}

function deleteVendorById(id, callback) {
    db.run('DELETE FROM vendors WHERE id = ?', [id], callback);
}

module.exports = {
    initializeDatabase,
    loadVendors,
    getVendorById,
    saveVendor,
    deleteVendorById
};
