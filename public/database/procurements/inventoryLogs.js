const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// inventory_logsテーブルのデータを取得
function loadInventoryLogs(callback) {
  const sql = `SELECT * FROM inventory_logs`;
  db.all(sql, [], (err, rows) => {
      callback(err, rows);
  });
}

// inventory_logsテーブルに新しいデータを追加
function saveInventoryLog(logData, callback) {
  const {
      number,
      storage_facility_id,
      product_id,
      product_name,
      lot_number,
      action,
  } = logData;

  const insertSql = `
      INSERT INTO inventory_logs 
      (number, storage_facility_id, product_id, product_name, lot_number, action, created, updated) 
      VALUES 
      (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;
  db.run(insertSql, [number, storage_facility_id, product_id, product_name, lot_number, action], function (err) {
      if (err) {
          return callback(err);
      }
      // 挿入したレコードのIDを返す
      callback(null, { lastID: this.lastID });
  });
}

// inventory_logsテーブルの特定のレコードを削除
function deleteInventoryLogById(id, callback) {
  const sql = `DELETE FROM inventory_logs WHERE id = ?`;
  db.run(sql, [id], (err) => {
      callback(err);
  });
}

// inventory_logsテーブルの特定のレコードを取得
function editInventoryLog(id, callback) {
  const sql = `SELECT * FROM inventory_logs WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
      callback(err, row);
  });
}

// inventory_logsテーブルの初期化
function initializeDatabase() {
  const sql = `
  CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER DEFAULT NULL,
      storage_facility_id INTEGER DEFAULT NULL,
      product_id INTEGER DEFAULT NULL,
      product_name STRING DEFAULT NULL,
      lot_number INTEGER DEFAULT NULL,
      action STRING DEFAULT NULL,
      created DATE DEFAULT CURRENT_DATE,
      updated DATE DEFAULT CURRENT_DATE
  )
  `;
  db.run(sql);
}

// inventory_logsテーブルを検索
function searchInventoryLogs(query, callback) {
  let sql;
  let params = [];

  // 検索クエリがある場合は各カラムをLIKEで検索
  if (query && query.trim() !== '') {
      sql = `
      SELECT * FROM inventory_logs 
      WHERE product_name LIKE ?
      OR action LIKE ? 
      `;
      params = Array(2).fill(`%${query}%`);
  } else {
      sql = `SELECT * FROM inventory_logs`;
  }

  db.all(sql, params, (err, rows) => {
      callback(err, rows);
  });
}

function getGroupedInventoryLogs(callback) {
    const sql = `
        SELECT 
            product_id,
            storage_facility_id,
            SUM(number) AS total_number
        FROM 
            inventory_logs
        GROUP BY 
            product_id, 
            storage_facility_id
        ORDER BY 
            product_id, 
            storage_facility_id;
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
}

function getFilteredInventoryLogs(conditions, callback) {
    // 基本のSQLクエリ
    let sql = `
        SELECT 
            invl.product_id AS product_code,
            p.name AS product_name,
            COALESCE(SUM(CASE WHEN invl.action = '入荷' AND invl.created < ? THEN invl.number ELSE 0 END), 0) 
                - COALESCE(SUM(CASE WHEN invl.action = '出荷' AND invl.created < ? THEN invl.number ELSE 0 END), 0) AS previous_stock, -- 前月末在庫
            COALESCE(SUM(CASE WHEN invl.action = '入荷' AND invl.created BETWEEN ? AND ? THEN invl.number ELSE 0 END), 0) AS monthly_in, -- 当月入荷
            COALESCE(SUM(CASE WHEN invl.action = '出荷' AND invl.created BETWEEN ? AND ? THEN invl.number ELSE 0 END), 0) AS monthly_out, -- 当月出荷
            COALESCE(SUM(CASE WHEN invl.action = '入荷' AND invl.created < ? THEN invl.number ELSE 0 END), 0) 
                - COALESCE(SUM(CASE WHEN invl.action = '出荷' AND invl.created < ? THEN invl.number ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN invl.action = '入荷' AND invl.created BETWEEN ? AND ? THEN invl.number ELSE 0 END), 0)
                - COALESCE(SUM(CASE WHEN invl.action = '出荷' AND invl.created BETWEEN ? AND ? THEN invl.number ELSE 0 END), 0) AS end_stock -- 当月末在庫
        FROM 
            inventory_logs invl
        LEFT JOIN 
            products p ON p.id = invl.product_id
        WHERE 
            1=1
    `;

    // 動的に条件を追加
    const params = [];

    if (conditions["created"]) {
        // `created` の値を `YYYY-MM` として想定
        const [year, month] = conditions["created"].split('-');
        const firstDayOfMonth = `${year}-${month}-01`; // 当月の開始日
        const lastDayOfMonth = new Date(year, month, 0).toISOString().split('T')[0]; // 当月の終了日（末日）
        const lastDayOfPreviousMonth = new Date(year, month - 1, 0).toISOString().split('T')[0]; // 前月末日

        // 前月末在庫用
        params.push(lastDayOfPreviousMonth); // 入荷
        params.push(lastDayOfPreviousMonth); // 出荷

        // 当月入荷・出荷用
        params.push(firstDayOfMonth); // 当月開始日
        params.push(lastDayOfMonth);  // 当月終了日
        params.push(firstDayOfMonth); // 当月開始日
        params.push(lastDayOfMonth);  // 当月終了日

        // 当月末在庫の再計算用
        params.push(lastDayOfPreviousMonth); // 前月末日（入荷計算用）
        params.push(lastDayOfPreviousMonth); // 前月末日（出荷計算用）
        params.push(firstDayOfMonth); // 当月開始日
        params.push(lastDayOfMonth);  // 当月終了日
        params.push(firstDayOfMonth); // 当月開始日
        params.push(lastDayOfMonth);  // 当月終了日
    }

    // 他の条件をWHERE句に追加
    if (conditions["p.name"]) {
        sql += ` AND p.name LIKE ?`;
        params.push(`%${conditions["p.name"]}%`);
    }
    if (conditions["p.classification_primary"]) {
        sql += ` AND p.classification_primary = ?`;
        params.push(conditions["p.classification_primary"]);
    }
    if (conditions["p.classification_secondary"]) {
        sql += ` AND p.classification_secondary = ?`;
        params.push(conditions["p.classification_secondary"]);
    }
    if (conditions["invl.facility_storage"]) {
        sql += ` AND invl.storage_facility_id = ?`;
        params.push(conditions["invl.facility_storage"]);
    }
    if (conditions["invl.lot_number"]) {
        sql += ` AND invl.lot_number = ?`;
        params.push(conditions["invl.lot_number"]);
    }

    // グループ化と並び替え
    sql += `
        GROUP BY 
            invl.product_id, 
            p.name
        ORDER BY 
            invl.product_id;
    `;

    // データベースクエリを実行
    db.all(sql, params, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
}



module.exports = {
  loadInventoryLogs,
  saveInventoryLog,
  deleteInventoryLogById,
  editInventoryLog,
  initializeDatabase,
  searchInventoryLogs,
  getGroupedInventoryLogs,
  getFilteredInventoryLogs
};
