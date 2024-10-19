const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadStatementSettings(callback) {
    const sql = `SELECT * FROM statement_settings`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getStatementSettingById(id, callback) {
    const sql = `SELECT * FROM statement_settings WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveStatementSetting(settingData, callback) {
    const {
        id,
        output_format,
        remarks
    } = settingData;

    if (id) {
        db.run(
            `UPDATE statement_settings SET 
                output_format = ?, 
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                output_format,
                remarks,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO statement_settings 
            (output_format, remarks, created, updated) 
            VALUES 
            (?, ?, datetime('now'), datetime('now'))`,
            [
                output_format,
                remarks
            ],
            callback
        );
    }
}

function deleteStatementSettingById(id, callback) {
    const sql = `DELETE FROM statement_settings WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editStatementSetting(id, callback) {
    const sql = `SELECT * FROM statement_settings WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS statement_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        output_format VARCHAR(255) DEFAULT 'csv',
        remarks VARCHAR(255) DEFAULT 'null',
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

module.exports = {
    loadStatementSettings,
    getStatementSettingById,
    saveStatementSetting,
    deleteStatementSettingById,
    editStatementSetting,
    initializeDatabase
};
