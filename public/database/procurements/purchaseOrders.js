const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPurchaseOrders(callback) {
    const sql = `SELECT * FROM purchase_orders`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPurchaseOrderById(id, callback) {
    const sql = `SELECT * FROM purchase_orders WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePurchaseOrder(orderData, callback) {
    const {
        id,
        code,
        order_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        remarks,
        closing_date,
        payment_due_date,
        payment_method,
        estimated_delivery_date
    } = orderData;

    if (id) {
        // IDが存在する場合は更新 (UPDATE)
        db.run(
            `UPDATE purchase_orders SET 
                    code = ?,
                    order_date = ?, 
                    vender_id = ?, 
                    vender_name = ?, 
                    honorific = ?, 
                    vender_contact_person = ?, 
                    remarks = ?, 
                    closing_date = ?, 
                    payment_due_date = ?, 
                    payment_method = ?, 
                    estimated_delivery_date = ?, 
                    updated = datetime('now') 
                WHERE id = ?`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                remarks,
                closing_date,
                payment_due_date,
                payment_method,
                estimated_delivery_date,
                id
            ],
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                callback(null, { lastID: id });
            }
        );
    } else {
        // IDが存在しない場合は新規追加 (INSERT)
        db.run(
            `INSERT INTO purchase_orders 
                (code, order_date, vender_id, vender_name, honorific, vender_contact_person, remarks, closing_date, payment_due_date, payment_method, estimated_delivery_date, created, updated) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                remarks,
                closing_date,
                payment_due_date,
                payment_method,
                estimated_delivery_date
            ],
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                callback(null, { lastID: this.lastID });
            }
        );
    };
}


function deletePurchaseOrderById(id, callback) {
    const sql = `DELETE FROM purchase_orders WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPurchaseOrder(id, callback) {
    const sql = `SELECT * FROM purchase_orders WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS purchase_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255),
        order_date VARCHAR(255),
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255),
        vender_contact_person VARCHAR(255),
        remarks VARCHAR(255),
        closing_date VARCHAR(255),
        payment_due_date VARCHAR(255),
        payment_method VARCHAR(255),
        estimated_delivery_date VARCHAR(255),
        status VARCHAR(255) DEFAULT '未処理',  -- デフォルト値を「未処理」に設定
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}


function searchPurchaseOrders(query, callback) {
    let sql;
    let params = [];

    // 検索クエリがある場合は各カラムをLIKEで検索
    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM purchase_orders 
        WHERE code LIKE ?
        OR vender_name LIKE ? 
        `;
        params = Array(2).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM purchase_orders`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchPurchaseOrdersOnPV(conditions, callback) {
    let sql = `SELECT * FROM purchase_orders WHERE 1=1`; // 初期の条件
    let params = [];

    // 検索条件を動的に追加
    if (conditions.po_start_date) {
        sql += ` AND order_date >= ?`;
        params.push(conditions.po_start_date);
    }
    if (conditions.po_end_date) {
        sql += ` AND order_date <= ?`;
        params.push(conditions.po_end_date);
    }
    if (conditions.po_code) {
        sql += ` AND code LIKE ?`;
        params.push(`%${conditions.po_code}%`);
    }
    if (conditions.po_name) {
        sql += ` AND vender_name LIKE ?`;
        params.push(`%${conditions.po_name}%`);
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function updatePurchaseOrderStatus(query, callback) {
    const sql = `UPDATE purchase_orders SET status = ?, updated = datetime('now') WHERE code = ?`;
    db.run(sql, [query.status, query.code], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { code: query.code });
    });
}



module.exports = {
    loadPurchaseOrders,
    getPurchaseOrderById,
    savePurchaseOrder,
    deletePurchaseOrderById,
    editPurchaseOrder,
    initializeDatabase,
    searchPurchaseOrders,
    searchPurchaseOrdersOnPV,
    updatePurchaseOrderStatus
};
