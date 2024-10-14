const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadPaymentVoucherDetails(callback) {
    const sql = `SELECT * FROM payment_voucher_details`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getPaymentVoucherDetailById(id, callback) {
    const sql = `SELECT * FROM payment_voucher_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function savePaymentVoucherDetail(detailData, callback) {
    const {
        id,
        payment_voucher_id,
        payment_method,
        payment_price,
        fees_and_charges
    } = detailData;

    if (id) {
        // IDが存在するかチェック
        db.get(
            `SELECT id FROM payment_voucher_details WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    return callback(err);
                }

                if (row) {
                    // レコードが存在する場合はUPDATE
                    db.run(
                        `UPDATE payment_voucher_details SET 
                            payment_voucher_id = ?, 
                            payment_method = ?, 
                            payment_price = ?, 
                            fees_and_charges = ?, 
                            updated = datetime('now') 
                        WHERE id = ?`,
                        [
                            payment_voucher_id,
                            payment_method,
                            payment_price,
                            fees_and_charges,
                            id
                        ],
                        callback
                    );
                } else {
                    // レコードが存在しない場合はINSERT
                    db.run(
                        `INSERT INTO payment_voucher_details 
                        (payment_voucher_id, payment_method, payment_price, fees_and_charges, created, updated) 
                        VALUES 
                        (?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            payment_voucher_id,
                            payment_method,
                            payment_price,
                            fees_and_charges
                        ],
                        callback
                    );
                }
            }
        );
    } else {
        db.run(
            `INSERT INTO payment_voucher_details 
            (payment_voucher_id, payment_method, payment_price, fees_and_charges, created, updated) 
            VALUES 
            (?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                payment_voucher_id,
                payment_method,
                payment_price,
                fees_and_charges
            ],
            callback
        );
    }
}


function deletePaymentVoucherDetailById(id, callback) {
    const sql = `DELETE FROM payment_voucher_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editPaymentVoucherDetail(id, callback) {
    const sql = `SELECT * FROM payment_voucher_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS payment_voucher_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_voucher_id INTEGER,
        payment_method INTEGER,
        payment_price INTEGER,
        fees_and_charges VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchPaymentVoucherDetails(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM payment_voucher_details 
        WHERE payment_method LIKE ? OR fees_and_charges LIKE ? OR payment_price LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM payment_voucher_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadPaymentVoucherDetails,
    getPaymentVoucherDetailById,
    savePaymentVoucherDetail,
    deletePaymentVoucherDetailById,
    editPaymentVoucherDetail,
    initializeDatabase,
    searchPaymentVoucherDetails
};
