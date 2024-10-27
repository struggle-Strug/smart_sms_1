const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadOrderSlips(callback) {
    const sql = `SELECT * FROM order_slips`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getOrderSlipById(id, callback) {
    const sql = `SELECT * FROM order_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveOrderSlip(orderSlipData, callback) {
    const {
        id,
        order_id,
        order_date,
        delivery_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        estimation_slip_id,
        estimation_id,
        remarks,
        closing_date,
        deposit_due_date,
        deposit_method
    } = orderSlipData;

    if (id) {
        db.run(
            `UPDATE order_slips SET 
                order_id = ?, 
                order_date = ?, 
                delivery_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                estimation_slip_id = ?, 
                estimation_id = ?, 
                remarks = ?, 
                closing_date = ?, 
                deposit_due_date = ?, 
                deposit_method = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                order_id,
                order_date,
                delivery_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                estimation_slip_id,
                estimation_id,
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
            `INSERT INTO order_slips 
            (order_id, order_date, delivery_date, vender_id, vender_name, honorific, vender_contact_person, estimation_slip_id, estimation_id, remarks, closing_date, deposit_due_date, deposit_method, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                order_id,
                order_date,
                delivery_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                estimation_slip_id,
                estimation_id,
                remarks,
                closing_date,
                deposit_due_date,
                deposit_method
            ],
            callback
        );
    }
}

function deleteOrderSlipById(id, callback) {
    const sql = `DELETE FROM order_slips WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editOrderSlip(id, callback) {
    const sql = `SELECT * FROM order_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS order_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id VARCHAR(255),
        order_date DATE,
        delivery_date DATE,
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255),
        vender_contact_person VARCHAR(255),
        estimation_slip_id VARCHAR(255),
        estimation_id VARCHAR(255),
        remarks VARCHAR(255),
        closing_date DATE,
        deposit_due_date DATE,
        deposit_method VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

module.exports = {
    loadOrderSlips,
    getOrderSlipById,
    saveOrderSlip,
    deleteOrderSlipById,
    editOrderSlip,
    initializeDatabase
};
