const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadSalesSlipDetails(callback) {
    const sql = `SELECT * FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getSalesSlipDetailById(id, callback) {
    const sql = `SELECT * FROM sales_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveSalesSlipDetail(salesSlipDetailData, callback) {
    const {
        id,
        sales_slip_id,
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
    } = salesSlipDetailData;

    if (id) {
        db.run(
            `UPDATE sales_slip_details SET 
                sales_slip_id = ?, 
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
                sales_slip_id,
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
            `INSERT INTO sales_slip_details 
            (sales_slip_id, product_id, product_name, number, unit, unit_price, tax_rate, lot_number, storage_facility, stock, gross_profit, gross_margin_rate, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                sales_slip_id,
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

function deleteSalesSlipDetailsBySlipId(salesSlipId, callback) {
    const sql = `
        DELETE FROM order_slip_details
        WHERE sales_slip_id = ?
    `;
    db.run(sql, [salesSlipId], (err) => {
        callback(err);
    });
}


function deleteSalesSlipDetailById(id, callback) {
    const sql = `DELETE FROM sales_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editSalesSlipDetail(id, callback) {
    const sql = `SELECT * FROM sales_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function searchSalesSlipsBySalesSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM sales_slip_details 
        WHERE sales_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM sales_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS sales_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sales_slip_id INTEGER,
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

function searchSalesSlipDetails(conditions, callback) {
    let sql = `SELECT * FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            // pod.created_start と pod.created_end の特別な扱い
            if (column === 'ssd.created_start') {
                whereClauses.push(`ssd.created >= ?`);
                params.push(value); // created_startの日付をそのまま使用
            } else if (column === 'ssd.created_end') {
                whereClauses.push(`ssd.created <= ?`);
                params.push(value); // created_endの日付をそのまま使用
            } else {
                whereClauses.push(`${column} LIKE ?`);
                params.push(`%${value}%`);
            }
        }
    }

    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(" AND ");
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadSalesSlipDetails,
    getSalesSlipDetailById,
    saveSalesSlipDetail,
    deleteSalesSlipDetailById,
    editSalesSlipDetail,
    initializeDatabase,
    deleteSalesSlipDetailsBySlipId,
    searchSalesSlipsBySalesSlipId,
    searchSalesSlipDetails
};
