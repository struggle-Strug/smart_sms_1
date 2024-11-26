const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadEstimationSlipDetails(callback) {
    const sql = `SELECT * FROM estimation_slip_details esd
                 LEFT JOIN estimation_slips es ON esd.estimation_slip_id = es.id
                 LEFT JOIN products p ON esd.product_id = p.id
    `;
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
        gross_margin_rate,
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
    const sql = `DELETE FROM estimation_slip_details WHERE estimation_slip_id = ?`;
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

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS estimation_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimation_slip_id INTEGER,
        product_id INTEGER,
        product_name VARCHAR(255),
        number INTEGER,
        unit VARCHAR(255) DEFAULT NULL,
        unit_price INTEGER,
        price INTEGER,
        tax_rate INTEGER,
        lot_number INTEGER DEFAULT NULL,
        storage_facility VARCHAR(255),
        stock INTEGER DEFAULT NULL,
        gross_profit INTEGER DEFAULT NULL,
        gross_margin_rate INTEGER,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

function searchEstimationSlipsByEstimationSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM estimation_slip_details 
        WHERE estimation_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM estimation_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchEstimationSlipDetails(conditions, callback) {
    let sql = `SELECT * FROM estimation_slip_details esd
                 LEFT JOIN estimation_slips es ON esd.estimation_slip_id = es.id
                 LEFT JOIN products p ON esd.product_id = p.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'esd.created_start') {
                whereClauses.push(`esd.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'esd.created_end') {
                whereClauses.push(`esd.created <= ?`);
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

function deleteEstimationSlipDetailsByEsId(EstimationSlip, callback) {
    const sql = `
        DELETE FROM estimation_slip_details
        WHERE estimation_slip_id = ?
    `;
    db.run(sql, [OrderSlipId], (err) => {
        callback(err);
    });
}

module.exports = {
    loadEstimationSlipDetails,
    getEstimationSlipDetailById,
    saveEstimationSlipDetail,
    deleteEstimationSlipDetailById,
    editEstimationSlipDetail,
    initializeDatabase,
    searchEstimationSlipsByEstimationSlipId,
    searchEstimationSlipDetails,
    deleteEstimationSlipDetailsByEsId
};
