const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);


function initializeDatabase() {
    console.log("initializeDatabase")
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(255) DEFAULT NULL,
            classification_primary VARCHAR(255) NOT NULL,
            classification_secondary VARCHAR(255) DEFAULT NULL,
            jan_code VARCHAR(255) NOT NULL,
            standard_retail_price INTEGER NOT NULL,
            procurement_cost INTEGER DEFAULT NULL,
            manufacturer_name VARCHAR(255) DEFAULT NULL,
            specification VARCHAR(255) DEFAULT NULL,
            unit VARCHAR(255) DEFAULT NULL,
            country_of_origin VARCHAR(255) DEFAULT NULL,
            storage_location VARCHAR(255) DEFAULT NULL,
            storage_method VARCHAR(255) DEFAULT NULL,
            threshold INTEGER DEFAULT NULL,
            created DATE DEFAULT (datetime('now')),
            updated DATE DEFAULT (datetime('now'))
        )
    `);
}

function loadProducts(callback) {
    db.all('SELECT * FROM products', [], callback);
}

function getProductById(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], callback);
}

function saveProduct(productData, callback) {
    const { id, name, code, classification_primary, classification_secondary, jan_code, standard_retail_price, procurement_cost, manufacturer_name, specification, unit, country_of_origin, storage_location, storage_method, threshold } = productData;

    if (id) {
        db.run(
            `UPDATE products SET name = ?, code = ?, classification_primary = ?, classification_secondary = ?, jan_code = ?, standard_retail_price = ?, procurement_cost = ?, manufacturer_name = ?, specification = ?, unit = ?, country_of_origin = ?, storage_location = ?, storage_method = ?, threshold = ?, updated = datetime('now') WHERE id = ?`,
            [name, code, classification_primary, classification_secondary, jan_code, standard_retail_price, procurement_cost, manufacturer_name, specification, unit, country_of_origin, storage_location, storage_method, threshold, id],
            callback
        );
    } else {
        db.run(
            `INSERT INTO products (name, code, classification_primary, classification_secondary, jan_code, standard_retail_price, procurement_cost, manufacturer_name, specification, unit, country_of_origin, storage_location, storage_method, threshold, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [name, code,  classification_primary, classification_secondary, jan_code, standard_retail_price, procurement_cost, manufacturer_name, specification, unit, country_of_origin, storage_location, storage_method, threshold],
            callback
        );
    }
}

function deleteProductById(id, callback) {
    db.run('DELETE FROM products WHERE id = ?', [id], callback);
}

function searchProducts(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM products 
        WHERE name LIKE ? 
        OR classification_primary LIKE ? 
        OR classification_secondary LIKE ? 
        OR jan_code LIKE ? 
        OR manufacturer_name LIKE ? 
        `;
        params = [
            `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, 
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM products`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchIdProducts(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM products 
        WHERE id LIKE ?
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM products`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}

function searchNameProducts(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM products 
        WHERE name LIKE ?
        `;
        params = [
            `%${query}%`
        ];
    } else {
        // クエリが空の場合はすべてのデータを返す
        sql = `SELECT * FROM products`;
    }

    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = {
    initializeDatabase,
    loadProducts,
    getProductById,
    saveProduct,
    deleteProductById,
    searchProducts,
    searchIdProducts,
    searchNameProducts
};

