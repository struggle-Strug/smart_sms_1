const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadOrderSlipDetails(callback) {
    const sql = `SELECT * FROM order_slip_details osd
                 LEFT JOIN order_slips os ON osd.order_slip_id = os.id
                 LEFT JOIN products p ON osd.product_id = p.id
    `;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getOrderSlipDetailById(id, callback) {
    const sql = `SELECT * FROM order_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveOrderSlipDetail(orderSlipDetailData, callback) {
    const {
        id,
        order_slip_id,
        product_id,
        product_name,
        number,
        unit,
        unit_price,
        tax_rate,
        lot_number,
        storage_facility,
        stock,
        gross_profit,
        gross_margin_rate,
        created,
        updated
    } = orderSlipDetailData;

    if (id) {
        db.run(
            `UPDATE order_slip_details SET 
                order_slip_id = ?, 
                product_id = ?, 
                product_name = ?, 
                number = ?, 
                unit = ?, 
                unit_price = ?, 
                tax_rate = ?, 
                lot_number = ?, 
                storage_facility = ?, 
                stock = ?, 
                gross_profit = ?, 
                gross_margin_rate = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                order_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                tax_rate,
                lot_number,
                storage_facility,
                stock,
                gross_profit,
                gross_margin_rate,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO order_slip_details 
            (order_slip_id, product_id, product_name, number, unit, unit_price, tax_rate, lot_number, storage_facility, stock, gross_profit, gross_margin_rate, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                order_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                tax_rate,
                lot_number,
                storage_facility,
                stock,
                gross_profit,
                gross_margin_rate
            ],
            callback
        );
    }
}

function deleteOrderSlipDetailById(id, callback) {
    const sql = `DELETE FROM order_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editOrderSlipDetail(id, callback) {
    const sql = `SELECT * FROM order_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function deleteOrderSlipDetailsBySlipId(orderSlipId, callback) {
    const sql = `
        DELETE FROM order_slip_details
        WHERE order_slip_id = ?
    `;
    db.run(sql, [orderSlipId], (err) => {
        callback(err);
    });
}

function searchOrderSlipsByOrderSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM order_slip_details 
        WHERE order_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM order_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}




function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS order_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_slip_id INTEGER,
        product_id INTEGER,
        product_name VARCHAR(255),
        number INTEGER,
        unit VARCHAR(255) NULL,
        unit_price INTEGER,
        tax_rate INTEGER,
        lot_number INTEGER NULL,
        storage_facility VARCHAR(255),
        stock INTEGER NULL,
        gross_profit INTEGER NULL,
        gross_margin_rate INTEGER NULL,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}


function searchOrderSlipDetails(conditions, callback) {
    let sql = `SELECT * FROM order_slip_details osd
                 LEFT JOIN order_slips os ON osd.order_slip_id = os.id
                 LEFT JOIN products p ON osd.product_id = p.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'osd.created_start') {
                whereClauses.push(`osd.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'osd.created_end') {
                whereClauses.push(`osd.created <= ?`);
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

function searchOrderSlipByOrderSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM order_slip_details
        WHERE order_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM order_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function deleteOrderSlipDetailsBySoId(OrderSlipId, callback) {
    const sql = `
        DELETE FROM order_slip_details
        WHERE order_slip_id = ?
    `;
    db.run(sql, [OrderSlipId], (err) => {
        callback(err);
    });
}

module.exports = {
    loadOrderSlipDetails,
    getOrderSlipDetailById,
    saveOrderSlipDetail,
    deleteOrderSlipDetailById,
    editOrderSlipDetail,
    initializeDatabase,
    deleteOrderSlipDetailsBySlipId,
    searchOrderSlipsByOrderSlipId,
    searchOrderSlipDetails,
    searchOrderSlipByOrderSlipId,
    deleteOrderSlipDetailsBySoId
};
