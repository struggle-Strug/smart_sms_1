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
            total_price INTEGER DEFAULT NULL,
            status INTEGER DEFAULT NULL,
            invoice_number VARCHAR(255) DEFAULT NULL,
            created DATE DEFAULT CURRENT_DATE,
            updated DATE DEFAULT CURRENT_DATE
        )
    `);
}

function loadInvoices(callback) {
    db.all(
        `
        SELECT iv.*, c.*, iv.id AS invoice_id, iv.created AS invoice_created
        FROM invoices iv 
        LEFT JOIN customers c ON iv.customer_id = c.id
        `,
        [],
        (err, rows) => {
            callback(err, rows);
        }
    );
}

function getInvoiceById(id, callback) {
    db.get('SELECT * FROM invoices WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveInvoice(invoiceData, callback) {
    const { id, billing_date, customer_id, total_price, status, invoice_number } = invoiceData;

    if (id) {
        db.run(
            `
            UPDATE invoices 
            SET 
                billing_date = ?, 
                customer_id = ?, 
                total_price = ?, 
                status = ?, 
                invoice_number = ?, 
                updated = datetime('now') 
            WHERE id = ?
            `,
            [billing_date, customer_id, total_price, status, invoice_number, id],
            callback
        );
    } else {
        db.run(
            `
            INSERT INTO invoices (billing_date, customer_id, total_price, status, invoice_number, created, updated) 
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `,
            [billing_date, customer_id, total_price, status, invoice_number],
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
        SELECT iv.*, c.*, iv.id AS invoice_id 
        FROM invoices iv 
        LEFT JOIN customers c ON iv.customer_id = c.id
        WHERE c.name_primary LIKE ? OR iv.invoice_number LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`];
    } else {
        sql = `
        SELECT iv.*, c.*, iv.id AS invoice_id 
        FROM invoices iv 
        LEFT JOIN customers c ON iv.customer_id = c.id
        `;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function countInvoicesForToday(callback) {
    const today = new Date().toISOString().split('T')[0]; // 今日の日付 (YYYY-MM-DD)
    const sql = `SELECT COUNT(*) AS count FROM invoices WHERE created = ?`;

    db.get(sql, [today], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row.count);
        }
    });
}

module.exports = {
    loadInvoices,
    getInvoiceById,
    saveInvoice,
    deleteInvoiceById,
    editInvoice,
    initializeDatabase,
    searchInvoices,
    countInvoicesForToday,
};
