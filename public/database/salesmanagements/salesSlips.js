const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadSalesSlips(callback) {
    const sql = `SELECT * FROM sales_slips`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getSalesSlipById(id, callback) {
    const sql = `SELECT * FROM sales_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveSalesSlip(salesSlipData, callback) {
    const {
        id,
        sales_date,
        delivery_due_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        order_slip_id,
        order_id,
        remarks,
        closing_date,
        deposit_due_date,
        deposit_method,
        created,
        updated
    } = salesSlipData;

    if (id) {
        db.run(
            `UPDATE sales_slips SET 
                sales_date = ?, 
                delivery_due_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                order_slip_id = ?, 
                order_id = ?, 
                remarks = ?, 
                closing_date = ?, 
                deposit_due_date = ?, 
                deposit_method = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                sales_date,
                delivery_due_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                order_slip_id,
                order_id,
                remarks,
                closing_date,
                deposit_due_date,
                deposit_method,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO sales_slips 
            (sales_date, delivery_due_date, vender_id, vender_name, honorific, vender_contact_person, order_slip_id, order_id, remarks, closing_date, deposit_due_date, deposit_method, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                sales_date,
                delivery_due_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                order_slip_id,
                order_id,
                remarks,
                closing_date,
                deposit_due_date,
                deposit_method
            ],
            callback
        );
    }
}

function deleteSalesSlipById(id, callback) {
    const sql = `DELETE FROM sales_slips WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editSalesSlip(id, callback) {
    const sql = `SELECT * FROM sales_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS sales_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sales_date DATE,
        delivery_due_date DATE NULL,
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255) NULL,
        vender_contact_person VARCHAR(255) NULL,
        order_slip_id VARCHAR(255) NULL,
        order_id VARCHAR(255) NULL,
        remarks VARCHAR(255) NULL,
        closing_date DATE NULL,
        deposit_due_date DATE NULL,
        deposit_method VARCHAR(255) NULL,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

module.exports = {
    loadSalesSlips,
    getSalesSlipById,
    saveSalesSlip,
    deleteSalesSlipById,
    editSalesSlip,
    initializeDatabase
};
