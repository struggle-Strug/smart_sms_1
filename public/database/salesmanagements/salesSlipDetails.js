const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

function loadSalesSlipDetails(callback) {
    const sql = `SELECT ssd.*, ss.*, p.*, p.created AS product_created, ss.created AS ss_created, ssd.created AS ssd_created
    FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
    LEFT JOIN customers c ON ss.vender_id = c.id
`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getSalesSlipDetailById(id, callback) {
    const sql = `SELECT * FROM sales_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function saveSalesSlipDetail(salesSlipDetailData, callback) {
    const {
        id,
        sales_slip_id,
        product_id,
        product_name,
        number,
        unit,
        unit_price,
        tax_rate,
        lot_number,
        storage_facility,
        stock,
        gross_profit,
        gross_margin_rate,
        created,
        updated
    } = salesSlipDetailData;

    if (id) {
        db.run(
            `UPDATE sales_slip_details SET 
                sales_slip_id = ?, 
                product_id = ?, 
                product_name = ?, 
                number = ?, 
                unit = ?, 
                unit_price = ?, 
                tax_rate = ?, 
                lot_number = ?, 
                storage_facility = ?, 
                stock = ?, 
                gross_profit = ?, 
                gross_margin_rate = ?, 
                updated = datetime('now') 
            WHERE id = ?`,
            [
                sales_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                tax_rate,
                lot_number,
                storage_facility,
                stock,
                gross_profit,
                gross_margin_rate,
                id
            ],
            callback
        );
    } else {
        db.run(
            `INSERT INTO sales_slip_details 
            (sales_slip_id, product_id, product_name, number, unit, unit_price, tax_rate, lot_number, storage_facility, stock, gross_profit, gross_margin_rate, created, updated) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                sales_slip_id,
                product_id,
                product_name,
                number,
                unit,
                unit_price,
                tax_rate,
                lot_number,
                storage_facility,
                stock,
                gross_profit,
                gross_margin_rate
            ],
            callback
        );
    }
}

function deleteSalesSlipDetailsBySlipId(salesSlipId, callback) {
    const sql = `
        DELETE FROM sales_slip_details
        WHERE sales_slip_id = ?
    `;
    db.run(sql, [salesSlipId], (err) => {
        callback(err);
    });
}


function deleteSalesSlipDetailById(id, callback) {
    const sql = `DELETE FROM sales_slip_details WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
    });
}

function editSalesSlipDetail(id, callback) {
    const sql = `SELECT * FROM sales_slip_details WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function searchSalesSlipsBySalesSlipId(query, callback) {
    let sql;
    let params = [];

    if (query && query.trim() !== '') {
        sql = `
        SELECT * FROM sales_slip_details 
        WHERE sales_slip_id LIKE ?
        `;
        params = [`%${query}%`];
    } else {
        sql = `SELECT * FROM sales_slip_details`;
    }
    db.all(sql, params, (err, rows) => {
        callback(err, rows);
    });
}


function initializeDatabase() {
    const sql = `
    CREATE TABLE IF NOT EXISTS sales_slip_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sales_slip_id INTEGER,
        product_id INTEGER,
        product_name VARCHAR(255),
        customer_id INTEGER,
        customer_name VARCHAR(255),
        number INTEGER,
        unit VARCHAR(255) NULL,
        unit_price INTEGER,
        tax_rate INTEGER,
        lot_number INTEGER NULL,
        storage_facility VARCHAR(255),
        stock INTEGER NULL,
        gross_profit INTEGER NULL,
        gross_margin_rate INTEGER NULL,
        created DATE DEFAULT CURRENT_DATE,
        updated DATE DEFAULT CURRENT_DATE
    )`;
    db.run(sql);
}

function searchSalesSlipDetails(conditions, callback) {
    let sql = `SELECT ssd.*, ss.*, p.*, c.*, pc.code AS parent_code, c.id AS customer_id, pc.name_primary AS parent_name, pc.id AS parent_id,  pc.zip_code AS parent_zip_code, pc.address AS parent_address, p.created AS product_created, ss.created AS ss_created, ssd.created AS ssd_created
    FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
    LEFT JOIN customers c ON ss.vender_id = c.id
    LEFT JOIN customers pc ON c.billing_code = pc.code
    `;

    let whereClauses = [];
    let params = [];

    // 条件オブジェクトのキーと値を動的にWHERE句に追加
    if (conditions && Object.keys(conditions).length > 0) {
        for (const [column, value] of Object.entries(conditions)) {
            if (column === 'ssd.created_start') {
                whereClauses.push(`ssd_created >= ?`);
                params.push(value);
            } else if (column === 'ssd.created_end') {
                whereClauses.push(`ssd_created <= ?`);
                params.push(value);
            } else if (column === 'ss.sales_date_start') {
                whereClauses.push(`sales_date >= ?`);
                params.push(value);
            } else if (column === 'ss.sales_date_end') {
                whereClauses.push(`sales_date <= ?`);
                params.push(value);
            } else {
                whereClauses.push(`${column} LIKE ?`);
                params.push(`%${value}%`);
            }
        }
    }

    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(" AND ");
    }

    db.all(sql, params, (err, rows) => {
        console.log(rows)
        callback(err, rows);
    });
}


