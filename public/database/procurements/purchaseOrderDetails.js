const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPurchaseOrderDetails(callback) {
    const sql = `SELECT * FROM purchase_order_details`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPurchaseOrderDetailById(id, callback) {
    const sql = `SELECT * FROM purchase_order_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePurchaseOrderDetail(detailData, callback) {
    const {
        id,
        purchase_order_id,
        product_id,
        number,
        unit,
        price,
        tax_rate,
        storage_facility,
        stock
    } = detailData;

    if (id) {
        db.get(
            `SELECT id FROM purchase_order_details WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    return callback(err);
                }

                if (row) {
                    db.run(
                        `UPDATE purchase_order_details SET 
                            purchase_order_id = ?, 
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
                            purchase_order_id,
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
                    // レコードが存在しない場合はINSERT
                    db.run(
                        `INSERT INTO purchase_order_details 
                        (purchase_order_id, product_id, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            purchase_order_id,
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
            `INSERT INTO purchase_order_details 
            (purchase_order_id, product_id, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                purchase_order_id,
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


function deletePurchaseOrderDetailById(id, callback) {
    const sql = `DELETE FROM purchase_order_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPurchaseOrderDetail(id, callback) {
    const sql = `SELECT * FROM purchase_order_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS purchase_order_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_order_id INTEGER,
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

function searchPurchaseOrderDetails(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_order_details 
        WHERE product_id LIKE ? OR unit LIKE ? OR storage_facility LIKE ? OR remarks LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM purchase_order_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadPurchaseOrderDetails,
    getPurchaseOrderDetailById,
    savePurchaseOrderDetail,
    deletePurchaseOrderDetailById,
    editPurchaseOrderDetail,
    initializeDatabase,
    searchPurchaseOrderDetails
};
