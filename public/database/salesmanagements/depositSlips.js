const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadDepositSlips(callback) {
    const sql = "SELECT * FROM deposit_slips";
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getDepositSlipById(id, callback) {
    const sql = "SELECT * FROM deposit_slips WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveDepositSlip(depositSlipData, callback) {
    const {
        id,
        code,
        deposit_date,
        status,
        vender_name,
        vender_id,
        remarks,
        updated,
        created,

    } = depositSlipData;

    if (id) {
        db.run(
            `UPDATE deposit_slips SET 
                code = ?,
                deposit_date = ?,
                status = ?,
                vender_name = ?,
                vender_id = ?,
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                code,
                deposit_date,
                status,
                vender_name,
                vender_id,
                remarks,  
                id,
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
            `INSERT INTO deposit_slips 
            (code, remarks, deposit_date, status, vender_name, vender_id, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                remarks,
                deposit_date,
                status,
                vender_name,
                vender_id,           ],
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

function deleteDepositSlipById(id, callback) {
    const sql = "DELETE FROM deposit_slips WHERE id = ?";
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editDepositSlip(id, callback) {
    const sql = "SELECT * FROM deposit_slips WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = 
    `CREATE TABLE IF NOT EXISTS deposit_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255) DEFAULT NULL,
        remarks VARCHAR(255),
        status VARCHAR(255),
        deposit_date DATE NULL,
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

function searchDepositSlips(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM deposit_slips 
        WHERE code LIKE ?
        OR vender_name LIKE ? 
        OR vender_id LIKE ?
        `;
        // params = [`%${query}%`, `%${query}%`, `%${query}%`];
        params = Array(2).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM deposit_slips`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadDepositSlips,
    getDepositSlipById,
    saveDepositSlip,
    deleteDepositSlipById,
    editDepositSlip,
    initializeDatabase,
    searchDepositSlips
};
