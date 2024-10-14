const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadStockInOutSlipDetails(callback) {
    const sql = `SELECT * FROM stock_in_out_slip_details`;
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
                number = ?, 
                unit = ?, 
                price = ?, 
                lot_number = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                stock_in_out_slip_id,
                product_id,
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
            (stock_in_out_slip_id, product_id, number, unit, price, lot_number, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                stock_in_out_slip_id,
                product_id,
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

function searchStockInOutSlipDetails(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM stock_in_out_slip_details 
        WHERE product_id LIKE ? OR unit LIKE ? OR lot_number LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM stock_in_out_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadStockInOutSlipDetails,
    getStockInOutSlipDetailById,
    saveStockInOutSlipDetail,
    deleteStockInOutSlipDetailById,
    editStockInOutSlipDetail,
    initializeDatabase,
    searchStockInOutSlipDetails
};
