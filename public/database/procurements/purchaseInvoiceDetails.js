const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPurchaseInvoiceDetails(callback) {
    const sql = `SELECT * FROM purchase_invoice_details`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPurchaseInvoiceDetailById(id, callback) {
    const sql = `SELECT * FROM purchase_invoice_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePurchaseInvoiceDetail(detailData, callback) {
    const {
        id,
        purchase_invoice_id,
        product_id,
        number,
        unit,
        price,
        tax_rate,
        storage_facility,
        stock
    } = detailData;

    if (id) {
        // IDが存在するかチェック
        db.get(
            `SELECT id FROM purchase_invoice_details WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    return callback(err);
                }

                if (row) {
                    db.run(
                        `UPDATE purchase_invoice_details SET 
                            purchase_invoice_id = ?, 
                            product_id = ?, 
                            number = ?, 
                            unit = ?, 
                            price = ?, 
                            tax_rate = ?, 
                            storage_facility = ?, 
                            stock = ?, 
                            updated = datetime('now') 
                        WHERE id = ?`,
                        [
                            purchase_invoice_id,
                            product_id,
                            number,
                            unit,
                            price,
                            tax_rate,
                            storage_facility,
                            stock,
                            id
                        ],
                        callback
                    );
                } else {
                    db.run(
                        `INSERT INTO purchase_invoice_details 
                        (purchase_invoice_id, product_id, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            purchase_invoice_id,
                            product_id,
                            number,
                            unit,
                            price,
                            tax_rate,
                            storage_facility,
                            stock
                        ],
                        callback
                    );
                }
            }
        );
    } else {
        db.run(
            `INSERT INTO purchase_invoice_details 
            (purchase_invoice_id, product_id, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                purchase_invoice_id,
                product_id,
                number,
                unit,
                price,
                tax_rate,
                storage_facility,
                stock
            ],
            callback
        );
    }
}


function deletePurchaseInvoiceDetailById(id, callback) {
    const sql = `DELETE FROM purchase_invoice_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPurchaseInvoiceDetail(id, callback) {
    const sql = `SELECT * FROM purchase_invoice_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS purchase_invoice_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_invoice_id INTEGER,
        product_id INTEGER,
        number INTEGER,
        unit VARCHAR(255),
        price INTEGER,
        tax_rate INTEGER,
        storage_facility VARCHAR(255),
        stock INTEGER,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchPurchaseInvoiceDetails(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_invoice_details 
        WHERE product_id LIKE ? OR unit LIKE ? OR storage_facility LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM purchase_invoice_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadPurchaseInvoiceDetails,
    getPurchaseInvoiceDetailById,
    savePurchaseInvoiceDetail,
    deletePurchaseInvoiceDetailById,
    editPurchaseInvoiceDetail,
    initializeDatabase,
    searchPurchaseInvoiceDetails
};
