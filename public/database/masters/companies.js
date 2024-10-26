const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadCompanies(callback) {
    const sql = `SELECT * FROM companies`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getCompanyById(id, callback) {
    const sql = `SELECT * FROM companies WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveCompany(companyData, callback) {
    const {
        id,
        name,
        code,
        address,
        phone_number,
        fax_number,
        email,
        representive_name,
        bank_name,
        bank_account_number,
        bank_branch_name,
        bank_branch_code,
        zip_code,
        account_holder_name,
        account_type,
        remarks
    } = companyData;

    if (id) {
        db.run(
            `UPDATE companies SET 
                name = ?, 
                code = ?, 
                address = ?, 
                phone_number = ?, 
                fax_number = ?, 
                email = ?, 
                representive_name = ?, 
                bank_name = ?, 
                bank_account_number = ?, 
                bank_branch_name = ?, 
                bank_branch_code = ?, 
                zip_code = ?,
                account_holder_name = ?,
                account_type = ?,
                remarks = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                name,
                code,
                address,
                phone_number,
                fax_number,
                email,
                representive_name,
                bank_name,
                bank_account_number,
                bank_branch_name,
                bank_branch_code,
                zip_code,
                account_holder_name,
                account_type,
                remarks,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO companies 
            (name, code, address, phone_number, fax_number, email, representive_name, bank_name, bank_account_number, bank_branch_name, bank_branch_code, zip_code, account_holder_name, account_type, remarks, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                name,
                code,
                address,
                phone_number,
                fax_number,
                email,
                representive_name,
                bank_name,
                bank_account_number,
                bank_branch_name,
                bank_branch_code,
                zip_code,
                account_holder_name,
                account_type,
                remarks
            ],
            callback
        );
    }
}



function deleteCompanyById(id, callback) {
    const sql = `DELETE FROM companies WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editCompany(id, callback) {
    const sql = `SELECT * FROM companies WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        code VARCHAR(255) DEFAULT NULL,
        address VARCHAR(255),
        phone_number INTEGER,
        fax_number INTEGER,
        email VARCHAR(255),
        representive_name VARCHAR(255),
        bank_name VARCHAR(255),
        bank_account_number VARCHAR(255),
        bank_branch_name VARCHAR(255),
        bank_branch_code INTEGER,
        zip_code VARCHAR(255) DEFAULT NULL,
        account_holder_name VARCHAR(255) DEFAULT NULL,
        account_type VARCHAR(255),
        remarks VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

function searchCompanies(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM companies 
        WHERE name LIKE ? OR address LIKE ? OR phone_number LIKE ? OR email LIKE ? OR representive_name LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM companies`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}



module.exports = {
    loadCompanies,
    getCompanyById,
    saveCompany,
    deleteCompanyById,
    editCompany,
    initializeDatabase,
    searchCompanies
};
