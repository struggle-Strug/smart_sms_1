
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadEstimationSlips(page, callback) {
  const pageSize = 10;
  const offset = page;
  const sql = `SELECT * FROM estimation_slips LIMIT ? OFFSET ?;`;
  db.all(sql, [pageSize, offset], (err, rows) => {
        callback(err, rows);
    });
}

function getEstimationSlipById(id, callback) {
    const sql = `SELECT * FROM estimation_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveEstimationSlip(estimationData, callback) {
    const {
        id,
        code,
        estimation_date,
        estimation_due_date,
        estimation_id,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        remarks,
        estimated_delivery_date,
        closing_date,
        deposit_due_date,
        deposit_method
    } = estimationData;

    if (id) {
        db.run(
            `UPDATE estimation_slips SET 
                code = ?,
                estimation_date = ?, 
                estimation_due_date = ?, 
                estimation_id = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                remarks = ?, 
                estimated_delivery_date = ?, 
                closing_date = ?, 
                deposit_due_date = ?, 
                deposit_method = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                code,
                estimation_date,
                estimation_due_date,
                estimation_id,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                remarks,
                estimated_delivery_date,
                closing_date,
                deposit_due_date,
                deposit_method,
                id
            ],

            // callback
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                callback(null, { lastID: id });
            }
        );
    } else {
        console.log("@@@@@@@@@@@@@@@update@@@@@@@@@@@@@@@@@@@@");
        db.run(
            `INSERT INTO estimation_slips 
            (code, estimation_date, estimation_due_date, estimation_id, vender_id, vender_name, honorific, vender_contact_person, remarks, estimated_delivery_date, closing_date, deposit_due_date, deposit_method, created, updated) 
            VALUES 
            (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                code,
                estimation_date,
                estimation_due_date,
                estimation_id,
                vender_id,
                vender_name,
                honorific,
                vender_contact_person,
                remarks,
                estimated_delivery_date,
                closing_date,
                deposit_due_date,
                deposit_method
            ],

            // callback
            function (err) {
                if (err) {
                    return callback(err);
                }
                // 更新のため、IDをそのまま返す
                console.log("@@@@@@@@@@@@@@@this lastID@@@@@@@@@@@@@@@@@@@@");
                console.log(this.lastID);
                callback(null, { lastID: this.lastID });
            }
        );
    }
}

function deleteEstimationSlipById(id, callback) {
    const sql = `DELETE FROM estimation_slips WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editEstimationSlip(id, callback) {
    const sql = `SELECT * FROM estimation_slips WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS estimation_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255) DEFAULT NULL,
        estimation_date DATE,
        estimation_due_date DATE,
        estimation_id VARCHAR(255),
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255),
        vender_contact_person VARCHAR(255),
        remarks VARCHAR(255),
        estimated_delivery_date DATE,
        closing_date DATE,
        deposit_due_date DATE,
        deposit_method VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchEstimationSlips(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM estimation_slips 
        WHERE vender_name LIKE ? OR estimation_id LIKE ? OR vender_contact_person LIKE ?
        `;
        // params = [`%${query}%`, `%${query}%`, `%${query}%`];
        params = Array(2).fill(`%${query}%`);
    } else {
        sql = `SELECT * FROM estimation_slips`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    loadEstimationSlips,
    getEstimationSlipById,
    saveEstimationSlip,
    deleteEstimationSlipById,
    editEstimationSlip,
    initializeDatabase,
    searchEstimationSlips
};
