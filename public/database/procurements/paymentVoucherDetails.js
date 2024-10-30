const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// function loadPaymentVoucherDetails(callback) {
//     const sql = `SELECT * FROM payment_voucher_details`;
//     db.all(sql, [], (err, rows) => {
//         callback(err, rows);
//     });
// }

function loadPaymentVoucherDetails(callback) {
    const sql = `
        SELECT pvd.*, pv.*, v.*, v.payment_method AS vendor_payment_method, pvd.payment_method AS detail_payment_method
        FROM payment_voucher_details pvd
        LEFT JOIN payment_vouchers pv ON pvd.payment_voucher_id = pv.id
        LEFT JOIN vendors v ON pv.vender_id = v.id
    `;
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

// function searchPaymentVoucherDetails(query, callback) {
//     let sql;
//     let params = [];

//     if (query && query.trim() !== '') {
//         sql = `
//         SELECT * FROM payment_voucher_details 
//         WHERE payment_method LIKE ? OR fees_and_charges LIKE ? OR payment_price LIKE ?
//         `;
//         params = [`%${query}%`, `%${query}%`, `%${query}%`];
//     } else {
//         sql = `SELECT * FROM payment_voucher_details`;
//     }
//     db.all(sql, params, (err, rows) => {
//         callback(err, rows);
//     });
// }

function searchPaymentVoucherDetails(conditions, callback) {
    let sql = `
        SELECT pvd.*, pv.*, v.*, v.payment_method AS vendor_payment_method, pvd.payment_method AS detail_payment_method
        FROM payment_voucher_details pvd
        LEFT JOIN payment_vouchers pv ON pvd.payment_voucher_id = pv.id
        LEFT JOIN vendors v ON pv.vender_id = v.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'pvd.created_start') {
                whereClauses.push(`pvd.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'pvd.created_end') {
                whereClauses.push(`pvd.created <= ?`);
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

function searchPaymentVouchersByPaymentVoucherId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM payment_voucher_details
        WHERE payment_voucher_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM payment_voucher_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function deletePaymentVoucherDetailsByPvId(paymentVoucherId, callback) {
    const sql = `
        DELETE FROM payment_voucher_details
        WHERE payment_voucher_id = ?
    `;
    db.run(sql, [paymentVoucherId], (err) => {
        callback(err);
    });
}

module.exports = {
    loadPaymentVoucherDetails,
    getPaymentVoucherDetailById,
    savePaymentVoucherDetail,
    deletePaymentVoucherDetailById,
    editPaymentVoucherDetail,
    initializeDatabase,
    searchPaymentVoucherDetails,
    searchPaymentVouchersByPaymentVoucherId,
    deletePaymentVoucherDetailsByPvId
};
