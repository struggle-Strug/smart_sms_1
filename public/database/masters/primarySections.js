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
    const { id, name, remarks } = primarySectionData;

    if (id) {
        db.run(
            `UPDATE primary_sections SET name = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO primary_sections (name, remarks, created, updated) VALUES (?, ?, datetime('now'), datetime('now'))`,
            [name, remarks],
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

module.exports = { loadPrimarySections, getPrimarySectionById, savePrimarySection, deletePrimarySectionById, editPrimarySection, initializeDatabase };
