const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS shipping_methods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255),
                code VARCHAR(255) DEFAULT NULL,
                remarks VARCHAR(255),
                created DATE DEFAULT (datetime('now')),
                updated DATE DEFAULT (datetime('now'))
            )
        `);
    });
}

function loadShippingMethods(callback) {
    db.all('SELECT * FROM shipping_methods', [], (err, rows) => {
        callback(err, rows);
    });
}

function getShippingMethodById(id, callback) {
    db.get('SELECT * FROM shipping_methods WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveShippingMethod(data, callback) {
    const { id, name, code, remarks } = data;
    if (id) {
        db.run(
            `UPDATE shipping_methods SET name = ?, code = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, remarks, id],
            (err) => {
                callback(err);
            }
        );
    } else {
        db.run(
            `INSERT INTO shipping_methods (name, code, remarks, created, updated) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
            [name, code, remarks],
            (err) => {
                callback(err);
            }
        );
    }
}

function deleteShippingMethodById(id, callback) {
    db.run(`DELETE FROM shipping_methods WHERE id = ?`, [id], (err) => {
        callback(err);
    });
}

function editShippingMethod(id, callback) {
    const sql = `SELECT * FROM shipping_methods WHERE id = ?`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
}

function searchShippingMethods(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM shipping_methods 
        WHERE name LIKE ? 
        `;
        params = [`%${query}%`];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM shipping_methods`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadShippingMethods,
    getShippingMethodById,
    saveShippingMethod,
    deleteShippingMethodById,
    editShippingMethod,
    searchShippingMethods
};
