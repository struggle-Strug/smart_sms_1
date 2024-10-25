const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// deposit_slips の操作
function loadDepositSlips(callback) {
    const sql = `SELECT * FROM deposit_slips`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getDepositSlipById(id, callback) {
    const sql = `SELECT * FROM deposit_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveDepositSlip(depositSlipData, callback) {
    const { id, remarks } = depositSlipData;

    if (id) {
        db.run(
            `UPDATE deposit_slips SET 
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO deposit_slips 
            (remarks, created, updated) 
            VALUES (?, datetime('now'), datetime('now'))`,
            [remarks],
            callback
        );
    }
}

function deleteDepositSlipById(id, callback) {
    const sql = `DELETE FROM deposit_slips WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editDepositSlip(id, callback) {
    const sql = `SELECT * FROM deposit_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDepositSlipsDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS deposit_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        remarks VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

// deposit_slip_details の操作
function loadDepositSlipDetails(callback) {
    const sql = `SELECT * FROM deposit_slip_details`;
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
        data_category
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
                data_category,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO deposit_slip_details 
            (deposit_slip_id, deposit_date, vender_id, vender_name, claim_id, deposit_method, deposits, commission_fee, data_category, created, updated) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                deposit_slip_id,
                deposit_date,
                vender_id,
                vender_name,
                claim_id,
                deposit_method,
                deposits,
                commission_fee,
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

function editDepositSlipDetail(id, callback) {
    const sql = `SELECT * FROM deposit_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDepositSlipDetailsDatabase() {
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
        data_category VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

module.exports = {
    loadDepositSlips,
    getDepositSlipById,
    saveDepositSlip,
    deleteDepositSlipById,
    editDepositSlip,
    initializeDepositSlipsDatabase,
    loadDepositSlipDetails,
    getDepositSlipDetailById,
    saveDepositSlipDetail,
    deleteDepositSlipDetailById,
    editDepositSlipDetail,
    initializeDepositSlipDetailsDatabase
};
