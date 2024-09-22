const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadCustomers(callback) {
    db.all('SELECT * FROM customers', [], callback);
}

function getCustomerById(id, callback) {
    db.get('SELECT * FROM customers WHERE id = ?', [id], callback);
}

function saveCustomer(customerData, callback) {
    const { id, name_primary, name_secondary, name_kana, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target } = customerData;

    if (id) {
        db.run(
            `UPDATE customers SET name_primary = ?, name_secondary = ?, name_kana = ?, honorific = ?, phone_number = ?, fax_number = ?, zip_code = ?, address = ?, email = ?, remarks = ?, billing_code = ?, billing_information = ?, monthly_sales_target = ?, updated = datetime('now') WHERE id = ?`,
            [name_primary, name_secondary, name_kana, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO customers (name_primary, name_secondary, name_kana, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name_primary, name_secondary, name_kana, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target],
            callback
        );
    }
}

function deleteCustomerById(id, callback) {
    db.run('DELETE FROM customers WHERE id = ?', [id], callback);
}

function searchCustomers(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM customers 
        WHERE name_primary LIKE ? 
        OR name_secondary LIKE ? 
        OR name_kana LIKE ? 
        OR id LIKE ? 
        `;
        params = [
            `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, 
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM customers`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    loadCustomers,
    getCustomerById,
    saveCustomer,
    deleteCustomerById,
    searchCustomers
};
