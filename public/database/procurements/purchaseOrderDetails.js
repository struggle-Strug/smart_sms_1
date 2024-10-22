const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPurchaseOrderDetails(callback) {
    const sql = `
        SELECT pod.*, po.*, p.*, v.*
        FROM purchase_order_details pod
        LEFT JOIN purchase_orders po ON pod.purchase_order_id = po.id
        LEFT JOIN products p ON pod.product_id = p.id
        LEFT JOIN vendors v ON po.vender_id = v.id
    `;
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
        product_name,
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
                            purchase_order_id,
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
                    // レコードが存在しない場合はINSERT
                    db.run(
                        `INSERT INTO purchase_order_details 
                        (purchase_order_id, product_id, product_name, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            purchase_order_id,
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
        console.log('checkcheck');
        db.run(
            `INSERT INTO purchase_order_details 
            (purchase_order_id, product_id, product_name, number, unit, price, tax_rate, storage_facility, stock, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                purchase_order_id,
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

function searchPurchaseOrderDetails(conditions, callback) {
    let sql = `
        SELECT pod.*, po.*, p.*, v.*
        FROM purchase_order_details pod
        LEFT JOIN purchase_orders po ON pod.purchase_order_id = po.id
        LEFT JOIN products p ON pod.product_id = p.id
        LEFT JOIN vendors v ON po.vender_id = v.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'pod.created_start') {
                whereClauses.push(`pod.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'pod.created_end') {
                whereClauses.push(`pod.created <= ?`);
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

function searchPurchaseOrdersByPurchaseOrderId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_order_details 
        WHERE purchase_order_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM purchase_order_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function deletePurchaseOrderDetailsByPoId(purchaseOrderId, callback) {
    const sql = `
        DELETE FROM purchase_order_details
        WHERE purchase_order_id = ?
    `;
    db.run(sql, [purchaseOrderId], (err) => {
        callback(err);
    });
}


module.exports = {
    loadPurchaseOrderDetails,
    getPurchaseOrderDetailById,
    savePurchaseOrderDetail,
    deletePurchaseOrderDetailById,
    editPurchaseOrderDetail,
    initializeDatabase,
    searchPurchaseOrderDetails,
    searchPurchaseOrdersByPurchaseOrderId,
    deletePurchaseOrderDetailsByPoId
};
