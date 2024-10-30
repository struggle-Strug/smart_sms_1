const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);


function initializeDatabase() {
    console.log("initializeDatabase");
    db.run(`
        CREATE TABLE IF NOT EXISTS set_products (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- カラム1: セット商品名 id
            set_product_name VARCHAR(255) NOT NULL, -- カラム2: セット商品コード
            code VARCHAR(255), -- カラム2: セット商品コード
            category VARCHAR(255), -- カラム3: カテゴリー
            sub_category VARCHAR(255), -- カラム4: サブカテゴリー
            jan_code VARCHAR(255), -- カラム5: JANコード
            tax_rate INTEGER, -- カラム6: 税率
            warning_threshold INTEGER, -- カラム7: 警告値
            product_search VARCHAR(255) DEFAULT NULL, -- カラム8: 商品検索 (null可)
            set_product_contents VARCHAR(255) DEFAULT NULL, -- カラム9: セット内容 (null可)
            set_product_price VARCHAR(255) DEFAULT NULL, -- カラム10: セット販売価格 (null可)
            updated DATE DEFAULT (datetime('now')), -- カラム11: 更新日時
            created DATE DEFAULT (datetime('now')) -- カラム12: 作成日時
        )
    `);
}

function loadSetProducts(callback) {
  db.all('SELECT * FROM set_products', [], callback);
}

function getSetProductById(id, callback) {
  db.get('SELECT * FROM set_products WHERE id = ?', [id], callback);
}

function saveSetProduct(productData, callback) {
  const { id, set_product_name, category, code, sub_category, jan_code, tax_rate, warning_threshold, product_search, set_product_contents, set_product_price } = productData;

  if (id) {
      db.run(
          `UPDATE set_products SET set_product_name = ?, category = ?, code = ?, sub_category = ?, jan_code = ?, tax_rate = ?, warning_threshold = ?, product_search = ?, set_product_contents = ?, set_product_price = ?, updated = datetime('now') WHERE id = ?`,
          [set_product_name, category, code, sub_category, jan_code, tax_rate, warning_threshold, product_search, set_product_contents, set_product_price, id],
          callback
      );
  } else {
      db.run(
          `INSERT INTO set_products (set_product_name, category, code, sub_category, jan_code, tax_rate, warning_threshold, product_search, set_product_contents, set_product_price, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [set_product_name, category, code, sub_category, jan_code, tax_rate, warning_threshold, product_search, set_product_contents, set_product_price],
          callback
      );
  }
}

function deleteSetProductById(id, callback) {
  db.run('DELETE FROM set_products WHERE id = ?', [id], callback);
}


function searchSetProducts(query, callback) {
  let sql;
  let params = [];

  if (query && query.trim() !== '') {
      sql = `
      SELECT * FROM set_products 
      WHERE set_product_name LIKE ? 
      OR id LIKE ? 
      OR category LIKE ? 
      OR sub_category LIKE ? 
      OR set_product_price LIKE ? 
      `;
      params = [
          `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, 
          `%${query}%`
      ];
  } else {
      // クエリが空の場合はすべてのデータを返す
      sql = `SELECT * FROM set_products`;
  }

  db.all(sql, params, (err, rows) => {
      callback(err, rows);
  });
}


module.exports = {
  initializeDatabase,
  loadSetProducts,
  getSetProductById, 
  saveSetProduct, 
  deleteSetProductById, 
  searchSetProducts
};