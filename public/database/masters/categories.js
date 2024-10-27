const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    console.log("initializeDatabase");
    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) DEFAULT NULL,
            code VARCHAR(255) DEFAULT NULL,
            updated VARCHAR(255),
            created VARCHAR(255)
        )
    `);
}

function loadCategories(callback) {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        callback(err, rows);
    });
}

function getCategoryById(id, callback) {
    db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveCategory(categoryData, callback) {
    const { id, name, code } = categoryData;

    if (id) {
        db.run(
            `UPDATE categories SET name = ?, code = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO categories (name, code, created, updated) VALUES (?, ?, datetime('now'), datetime('now'))`,
            [name, code],
            callback
        );
    }
}

function deleteCategoryById(id, callback) {
    db.run('DELETE FROM categories WHERE id = ?', [id], callback);
}

function editCategory(id, callback) {
    getCategoryById(id, callback);
}

function searchCategories(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM categories 
        WHERE name LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM categories`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = { loadCategories, getCategoryById, saveCategory, deleteCategoryById, editCategory, initializeDatabase, searchCategories };
