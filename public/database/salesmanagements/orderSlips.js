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
        code,
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
    } = orderSlipData;

    if (id) {
        db.run(
            `UPDATE order_slips SET 
                code = ?,
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
                code,
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
            // callback
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                callback(null, { lastID: id });
            }
        );
    } else {
        db.run(
            `INSERT INTO order_slips 
            (code, order_id, order_date, delivery_date, vender_id, vender_name, honorific, vender_contact_person, estimation_slip_id, estimation_id, remarks, closing_date, deposit_due_date, deposit_method, created, updated) 
            VALUES 
            (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
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
            // callback
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                callback(null, { lastID: this.lastID });
            }
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
        code VARCHAR(255) DEFAULT NULL,
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

function searchOrderSlips(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM order_slips 
        WHERE vender_name LIKE ? OR order_id LIKE ? OR vender_contact_person LIKE ?
        `;
        // params = [`%${query}%`, `%${query}%`, `%${query}%`];
        params = Array(2).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM order_slips`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    loadOrderSlips,
    getOrderSlipById,
    saveOrderSlip,
    deleteOrderSlipById,
    editOrderSlip,
    initializeDatabase,
    searchOrderSlips
};
