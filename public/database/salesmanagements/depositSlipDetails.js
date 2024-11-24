const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// deposit_slip_details の操作
function loadDepositSlipDetails(callback) {
    const sql = `SELECT dsd.*, ds.*, v.*, v.code AS vendor_code, ds.code AS ds_code, ds.id AS ds_id, v.id AS v_id, dsd.id AS dsd_id
                 FROM deposit_slip_details dsd
                 LEFT JOIN deposit_slips ds ON dsd.deposit_slip_id = ds.id
                 LEFT JOIN vendors v ON ds.vender_id = v.id
    `;
    "pvd.*, pv.*, v.*, v.payment_method AS vendor_payment_method, pvd.payment_method AS detail_payment_method"

    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getDepositSlipDetailById(id, callback) {
    const sql = `SELECT * FROM deposit_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveDepositSlipDetail(detailData, callback) {
    const {
        id,
        deposit_slip_id,
        deposit_date,
        vender_id,
        vender_name,
        claim_id,
        deposit_method,
        deposits,
        commission_fee,
        remarks,
        data_category,
    } = detailData;

    if (id) {
        db.run(
            `UPDATE deposit_slip_details SET 
                deposit_slip_id = ?, 
                deposit_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                claim_id = ?, 
                deposit_method = ?, 
                deposits = ?, 
                commission_fee = ?, 
                remarks = ?, 
                data_category = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                deposit_slip_id,
                deposit_date,
                vender_id,
                vender_name,
                claim_id,
                deposit_method,
                deposits,
                commission_fee,
                remarks,
                data_category,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO deposit_slip_details 
            (deposit_slip_id, deposit_date, vender_id, vender_name, claim_id, deposit_method, deposits, commission_fee, remarks, data_category, created, updated) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                deposit_slip_id,
                deposit_date,
                vender_id,
                vender_name,
                claim_id,
                deposit_method,
                deposits,
                commission_fee,
                remarks,
                data_category
            ],
            callback
        );
    }
}

function deleteDepositSlipDetailById(id, callback) {
    const sql = `DELETE FROM deposit_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function deleteDepositSlipDetailsBySlipId(id, callback) {
    const sql = `DELETE FROM deposit_slip_details WHERE deposit_slip_id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editDepositSlipDetail(id, callback) {
    const sql = `SELECT * FROM deposit_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function searchDepositSlipsByDepositSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM deposit_slip_details 
        WHERE deposit_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM deposit_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchDepositSlipsDetails(conditions, callback) {
    let sql = `SELECT * FROM deposit_slip_details dsd
                 LEFT JOIN deposit_slips ds ON dsd.deposit_slip_id = ds.id
                 LEFT JOIN vendors v ON dsd.vender_id = v.id
    `;
    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            if (column === 'dsd.created_start') {
                whereClauses.push(`dsd.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'dsd.created_end') {
                whereClauses.push(`dsd.created <= ?`);
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

function getDepositsTotalByVendorIds(data, callback) {
    const { venderIds, formattedDate } = data;
    const placeholders = venderIds.map(() => '?').join(', ');
    const sql = `
        SELECT vender_id, SUM(deposits) AS total_deposits, SUM(commission_fee) AS total_commission_fee
        FROM deposit_slip_details
        WHERE vender_id IN (${placeholders})
        AND strftime('%Y-%m', created) = strftime('%Y-%m', ?)
        GROUP BY vender_id
    `;
    
    db.all(sql, [...venderIds, formattedDate], (err, rows) => {
        callback(err, rows);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS deposit_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deposit_slip_id INTEGER,
        deposit_date DATE,
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        claim_id VARCHAR(255),
        deposit_method VARCHAR(255),
        deposits INTEGER,
        commission_fee INTEGER,
        remarks VARCHAR(255),
        data_category VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

module.exports = {
    loadDepositSlipDetails,
    getDepositSlipDetailById,
    saveDepositSlipDetail,
    deleteDepositSlipDetailById,
    editDepositSlipDetail,
    initializeDatabase,
    searchDepositSlipsByDepositSlipId,
    searchDepositSlipsDetails,
    deleteDepositSlipDetailsBySlipId,
    getDepositsTotalByVendorIds
};
