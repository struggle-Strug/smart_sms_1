const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// function loadStockInOutSlipDetails(callback) {
//     const sql = `SELECT * FROM stock_in_out_slip_details`;
//     db.all(sql, [], (err, rows) => {
//         callback(err, rows);
//     });
// }

function loadStockInOutSlipDetails(callback) {
    const sql = `
        SELECT siod.*, sio.*, p.*
        FROM stock_in_out_slip_details siod
        LEFT JOIN stock_in_out_slips sio ON siod.stock_in_out_slip_id = sio.id
        LEFT JOIN products p ON siod.product_id = p.id
    `;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getStockInOutSlipDetailById(id, callback) {
    const sql = `SELECT * FROM stock_in_out_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveStockInOutSlipDetail(detailData, callback) {
    const {
        id,
        stock_in_out_slip_id,
        product_id,
        product_name,
        number,
        unit,
        price,
        lot_number,
        created,
        updated
    } = detailData;

    if (id) {
        db.run(
            `UPDATE stock_in_out_slip_details SET 
                stock_in_out_slip_id = ?, 
                product_id = ?, 
                product_name = ?
                number = ?, 
                unit = ?, 
                price = ?, 
                lot_number = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                stock_in_out_slip_id,
                product_id,
                product_name,
                number,
                unit,
                price,
                lot_number,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO stock_in_out_slip_details 
            (stock_in_out_slip_id, product_id, product_name, number, unit, price, lot_number, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                stock_in_out_slip_id,
                product_id,
                product_name,
                number,
                unit,
                price,
                lot_number
            ],
            callback
        );
    }
}

function deleteStockInOutSlipDetailById(id, callback) {
    const sql = `DELETE FROM stock_in_out_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editStockInOutSlipDetail(id, callback) {
    const sql = `SELECT * FROM stock_in_out_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS stock_in_out_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stock_in_out_slip_id INTEGER,
        product_id INTEGER,
        product_name VARCHAR(255),
        number INTEGER,
        unit VARCHAR(255),
        price INTEGER,
        lot_number INTEGER,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

// function searchStockInOutSlipDetails(query, callback) {
//     let sql;
//     let params = [];

//     if (query && query.trim() !== '') {
//         sql = `
//         SELECT * FROM stock_in_out_slip_details 
//         WHERE product_id LIKE ? OR unit LIKE ? OR lot_number LIKE ?
//         `;
//         params = [`%${query}%`, `%${query}%`, `%${query}%`];
//     } else {
//         sql = `SELECT * FROM stock_in_out_slip_details`;
//     }
//     db.all(sql, params, (err, rows) => {
//         callback(err, rows);
//     });
// }

function searchStockInOutSlipDetails(conditions, callback) {
    let sql = `
        SELECT siod.*, sio.*, p.*
        FROM stock_in_out_slip_details siod
        LEFT JOIN stock_in_out_slips sio ON siod.stock_in_out_slip_id = sio.id
        LEFT JOIN products p ON siod.product_id = p.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            whereClauses.push(`${column} LIKE ?`);
            params.push(`%${value}%`);
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

// stock_in_out_slip_details テーブルでの検索処理
function searchStockInOutSlipDetailsBySlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM stock_in_out_slip_details
        WHERE stock_in_out_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM stock_in_out_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

// stock_in_out_slip_details テーブルでの削除処理
function deleteStockInOutSlipDetailsBySlipId(stockInOutSlipId, callback) {
    const sql = `
        DELETE FROM stock_in_out_slip_details
        WHERE stock_in_out_slip_id = ?
    `;
    db.run(sql, [stockInOutSlipId], (err) => {
        callback(err);
    });
}



module.exports = {
    loadStockInOutSlipDetails,
    getStockInOutSlipDetailById,
    saveStockInOutSlipDetail,
    deleteStockInOutSlipDetailById,
    editStockInOutSlipDetail,
    initializeDatabase,
    searchStockInOutSlipDetails,
    searchStockInOutSlipDetailsBySlipId,
    deleteStockInOutSlipDetailsBySlipId
};
