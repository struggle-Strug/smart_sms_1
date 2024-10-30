const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// function loadPurchaseInvoiceDetails(callback) {
//     const sql = `SELECT * FROM purchase_invoice_details`;
//     db.all(sql, [], (err, rows) => {
//         callback(err, rows);
//     });
// }


function loadPurchaseInvoiceDetails(callback) {
    const sql = `
        SELECT pid.*, pi.*, p.*, v.*
        FROM purchase_invoice_details pid
        LEFT JOIN purchase_invoices pi ON pid.purchase_invoice_id = pi.id
        LEFT JOIN products p ON pid.product_id = p.id
        LEFT JOIN vendors v ON pi.vender_id = v.id
    `;
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
        product_name,
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
                            product_name = ?,
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
                            product_name,
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
                        (purchase_invoice_id, product_id, pruduct_name, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            purchase_invoice_id,
                            product_id,
                            product_name,
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
            (purchase_invoice_id, product_id, product_name, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                purchase_invoice_id,
                product_id,
                product_name,
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
        product_name VARCHAR(255),
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


function searchPurchaseInvoiceDetails(conditions, callback) {
    let sql = `
        SELECT pid.*, pi.*, p.*, v.*
        FROM purchase_invoice_details pid
        LEFT JOIN purchase_invoices pi ON pid.purchase_invoice_id = pi.id
        LEFT JOIN products p ON pid.product_id = p.id
        LEFT JOIN vendors v ON pi.vender_id = v.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'pid.created_start') {
                whereClauses.push(`pid.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'pid.created_end') {
                whereClauses.push(`pid.created <= ?`);
                params.push(value); // created_endの日付をそのまま使用
            } else {
                whereClauses.push(`${column} LIKE ?`);
                params.push(`%${value}%`);
            }
        }
    }

    // WHERE句がある場合はSQL文に追加
    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(" AND ");
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchPurchaseInvoicesByPurchaseInvoiceId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_invoice_details 
        WHERE purchase_invoice_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM purchase_invoice_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function deletePurchaseInvoiceDetailsByPiId(purchaseInvoiceId, callback) {
    const sql = `
        DELETE FROM purchase_invoice_details
        WHERE purchase_invoice_id = ?
    `;
    db.run(sql, [purchaseInvoiceId], (err) => {
        callback(err);
    });
}


module.exports = {
    loadPurchaseInvoiceDetails,
    getPurchaseInvoiceDetailById,
    savePurchaseInvoiceDetail,
    deletePurchaseInvoiceDetailById,
    editPurchaseInvoiceDetail,
    initializeDatabase,
    searchPurchaseInvoiceDetails,
    searchPurchaseInvoicesByPurchaseInvoiceId,
    deletePurchaseInvoiceDetailsByPiId
};
