const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadStockInOutSlips(callback) {
    const sql = `SELECT * FROM stock_in_out_slips`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getStockInOutSlipById(id, callback) {
    const sql = `SELECT * FROM stock_in_out_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveStockInOutSlip(slipData, callback) {
    const {
        id,
        code,
        stock_in_out_date,
        processType,
        warehouse_from,
        warehouse_to,
        contact_person,
        remarks
    } = slipData;

    if (id) {
        // IDが存在する場合はUPDATE
        db.run(
            `UPDATE stock_in_out_slips SET 
                code = ?,
                stock_in_out_date = ?, 
                processType = ?, 
                warehouse_from = ?, 
                warehouse_to = ?, 
                contact_person = ?, 
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                code,
                stock_in_out_date,
                processType,
                warehouse_from,
                warehouse_to,
                contact_person,
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
        // IDが存在しない場合はINSERT
        db.run(
            `INSERT INTO stock_in_out_slips 
            (code, stock_in_out_date, processType, warehouse_from, warehouse_to, contact_person, remarks, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                stock_in_out_date,
                processType,
                warehouse_from,
                warehouse_to,
                contact_person,
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


function deleteStockInOutSlipById(id, callback) {
    const sql = `DELETE FROM stock_in_out_slips WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editStockInOutSlip(id, callback) {
    const sql = `SELECT * FROM stock_in_out_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS stock_in_out_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255),
        stock_in_out_date VARCHAR(255),
        processType VARCHAR(255),
        warehouse_from VARCHAR(255),
        warehouse_to VARCHAR(255),
        contact_person VARCHAR(255),
        remarks VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchStockInOutSlips(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM stock_in_out_slips 
        WHERE code LIKE ? 
        OR warehouse_from LIKE ? 
        OR warehouse_to LIKE ? 
        `;
        params = Array(3).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM stock_in_out_slips`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadStockInOutSlips,
    getStockInOutSlipById,
    saveStockInOutSlip,
    deleteStockInOutSlipById,
    editStockInOutSlip,
    initializeDatabase,
    searchStockInOutSlips
};
