const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS delivery_customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_primary VARCHAR(255) NOT NULL,
            name_secondary VARCHAR(255) DEFAULT NULL,
            code VARCHAR(255) DEFAULT NULL,
            honorific VARCHAR(255) DEFAULT NULL,
            phone_number INTEGER NOT NULL,
            fax_number INTEGER DEFAULT NULL,
            zip_code VARCHAR(255) DEFAULT NULL,
            address VARCHAR(255) NOT NULL,
            email VARCHAR(255) DEFAULT NULL,
            remarks VARCHAR(255) DEFAULT NULL,
            billing_code VARCHAR(255) NOT NULL,
            billing_information VARCHAR(255) DEFAULT NULL,
            monthly_sales_target INTEGER DEFAULT NULL,
            created DATE NOT NULL,
            updated DATE NOT NULL
        )
    `);
}

function loadDeliveryCustomers(callback) {
    db.all('SELECT * FROM delivery_customers', [], callback);
}

function getDeliveryCustomerById(id, callback) {
    db.get('SELECT * FROM delivery_customers WHERE id = ?', [id], callback);
}

function saveDeliveryCustomer(customerData, callback) {
    const { id, name_primary, name_secondary, code, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target } = customerData;

    if (id) {
        db.run(
            `UPDATE delivery_customers SET name_primary = ?, name_secondary = ?, code = ?, honorific = ?, phone_number = ?, fax_number = ?, zip_code = ?, address = ?, email = ?, remarks = ?, billing_code = ?, billing_information = ?, monthly_sales_target = ?, updated = datetime('now') WHERE id = ?`,
            [name_primary, name_secondary, code, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO delivery_customers (name_primary, name_secondary, code, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name_primary, name_secondary, code, honorific, phone_number, fax_number, zip_code, address, email, remarks, billing_code, billing_information, monthly_sales_target],
            callback
        );
    }
}


function deleteDeliveryCustomerById(id, callback) {
    db.run('DELETE FROM delivery_customers WHERE id = ?', [id], callback);
}

function searchDeliveryCustomers(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM delivery_customers 
        WHERE name_primary LIKE ? 
        OR name_secondary LIKE ? 
        OR id LIKE ? 
        `;
        params = [
            `%${query}%`, `%${query}%`, `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM delivery_customers`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadDeliveryCustomers,
    getDeliveryCustomerById,
    saveDeliveryCustomer,
    deleteDeliveryCustomerById,
    searchDeliveryCustomers,
};
