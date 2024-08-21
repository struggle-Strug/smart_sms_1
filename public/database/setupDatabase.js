const { app } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_primary VARCHAR(255) NOT NULL,
      name_secondary VARCHAR(255) DEFAULT NULL,
      name_kana VARCHAR(255) DEFAULT NULL,
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

  console.log("Table created successfully.");
});

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
