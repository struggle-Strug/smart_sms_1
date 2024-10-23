const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) DEFAULT NULL,
    remarks VARCHAR(255),
    created DATE DEFAULT (datetime('now','localtime')),
    updated DATE DEFAULT (datetime('now','localtime'))
);
    `);
}

function loadPaymentMethods(callback) {
    db.all('SELECT * FROM payment_methods', [], (err, rows) => {
        callback(err, rows);
    });
}

function getPaymentMethodById(id, callback) {
    db.get('SELECT * FROM payment_methods WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function savePaymentMethod(paymentMethod, callback) {
    const { id, name, code, remarks } = paymentMethod;
    if (id) {
        db.run('UPDATE payment_methods SET name = ?, code = ?, remarks = ?, updated = datetime("now", "localtime") WHERE id = ?', [name, code, remarks, id], callback);
    } else {
        db.run('INSERT INTO payment_methods (name, code, remarks, created, updated) VALUES (?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime"))', [name, code, remarks], callback);
    }
}

function deletePaymentMethodById(id, callback) {
    db.run('DELETE FROM payment_methods WHERE id = ?', [id], callback);
}

function searchPaymentMethods(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM payment_methods 
        WHERE name LIKE ? 
        `;
        params = [`%${query}%`];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM payment_methods`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadPaymentMethods,
    getPaymentMethodById,
    savePaymentMethod,
    deletePaymentMethodById,
    searchPaymentMethods
};
