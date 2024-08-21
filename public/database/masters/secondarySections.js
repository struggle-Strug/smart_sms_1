const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// Secondary Sections CRUD operations
function loadSecondarySections(callback) {
    db.all('SELECT * FROM secondary_sections', callback);
}

function getSecondarySectionById(id, callback) {
    db.get('SELECT * FROM secondary_sections WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

function saveSecondarySection(sectionData, callback) {
    const { id, name, remarks } = sectionData;

    if (id) {
        db.run(
            `UPDATE secondary_sections SET name = ?, remarks = ?, updated = datetime('now') WHERE id = ?`,
            [name, remarks, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO secondary_sections (name, remarks, created, updated) VALUES (?, ?, datetime('now'), datetime('now'))`,
            [name, remarks],
            callback
        );
    }
}

function deleteSecondarySectionById(id, callback) {
    db.run('DELETE FROM secondary_sections WHERE id = ?', [id], callback);
}

function editSecondarySection(id, callback) {
    getSecondarySectionById(id, callback);
}

function initializeDatabase() {
    console.log("initializeDatabase for secondary_sections");
    db.run(`
        CREATE TABLE IF NOT EXISTS secondary_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            created DATE DEFAULT (datetime('now')),
            updated DATE DEFAULT (datetime('now'))
        )
    `);
}


module.exports = {
    loadSecondarySections,
    getSecondarySectionById,
    saveSecondarySection,
    deleteSecondarySectionById,
    editSecondarySection,
    initializeDatabase
};
