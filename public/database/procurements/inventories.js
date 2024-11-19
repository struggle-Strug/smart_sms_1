const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadInventories(callback) {
  const sql = `SELECT * FROM inventories LEFT JOIN products p ON p.id = inventories.product_id`;
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

function addInventoryNumber(inventoryData, callback) {
    const {
        product_id,
        product_name,
        lot_number,
        inventory,
        estimated_inventory,
        warning_value,
    } = inventoryData;

    // 指定された product_id を持つデータを検索
    const findSql = `SELECT * FROM inventories WHERE product_id = ?`;
    db.get(findSql, [product_id], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (row) {
            const updatedInventory = parseInt(row.estimated_inventory) + parseInt(estimated_inventory);
            const updateSql = `
                UPDATE inventories 
                SET 
                    estimated_inventory = ?, 
                    updated = datetime('now') 
                WHERE product_id = ?
            `;
            db.run(updateSql, [updatedInventory, product_id], function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { lastID: row.id, estimated_inventory: updatedInventory });
            });
        } else {
            // 既存データが見つからない場合、新しいデータを挿入
            const insertSql = `
                INSERT INTO inventories 
                (product_id, product_name, lot_number, inventory, estimated_inventory, warning_value, created, updated) 
                VALUES 
                (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `;
            db.run(insertSql, [product_id, product_name, lot_number, inventory, estimated_inventory || inventory, warning_value], function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { lastID: this.lastID, estimated_inventory: estimated_inventory || inventory });
            });
        }
    });
}

function subtractInventoryNumber(inventoryData, callback) {
    const {
        product_id,
        product_name,
        lot_number,
        inventory,
        estimated_inventory,
        warning_value,
    } = inventoryData;

    // 指定された product_id を持つデータを検索
    const findSql = `SELECT * FROM inventories WHERE product_id = ?`;
    db.get(findSql, [product_id], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (row) {
            const updatedInventory = parseInt(row.estimated_inventory) - parseInt(estimated_inventory);
            const updateSql = `
                UPDATE inventories 
                SET 
                    estimated_inventory = ?, 
                    updated = datetime('now') 
                WHERE product_id = ?
            `;
            db.run(updateSql, [updatedInventory, product_id], function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { lastID: row.id, estimated_inventory: updatedInventory });
            });
        } else {
            // 既存データが見つからない場合、新しいデータを挿入
            const insertSql = `
                INSERT INTO inventories 
                (product_id, product_name, lot_number, inventory, estimated_inventory, warning_value, created, updated) 
                VALUES 
                (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `;
            db.run(insertSql, [product_id, product_name, lot_number, inventory, estimated_inventory || inventory, warning_value], function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { lastID: this.lastID, estimated_inventory: estimated_inventory || inventory });
            });
        }
    });
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
      product_id INTEGER DEFAULT NULL,
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

function subtractInventoryByProductName(productName, quantity, callback) {
    const findSql = `SELECT * FROM inventories WHERE product_name = ? LIMIT 1`;
  
    // 商品名でデータを検索
    db.get(findSql, [productName], (err, row) => {
      if (err) {
        return callback(err);
      }
  
      if (row) {
        // 検索したデータが見つかった場合、estimated_inventoryを更新
        const updatedInventory = parseInt(row.estimated_inventory) - parseInt(quantity);
  
        // estimated_inventoryが負になる場合のエラーハンドリング
        if (updatedInventory < 0) {
          return callback(new Error('Insufficient inventory to subtract the specified quantity.'));
        }
  
        const updateSql = `
          UPDATE inventories 
          SET estimated_inventory = ?, 
              updated = datetime('now') 
          WHERE id = ?
        `;
        db.run(updateSql, [updatedInventory, row.id], function (err) {
          if (err) {
            return callback(err);
          }
          // 更新後のデータを返す
          callback(null, { id: row.id, product_name: productName, estimated_inventory: updatedInventory });
        });
      } else {
        // データが見つからない場合
        callback(new Error(`Product "${productName}" not found in inventories.`));
      }
    });
  }
  

module.exports = {
  loadInventories, 
  deleteInventoryById, 
  saveInventory, 
  editInventory, 
  initializeDatabase,
  searchInventories, 
  addInventoryNumber,
  subtractInventoryNumber,
  subtractInventoryByProductName
};
