const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadOrderSlipDetails(callback) {
    const sql = `SELECT * FROM order_slip_details`;
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

module.exports = {
    loadOrderSlipDetails,
    getOrderSlipDetailById,
    saveOrderSlipDetail,
    deleteOrderSlipDetailById,
    editOrderSlipDetail,
    initializeDatabase
};
