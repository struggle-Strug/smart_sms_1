const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    console.log("initializeDatabase");
    db.run(`
        CREATE TABLE IF NOT EXISTS subcategories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) DEFAULT NULL,
            code VARCHAR(255) DEFAULT NULL,
            updated VARCHAR(255),
            created VARCHAR(255)
        )
    `);
}

function loadSubcategories(callback) {
    db.all('SELECT * FROM subcategories', [], (err, rows) => {
        callback(err, rows);
    });
}

function getSubcategoryById(id, callback) {
    db.get('SELECT * FROM subcategories WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveSubcategory(subcategoryData, callback) {
    const { id, name, code } = subcategoryData;

    if (id) {
        db.run(
            `UPDATE subcategories SET name = ?, code = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO subcategories (name, code, created, updated) VALUES (?, ?, datetime('now'), datetime('now'))`,
            [name, code],
            callback
        );
    }
}

function deleteSubcategoryById(id, callback) {
    db.run('DELETE FROM subcategories WHERE id = ?', [id], callback);
}

function editSubcategory(id, callback) {
    getSubcategoryById(id, callback);
}

function searchSubcategories(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM subcategories 
        WHERE name LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM subcategories`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = { loadSubcategories, getSubcategoryById, saveSubcategory, deleteSubcategoryById, editSubcategory, initializeDatabase, searchSubcategories };
