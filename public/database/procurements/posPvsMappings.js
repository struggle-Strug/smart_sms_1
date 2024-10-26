const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// テーブルの全データをロードする関数
function loadPosPvsMappings(callback) {
    const sql = `SELECT * FROM pos_pvs_mappings`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

// IDに基づいてデータを取得する関数
function getPosPvsMappingById(id, callback) {
    const sql = `SELECT * FROM pos_pvs_mappings WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

// 新規レコードを挿入または既存レコードを更新する関数
function savePosPvsMapping(mappingData, callback) {
    const {
        id,
        pos_id,
        pvs_id
    } = mappingData;

    if (id) {
        // IDが存在するかチェック
        db.get(
            `SELECT id FROM pos_pvs_mappings WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    return callback(err);
                }

                if (row) {
                    // レコードが存在する場合はUPDATE
                    db.run(
                        `UPDATE pos_pvs_mappings SET 
                            pos_id = ?, 
                            pvs_id = ?, 
                            updated = datetime('now') 
                        WHERE id = ?`,
                        [
                            pos_id,
                            pvs_id,
                            id
                        ],
                        callback
                    );
                } else {
                    // レコードが存在しない場合はINSERT
                    db.run(
                        `INSERT INTO pos_pvs_mappings 
                        (pos_id, pvs_id, created, updated) 
                        VALUES 
                        (?, ?, datetime('now'), datetime('now'))`,
                        [
                            pos_id,
                            pvs_id
                        ],
                        callback
                    );
                }
            }
        );
    } else {
        // IDが存在しない場合は新規追加 (INSERT)
        db.run(
            `INSERT INTO pos_pvs_mappings 
            (pos_id, pvs_id, created, updated) 
            VALUES 
            (?, ?, datetime('now'), datetime('now'))`,
            [
                pos_id,
                pvs_id
            ],
            callback
        );
    }
}


// IDに基づいてレコードを削除する関数
function deletePosPvsMappingById(id, callback) {
    const sql = `DELETE FROM pos_pvs_mappings WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

// IDに基づいてデータを編集する関数
function editPosPvsMapping(id, callback) {
    const sql = `SELECT * FROM pos_pvs_mappings WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

// テーブルを初期化する関数
function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS pos_pvs_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pos_id VARCHAR(255),
        pvs_id VARCHAR(255),
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )
    `;
    db.run(sql);
}

// 検索機能
function searchPosPvsMappings(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM pos_pvs_mappings 
        WHERE pos_id LIKE ? OR pvs_id LIKE ?
        `;
        params = [`%${query}%`, `%${query}%`];
    } else {
        sql = `SELECT * FROM pos_pvs_mappings`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

// 検索機能
function searchPosPvsMappingsByPos(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM pos_pvs_mappings 
        WHERE pos_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM pos_pvs_mappings`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchPosPvsMappingsByPvsId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM pos_pvs_mappings 
        WHERE pvs_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM pos_pvs_mappings`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function deletePosPvsMappingsByPvsId(paymentVoucherId, callback) {
    const sql = `
        DELETE FROM pos_pvs_mappings
        WHERE pvs_id = ?
    `;
    db.run(sql, [paymentVoucherId], (err) => {
        callback(err);
    });
}

module.exports = {
    loadPosPvsMappings,
    getPosPvsMappingById,
    savePosPvsMapping,
    deletePosPvsMappingById,
    editPosPvsMapping,
    initializeDatabase,
    searchPosPvsMappings,
    searchPosPvsMappingsByPvsId,
    deletePosPvsMappingsByPvsId,
    searchPosPvsMappingsByPos
};
