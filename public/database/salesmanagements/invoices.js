const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    console.log("initializeDatabase");
    db.run(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            billing_date VARCHAR(255) DEFAULT NULL,
            customer_id INTEGER DEFAULT NULL,
            created DATE DEFAULT CURRENT_DATE,
            updated DATE DEFAULT CURRENT_DATE
        )
    `);
}

function loadInvoices(callback) {
    db.all('SELECT iv.*, c.*, iv.id AS invoice_id FROM invoices iv LEFT JOIN customers c ON iv.customer_id = c.id', [], (err, rows) => {
        callback(err, rows);
    });
}

function getInvoiceById(id, callback) {
    db.get('SELECT * FROM invoices WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveInvoice(invoiceData, callback) {
    const { id, billing_date, customer_id } = invoiceData;

    if (id) {
        db.run(
            `UPDATE invoices SET billing_date = ?, customer_id = ?, updated = datetime('now') WHERE id = ?`,
            [billing_date, customer_id, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO invoices (billing_date, customer_id, created, updated) VALUES (?, ?, datetime('now'), datetime('now'))`,
            [billing_date, customer_id],
            callback
        );
    }
}

function deleteInvoiceById(id, callback) {
    db.run('DELETE FROM invoices WHERE id = ?', [id], callback);
}

function editInvoice(id, callback) {
    getInvoiceById(id, callback);
}

function searchInvoices(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT iv.*, c.*, iv.id AS invoice_id FROM invoices iv LEFT JOIN customers c ON iv.customer_id = c.id
        WHERE c.name_primary LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT iv.*, c.*, iv.id AS invoice_id FROM invoices iv LEFT JOIN customers c ON iv.customer_id = c.id`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = { loadInvoices, getInvoiceById, saveInvoice, deleteInvoiceById, editInvoice, initializeDatabase, searchInvoices };
