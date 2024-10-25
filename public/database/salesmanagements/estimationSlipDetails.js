const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadEstimationSlipDetails(callback) {
    const sql = `SELECT * FROM estimation_slip_details`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getEstimationSlipDetailById(id, callback) {
    const sql = `SELECT * FROM estimation_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveEstimationSlipDetail(detailData, callback) {
    const {
        id,
        estimation_slip_id,
        product_id,
        product_name,
        number,
        unit,
        unit_price,
        price,
        tax_rate,
        lot_number,
        storage_facility,
        stock,
        gross_profit,
        gross_margin_rate
    } = detailData;

    if (id) {
        db.run(
            `UPDATE estimation_slip_details SET 
                estimation_slip_id = ?, 
                product_id = ?, 
                product_name = ?, 
                number = ?, 
                unit = ?, 
                unit_price = ?, 
                price = ?, 
                tax_rate = ?, 
                lot_number = ?, 
                storage_facility = ?, 
                stock = ?, 
                gross_profit = ?, 
                gross_margin_rate = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                estimation_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                price,
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
            `INSERT INTO estimation_slip_details 
            (estimation_slip_id, product_id, product_name, number, unit, unit_price, price, tax_rate, lot_number, storage_facility, stock, gross_profit, gross_margin_rate, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                estimation_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                price,
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

function deleteEstimationSlipDetailById(id, callback) {
    const sql = `DELETE FROM estimation_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editEstimationSlipDetail(id, callback) {
    const sql = `SELECT * FROM estimation_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeEstimationSlipDetailsTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS estimation_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimation_slip_id INTEGER,
        product_id INTEGER,
        product_name VARCHAR(255),
        number INTEGER,
        unit VARCHAR(255),
        unit_price INTEGER,
        price INTEGER,
        tax_rate INTEGER,
        lot_number INTEGER,
        storage_facility VARCHAR(255),
        stock INTEGER,
        gross_profit INTEGER,
        gross_margin_rate INTEGER,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

module.exports = {
    loadEstimationSlipDetails,
    getEstimationSlipDetailById,
    saveEstimationSlipDetail,
    deleteEstimationSlipDetailById,
    editEstimationSlipDetail,
    initializeEstimationSlipDetailsTable
};
