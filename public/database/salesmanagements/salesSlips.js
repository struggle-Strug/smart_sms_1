const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadSalesSlips(page, callback) {
  const pageSize = 10;
  const offset = page;
  const sql = `SELECT * FROM sales_slips LIMIT ? OFFSET ?`;
  db.all(sql, [pageSize, offset], (err, rows) => {
    callback(err, rows);
  });
}

function getSalesSlipById(id, callback) {
  const sql = `SELECT * FROM sales_slips WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    callback(err, row);
  });
}

function saveSalesSlip(salesSlipData, callback) {
  const {
    id,
    code,
    sales_date,
    delivery_due_date,
    vender_id,
    vender_name,
    honorific,
    vender_contact_person,
    order_slip_id,
    order_id,
    remarks,
    closing_date,
    deposit_due_date,
    deposit_method,
    created,
    updated
  } = salesSlipData;

  if (id) {
    db.run(
      `UPDATE sales_slips SET 
                code = ?,
                sales_date = ?, 
                delivery_due_date = ?, 
                vender_id = ?, 
                vender_name = ?, 
                honorific = ?, 
                vender_contact_person = ?, 
                order_slip_id = ?, 
                order_id = ?, 
                remarks = ?, 
                closing_date = ?, 
                deposit_due_date = ?, 
                deposit_method = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
      [
        code,
        sales_date,
        delivery_due_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        order_slip_id,
        order_id,
        remarks,
        closing_date,
        deposit_due_date,
        deposit_method,
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
    db.run(
      `INSERT INTO sales_slips 
            (code, sales_date, delivery_due_date, vender_id, vender_name, honorific, vender_contact_person, order_slip_id, order_id, remarks, closing_date, deposit_due_date, deposit_method, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        code,
        sales_date,
        delivery_due_date,
        vender_id,
        vender_name,
        honorific,
        vender_contact_person,
        order_slip_id,
        order_id,
        remarks,
        closing_date,
        deposit_due_date,
        deposit_method
      ],
      function (err) {
        if (err) {
          return callback(err);
        }
        // 更新のため、IDをそのまま返す
        callback(null, { lastID: this.lastID });
      }

    );
  }
}

function deleteSalesSlipById(id, callback) {
  const sql = `DELETE FROM sales_slips WHERE id = ?`;
  db.run(sql, [id], (err) => {
    callback(err);
  });
}

function editSalesSlip(id, callback) {
  const sql = `SELECT * FROM sales_slips WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    callback(err, row);
  });
}

function initializeDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS sales_slips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(255) DEFAULT NULL,
        sales_date DATE,
        delivery_due_date DATE NULL,
        vender_id VARCHAR(255),
        vender_name VARCHAR(255),
        honorific VARCHAR(255) NULL,
        vender_contact_person VARCHAR(255) NULL,
        order_slip_id VARCHAR(255) NULL,
        order_id VARCHAR(255) NULL,
        remarks VARCHAR(255) NULL,
        closing_date DATE NULL,
        deposit_due_date DATE NULL,
        deposit_method VARCHAR(255) NULL,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
  db.run(sql);
}

function searchSalesSlips(query, callback) {
  let sql;
  let params = [];

  if (query && query.trim() !== '') {
    sql = `
        SELECT * FROM sales_slips 
        WHERE code LIKE ?
        OR vender_name LIKE ? 
        OR vender_id LIKE ?
        `;
    // params = [`%${query}%`, `%${query}%`, `%${query}%`];
    params = Array(2).fill(`%${query}%`);
  } else {
    sql = `SELECT * FROM sales_slips`;
  }
  db.all(sql, params, (err, rows) => {
    callback(err, rows);
  });
}


module.exports = {
  loadSalesSlips,
  getSalesSlipById,
  saveSalesSlip,
  deleteSalesSlipById,
  editSalesSlip,
  initializeDatabase,
  searchSalesSlips

};