function getMonthlySalesWithJoin(conditions, callback) {
    searchSalesSlipDetails(conditions, (err, rows) => {
        if (err) {
            callback(err);
            return;
        }

        // 月ごとの売上を格納するオブジェクト
        const monthlySales = {};

        rows.forEach(row => {
            // 月単位でデータをグループ化
            const month = row.created ? row.created.substring(0, 7) : null; // "YYYY-MM"形式

            if (month) {
                // 単価 × 数量で売上を計算
                const saleAmount = row.unit_price * row.number;

                if (!monthlySales[month]) {
                    monthlySales[month] = saleAmount;
                } else {
                    monthlySales[month] += saleAmount;
                }
            }
        });

        // 月ごとの売上データを配列に変換
        const result = Object.keys(monthlySales).map(month => ({
            month,
            total_sales: monthlySales[month]
        }));

        callback(null, result);
    });
}

function getMonthlySales(data, callback) {
    const { venderIds, formattedDate } = data;
    const placeholders = venderIds.map(() => '?').join(', ');
    const sql = `
    SELECT ssd.sales_slip_id, SUM(ssd.unit_price * ssd.number) AS total_sales, ss.vender_id AS vender_id
    FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
    LEFT JOIN customers c ON ss.vender_id = c.id
    WHERE ss.vender_id IN (${placeholders})
    AND strftime('%Y-%m', ss.sales_date) = strftime('%Y-%m', ?)
    GROUP BY ss.vender_id
`;

    db.all(sql, [...venderIds, formattedDate], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(err, rows); // 各sales_slip_idごとにtotal_salesが出力されます
        }
    });
}

function getMonthlySalesInTax(data, callback) {
    const { venderIds, formattedDate } = data;
    const placeholders = venderIds.map(() => '?').join(', ');
    const sql = `
    SELECT ssd.sales_slip_id, SUM(ssd.unit_price * ssd.number * (ssd.tax_rate*0.01 + 1)) AS total_sales, ss.vender_id AS vender_id
    FROM sales_slip_details ssd
    LEFT JOIN sales_slips ss ON ssd.sales_slip_id = ss.id
    LEFT JOIN products p ON ssd.product_id = p.id
    LEFT JOIN customers c ON ss.vender_id = c.id
    WHERE ss.vender_id IN (${placeholders})
    AND strftime('%Y-%m', ss.sales_date) = strftime('%Y-%m', ?)
    GROUP BY ss.vender_id
`;
    db.all(sql, [...venderIds, formattedDate], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(err, rows); // 各sales_slip_idごとにtotal_salesが出力されます
        }
    });
}




module.exports = {
    loadSalesSlipDetails,
    getSalesSlipDetailById,
    saveSalesSlipDetail,
    deleteSalesSlipDetailById,
    editSalesSlipDetail,
    initializeDatabase,
    deleteSalesSlipDetailsBySlipId,
    searchSalesSlipsBySalesSlipId,
    searchSalesSlipDetails,
    getMonthlySalesWithJoin,
    getMonthlySales,
    getMonthlySalesInTax
};
