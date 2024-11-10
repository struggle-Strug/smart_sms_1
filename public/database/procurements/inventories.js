const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadInventories(callback) {
  const sql = `SELECT * FROM inventories`;
  db.all(sql, [], (err, rows) => {
      callback(err, rows);
  });
}

function saveInventory(inventoryData, callback) {
  const {
      id,
      product_id,
      product_name,
      lot_number,
      inventory,
      estimated_inventory,
      warning_value,
  } = inventoryData;

  if (id) {
      // IDが存在する場合は更新 (UPDATE)
      db.run(
          `UPDATE inventories SET 
                  product_id = ?,
                  product_name = ?, 
                  lot_number = ?, 
                  inventory = ?, 
                  estimated_inventory = ?, 
                  warning_value = ?, 
                  updated = datetime('now') 
              WHERE id = ?`,
          [
              product_id,
              product_name,
              lot_number,
              inventory,
              estimated_inventory,
              warning_value,
              id
          ],
          function (err) {
              if (err) {
                  return callback(err);
              }
              // 更新のため、IDをそのまま返す
              callback(null, { lastID: id });
          }
      );
  } else {
      // IDが存在しない場合は新規追加 (INSERT)
      db.run(
          `INSERT INTO inventories 
              (product_id, product_name, lot_number, inventory, estimated_inventory, warning_value, created, updated) 
              VALUES 
              (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [
              product_id,
              product_name,
              lot_number,
              inventory,
              estimated_inventory,
              warning_value,
          ],
          function (err) {
              if (err) {
                  return callback(err);
              }
              // 更新のため、IDをそのまま返す
              callback(null, { lastID: this.lastID });
          }
      );
  };
}

function deleteInventoryById(id, callback) {
  const sql = `DELETE FROM inventories WHERE id = ?`;
  db.run(sql, [id], (err) => {
      callback(err);
  });
}

function editInventory(id, callback) {
  const sql = `SELECT * FROM inventories WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
      callback(err, row);
  });
}

function initializeDatabase() {
  const sql = `
  CREATE TABLE IF NOT EXISTS inventories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id VARCHAR(255) DEFAULT NULL,
      product_name VARCHAR(255) DEFAULT NULL,
      lot_number VARCHAR(255) DEFAULT NULL,
      inventory INTEGER DEFAULT NULL,
      estimated_inventory INTEGER DEFAULT NULL,
      warning_value INTEGER DEFAULT NULL,
      created DATE DEFAULT CURRENT_DATE,
      updated DATE DEFAULT CURRENT_DATE
  )
  `;
  db.run(sql);
}

function searchInventories(query, callback) {
  let sql;
  let params = [];

  // 検索クエリがある場合は各カラムをLIKEで検索
  if (query && query.trim() !== '') {
      sql = `
      SELECT * FROM inventories 
      WHERE code LIKE ?
      OR vender_name LIKE ? 
      `;
      params = Array(2).fill(`%${query}%`);
  } else {
      sql = `SELECT * FROM purchase_orders`;
  }

  db.all(sql, params, (err, rows) => {
      callback(err, rows);
  });
}

module.exports = {
  loadInventories, 
  deleteInventoryById, 
  saveInventory, 
  editInventory, 
  initializeDatabase,
  searchInventories, 
};
