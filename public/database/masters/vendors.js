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
            code VARCHAR(255) DEFAULT NULL,
            name_kana VARCHAR(255) DEFAULT NULL,
            phone_number INTEGER NOT NULL,
            fax_number INTEGER DEFAULT NULL,
            zip_code INTEGER DEFAULT NULL,
            address VARCHAR(255) NOT NULL,
            contact_person VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            terms_of_trade VARCHAR(255) DEFAULT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            classification1 VARCHAR(255) DEFAULT NULL,
            classification2 VARCHAR(255) DEFAULT NULL,
            tax_calculation VARCHAR(255) DEFAULT NULL,
            closing_date DATE DEFAULT NULL,
            payment_date DATE DEFAULT NULL,
            payment_method VARCHAR(255) DEFAULT NULL,
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
        id, name_primary, code, name_secondary, name_kana, phone_number, fax_number,
        zip_code, address, contact_person, email, terms_of_trade, remarks,
        classification1, classification2, tax_calculation, closing_date,
        payment_date, payment_method
    } = vendorData;

    console.log("Processing saveVendor with data:", vendorData);

    db.get(`SELECT id FROM vendors WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (row) {
            // If the record exists, perform an UPDATE
            console.log("Updating existing vendor:", vendorData);
            db.run(
                `UPDATE vendors SET name_primary = ?, code = ?, name_secondary = ?, name_kana = ?, phone_number = ?, fax_number = ?, zip_code = ?, address = ?, contact_person = ?, email = ?, terms_of_trade = ?, remarks = ?, classification1 = ?, classification2 = ?, tax_calculation = ?, closing_date = ?, payment_date = ?, payment_method = ?, updated = datetime('now') WHERE id = ?`,
                [name_primary, code, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks, classification1, classification2, tax_calculation, closing_date, payment_date, payment_method, id],
                callback
            );
        } else {
            // If the record does not exist, perform an INSERT
            console.log("Inserting new vendor:", vendorData);
            db.run(
                `INSERT INTO vendors (name_primary, code, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks, classification1, classification2, tax_calculation, closing_date, payment_date, payment_method, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                [name_primary, code, name_secondary, name_kana, phone_number, fax_number, zip_code, address, contact_person, email, terms_of_trade, remarks, classification1, classification2, tax_calculation, closing_date, payment_date, payment_method],
                callback
            );
        }
    });
}


function deleteVendorById(id, callback) {
    db.run('DELETE FROM vendors WHERE id = ?', [id], callback);
}

function searchVendors(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM vendors 
        WHERE name_primary LIKE ? 
        OR name_secondary LIKE ? 
        OR name_kana LIKE ? 
        OR id LIKE ? 
        OR classification1 LIKE ? 
        OR classification2 LIKE ?
        `;
        params = [
            `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM vendors`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchIdVendors(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM vendors 
        WHERE id LIKE ? 
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM vendors`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchNameVendors(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM vendors 
        WHERE name_primary LIKE ? 
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM vendors`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    initializeDatabase,
    loadVendors,
    getVendorById,
    saveVendor,
    deleteVendorById,
    searchVendors,
    searchIdVendors,
    searchNameVendors
};
