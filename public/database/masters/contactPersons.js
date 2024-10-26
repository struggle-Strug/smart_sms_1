const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS contact_persons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(255) DEFAULT NULL,
            department VARCHAR(255),
            position VARCHAR(255),
            phone_number INTEGER,
            email VARCHAR(255),
            remarks VARCHAR(255),
            created DATE DEFAULT CURRENT_TIMESTAMP,
            updated DATE DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

// すべての担当者情報を取得する関数
function loadContactPersons(callback) {
    const sql = `SELECT * FROM contact_persons`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// 特定の担当者情報をIDで取得する関数
function getContactPersonById(id, callback) {
    const sql = `SELECT * FROM contact_persons WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

// 担当者情報を保存または更新する関数
function saveContactPerson(contactPerson, callback) {
    const { id, name, code, department, position, phone_number, email, remarks } = contactPerson;

    if (id) {
        // 既存の担当者情報を更新
        const sql = `UPDATE contact_persons
                     SET name = ?, code = ?, department = ?, position = ?, phone_number = ?, email = ?, remarks = ?, updated = CURRENT_TIMESTAMP
                     WHERE id = ?`;
        db.run(sql, [name, code,  department, position, phone_number, email, remarks, id], function(err) {
            if (err) {
                console.error(err.message);
                callback(err);
            } else {
                callback(null);
            }
        });
    } else {
        // 新しい担当者情報を挿入
        const sql = `INSERT INTO contact_persons (name, code, department, position, phone_number, email, remarks, created, updated)
                     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
        db.run(sql, [name, code, department, position, phone_number, email, remarks], function(err) {
            if (err) {
                console.error(err.message);
                callback(err);
            } else {
                callback(null);
            }
        });
    }
}

// 特定の担当者情報をIDで削除する関数
function deleteContactPersonById(id, callback) {
    const sql = `DELETE FROM contact_persons WHERE id = ?`;
    db.run(sql, [id], function(err) {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null);
        }
    });
}

// 特定の担当者情報を編集するためにIDで取得する関数
function editContactPerson(id, callback) {
    getContactPersonById(id, callback);
}

function searchContactPersons(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM contact_persons 
        WHERE name LIKE ? 
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM contact_persons`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


// モジュールエクスポート
module.exports = {
    initializeDatabase,
    loadContactPersons,
    getContactPersonById,
    saveContactPerson,
    deleteContactPersonById,
    editContactPerson,
    searchContactPersons,
};
