const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPurchaseInvoices(callback) {
    const sql = `SELECT * FROM purchase_invoices`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPurchaseInvoiceById(id, callback) {
    const sql = `SELECT * FROM purchase_invoices WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePurchaseInvoice(invoiceData, callback) {
    const {
        id,
        code,
        order_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        contact_person,
        purchase_order_id,
        remarks,
        closing_date,
        payment_due_date,
        payment_method
    } = invoiceData;

    if (id) {
        db.run(
            `UPDATE purchase_invoices SET 
                code = ?, 
                order_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                contact_person = ?, 
                purchase_order_id = ?, 
                remarks = ?, 
                closing_date = ?, 
                payment_due_date = ?, 
                payment_method = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                contact_person,
                purchase_order_id,
                remarks,
                closing_date,
                payment_due_date,
                payment_method,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO purchase_invoices 
            (code, order_date, vender_id, vender_name, honorific, vender_contact_person, contact_person, purchase_order_id, remarks, closing_date, payment_due_date, payment_method, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                contact_person,
                purchase_order_id,
                remarks,
                closing_date,
                payment_due_date,
                payment_method
            ],
            callback
        );
    }
}


function deletePurchaseInvoiceById(id, callback) {
    const sql = `DELETE FROM purchase_invoices WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPurchaseInvoice(id, callback) {
    const sql = `SELECT * FROM purchase_invoices WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS purchase_invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255),
        order_date VARCHAR(255),
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255),
        vender_contact_person VARCHAR(255),
        contact_person VARCHAR(255),
        purchase_order_id VARCHAR(255),
        remarks VARCHAR(255),
        closing_date VARCHAR(255),
        payment_due_date VARCHAR(255),
        payment_method VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchPurchaseInvoices(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_invoices 
        WHERE order_date LIKE ? 
        OR vender_id LIKE ? 
        OR vender_name LIKE ? 
        OR honorific LIKE ? 
        OR vender_contact_person LIKE ? 
        OR contact_person LIKE ?
        OR purchase_order_id LIKE ?
        OR remarks LIKE ? 
        OR closing_date LIKE ? 
        OR payment_due_date LIKE ? 
        OR payment_method LIKE ?
        `;
        params = Array(11).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM purchase_invoices`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadPurchaseInvoices,
    getPurchaseInvoiceById,
    savePurchaseInvoice,
    deletePurchaseInvoiceById,
    editPurchaseInvoice,
    initializeDatabase,
    searchPurchaseInvoices
};
