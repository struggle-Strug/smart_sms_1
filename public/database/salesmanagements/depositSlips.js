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
        remarks
    } = depositSlipData;

    if (id) {
        db.run(
            `UPDATE deposit_slips SET 
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                remarks,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO deposit_slips 
            (remarks, created, updated) 
            VALUES (?, datetime('now'), datetime('now'))`,
            [
                remarks
            ],
            callback
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
        remarks VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

module.exports = {
    loadDepositSlips,
    getDepositSlipById,
    saveDepositSlip,
    deleteDepositSlipById,
    editDepositSlip,
    initializeDatabase
};
