const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS shops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255),
                code VARCHAR(255) DEFAULT NULL,
                address VARCHAR(255),
                phone_number VARCHAR(255),
                fax_number VARCHAR(255),
                contact_person VARCHAR(255),
                email VARCHAR(255),
                remarks VARCHAR(255),
                created DATE DEFAULT (datetime('now')),
                updated DATE DEFAULT (datetime('now'))
            )
        `);
    });
}

function loadShops(callback) {
    db.all('SELECT * FROM shops', [], (err, rows) => {
        callback(err, rows);
    });
}

function getShopById(id, callback) {
    db.get('SELECT * FROM shops WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveShop(data, callback) {
    const { id, name, code, address, phone_number, fax_number, contact_person, email, remarks } = data;
    if (id) {
        db.run(
            `UPDATE shops SET name = ?, code = ?, address = ?, phone_number = ?, fax_number = ?, contact_person = ?, email = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, address, phone_number, fax_number, contact_person, email, remarks, id],
            (err) => {
                callback(err);
            }
        );
    } else {
        db.run(
            `INSERT INTO shops (name, code, address, phone_number, fax_number, contact_person, email, remarks, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name, code, address, phone_number, fax_number, contact_person, email, remarks],
            (err) => {
                callback(err);
            }
        );
    }
}

function deleteShopById(id, callback) {
    db.run(`DELETE FROM shops WHERE id = ?`, [id], (err) => {
        callback(err);
    });
}

function editShop(id, callback) {
    const sql = `SELECT * FROM shops WHERE id = ?`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
}

function searchShops(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM shops 
        WHERE name LIKE ? 
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM shops`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadShops,
    getShopById,
    saveShop,
    deleteShopById,
    editShop,
    searchShops
};
