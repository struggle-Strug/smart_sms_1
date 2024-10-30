const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    console.log("initializeDatabase");
    db.run(`
        CREATE TABLE IF NOT EXISTS primary_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            code VARCHAR(255) DEFAULT NULL,
            created DATE DEFAULT (datetime('now')),
            updated DATE DEFAULT (datetime('now'))
        )
    `);
}



function loadPrimarySections(callback) {
    db.all('SELECT * FROM primary_sections', [], (err, rows) => {
        callback(err, rows);
    });
}

function getPrimarySectionById(id, callback) {
    db.get('SELECT * FROM primary_sections WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function savePrimarySection(primarySectionData, callback) {
    const { id, name, code, remarks } = primarySectionData;

    if (id) {
        db.run(
            `UPDATE primary_sections SET name = ?, code = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO primary_sections (name, code, remarks, created, updated) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
            [name, code, remarks],
            callback
        );
    }
}


function deletePrimarySectionById(id, callback) {
    db.run('DELETE FROM primary_sections WHERE id = ?', [id], callback);
}

function editPrimarySection(id, callback) {
    getPrimarySectionById(id, callback);
}

function searchPrimarySections(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM primary_sections 
        WHERE name LIKE ?
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM primary_sections`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

module.exports = { loadPrimarySections, getPrimarySectionById, savePrimarySection, deletePrimarySectionById, editPrimarySection, initializeDatabase, searchPrimarySections };
