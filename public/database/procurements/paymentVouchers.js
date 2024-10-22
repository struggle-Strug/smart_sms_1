const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPaymentVouchers(callback) {
    const sql = `SELECT * FROM payment_vouchers`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPaymentVoucherById(id, callback) {
    const sql = `SELECT * FROM payment_vouchers WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePaymentVoucher(voucherData, callback) {
    const {
        id,
        code,
        order_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        contact_person,
        purchase_voucher_id,
        remarks,
        created,
        updated
    } = voucherData;

    if (id) {
        db.run(
            `UPDATE payment_vouchers SET 
                code = ?,
                order_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                contact_person = ?, 
                purchase_voucher_id = ?, 
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                contact_person,
                purchase_voucher_id,
                remarks,
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
        db.run(
            `INSERT INTO payment_vouchers 
            (code, order_date, vender_id, vender_name, honorific, vender_contact_person, contact_person, purchase_voucher_id, remarks, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                order_date,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                contact_person,
                purchase_voucher_id,
                remarks
            ],
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

function deletePaymentVoucherById(id, callback) {
    const sql = `DELETE FROM payment_vouchers WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPaymentVoucher(id, callback) {
    const sql = `SELECT * FROM payment_vouchers WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS payment_vouchers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255),
        order_date VARCHAR(255),
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255),
        vender_contact_person VARCHAR(255),
        contact_person VARCHAR(255),
        purchase_voucher_id VARCHAR(255),
        remarks VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchPaymentVouchers(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM payment_vouchers 
        WHERE code LIKE ? OR vender_name LIKE ? 
        `;
        params = [`%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM payment_vouchers`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadPaymentVouchers,
    getPaymentVoucherById,
    savePaymentVoucher,
    deletePaymentVoucherById,
    editPaymentVoucher,
    initializeDatabase,
    searchPaymentVouchers
};
