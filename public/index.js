const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// const {updateElectronApp} = require('update-electron-app');

// updateElectronApp()

//マスタ管理
require('./ipc/masters/customers'); 
require('./ipc/masters/deliveryCustomers');
require('./ipc/masters/products');
require('./ipc/masters/vendors');
require('./ipc/masters/storageFacilities');
require('./ipc/masters/paymentMethods');
require('./ipc/masters/contactPersons');
require('./ipc/masters/shippingMethods');
require('./ipc/masters/companies');
require('./ipc/masters/primarySections');
require('./ipc/masters/secondarySections');
require('./ipc/masters/shops');
require('./ipc/masters/setProducts'); // 追加
require('./ipc/masters/categories'); // 追加
require('./ipc/masters/subcategories'); // 追加

//ダッシュボード
require('./ipc/dashboard/bankApiSettings');//追加
require('./ipc/dashboard/salesTaxSettings'); // 追加
require('./ipc/dashboard/posCoordinationSettings');//追加
require('./ipc/dashboard/dataConversions');//追加
require('./ipc/dashboard/adminSettings');//追加
require('./ipc/dashboard/backupsSettings');

//仕入管理
require('./ipc/procurements/purchaseOrders');
require('./ipc/procurements/purchaseInvoices');
require('./ipc/procurements/stockInOutSlips');
require('./ipc/procurements/paymentVouchers');
require('./ipc/procurements/purchaseOrderDetails');
require('./ipc/procurements/purchaseInvoiceDetails');
require('./ipc/procurements/stockInOutSlipDetails');
require('./ipc/procurements/paymentVoucherDetails');
require('./ipc/procurements/statementSettings');
require('./ipc/procurements/posPvsMappings');
require('./ipc/procurements/inventories');
require('./ipc/procurements/squareLogs');
require('./ipc/procurements/inventoryLogs');

//ツール
require('./ipc/utilis/export');
require('./ipc/utilis/exportInvoice');
require('./ipc/utilis/square');

//売上管理
require('./ipc/salesmanagements/estimationSlips');
require('./ipc/salesmanagements/estimationSlipDetails');
require('./ipc/salesmanagements/depositSlips');
require('./ipc/salesmanagements/depositSlipDetails');
require('./ipc/salesmanagements/orderSlips');
require('./ipc/salesmanagements/orderSlipDetails');
require('./ipc/salesmanagements/salesSlips');
require('./ipc/salesmanagements/salesSlipDetails');
require('./ipc/salesmanagements/invoices');

function dropAllTables(callback) {
  // SQLiteで既存のすべてのテーブルを削除
  db.serialize(() => {
      db.each(
          `SELECT name FROM sqlite_master WHERE type='table'`,
          (err, row) => {
              if (err) {
                  console.error('Error fetching table names:', err);
              } else {
                  const tableName = row.name;
                  db.run(`DROP TABLE IF EXISTS ${tableName}`, (dropErr) => {
                      if (dropErr) {
                          console.error(`Error dropping table ${tableName}:`, dropErr);
                      } else {
                          console.log(`Table ${tableName} dropped successfully.`);
                      }
                  });
              }
          },
          callback // すべてのテーブル削除後にコールバックを実行
      );
  });
}

function initializeAllDatabases() {
  //ダッシュボード
  const dataConversionsDB = require('./database/dashboard/dataConversions')
  dataConversionsDB.initializeDatabase();
  const adminSettingsDB = require('./database/dashboard/adminSettings')
  adminSettingsDB.initializeDatabase();
  const posCoordinationsDB = require('./database/dashboard/posCoordinationSettings')
  posCoordinationsDB.initializeDatabase();
  const salesTaxSettingsDB = require('./database/dashboard/salesTaxSettings')
  salesTaxSettingsDB.initializeDatabase();
  const bankApiSettingsDB = require('./database/dashboard/bankApiSettings')
  bankApiSettingsDB.initializeDatabase();
//マスタ管理
  const customersDB = require('./database/masters/customers');
  customersDB.initializeDatabase();
  const deliveryCustomersDB = require('./database/masters/deliveryCustomers');
  deliveryCustomersDB.initializeDatabase();
  const productsDB = require('./database/masters/products');
  productsDB.initializeDatabase();
  const vendorsDB = require('./database/masters/vendors');
  vendorsDB.initializeDatabase();
  const storageFacilitiesDB = require('./database/masters/storageFacilities');
  storageFacilitiesDB.initializeDatabase();
  const paymentMethodsDB = require('./database/masters/paymentMethods');
  paymentMethodsDB.initializeDatabase();
  const contactPersonsDB = require('./database/masters/contactPersons');
  contactPersonsDB.initializeDatabase();
  const shippingMethodsDB = require('./database/masters/shippingMethods');
  shippingMethodsDB.initializeDatabase();
  const companiesDB = require('./database/masters/companies');
  companiesDB.initializeDatabase();
  const primarySectionsDB = require('./database/masters/primarySections');
  primarySectionsDB.initializeDatabase();
  const secondarySectionsDB = require('./database/masters/secondarySections');
  secondarySectionsDB.initializeDatabase();
  const shopsSectionsDB = require('./database/masters/shops');
  shopsSectionsDB.initializeDatabase();
  const setProductsSectionsDB = require('./database/masters/setProducts'); // 追加
  setProductsSectionsDB.initializeDatabase();
  const setTaxesDB = require('./database/dashboard/salesTaxSettings'); // 追加
  setTaxesDB.initializeDatabase();
  const setCategoriesDB = require('./database/masters/categories'); // 追加
  setCategoriesDB.initializeDatabase();
  const setSubcategoriesDB = require('./database/masters/subcategories'); // 追加
  setSubcategoriesDB.initializeDatabase();

  // 仕入管理
  const purchaseOrdersDB = require('./database/procurements/purchaseOrders');
  purchaseOrdersDB.initializeDatabase();
  const purchaseInvoicesDB = require('./database/procurements/purchaseInvoices');
  purchaseInvoicesDB.initializeDatabase();
  const stockInOutSlipsDB = require('./database/procurements/stockInOutSlips');
  stockInOutSlipsDB.initializeDatabase();
  const paymentVouchersDB = require('./database/procurements/paymentVouchers');
  paymentVouchersDB.initializeDatabase();
  const purchaseOrderDetailsDB = require('./database/procurements/purchaseOrderDetails');
  purchaseOrderDetailsDB.initializeDatabase();
  const purchaseInvoiceDetailsDB = require('./database/procurements/purchaseInvoiceDetails');
  purchaseInvoiceDetailsDB.initializeDatabase();
  const stockInOutSlipDetailsDB = require('./database/procurements/stockInOutSlipDetails');
  stockInOutSlipDetailsDB.initializeDatabase();
  const paymentVoucherDetailsDB = require('./database/procurements/paymentVoucherDetails');
  paymentVoucherDetailsDB.initializeDatabase();
  const statementSettingsDB = require('./database/procurements/statementSettings');
  statementSettingsDB.initializeDatabase();
  const posPvsMappingsDB = require('./database/procurements/posPvsMappings');
  posPvsMappingsDB.initializeDatabase();
  const inventoriesDB = require('./database/procurements/inventories');
  inventoriesDB.initializeDatabase();
  const inventoryLogsDB = require('./database/procurements/inventoryLogs');
  inventoryLogsDB.initializeDatabase();
  const squareLogsDB = require('./database/procurements/squareLogs');
  squareLogsDB.initializeDatabase();

  //集計管理

  //売上管理
  const estimationSlipsDB = require('./database/salesmanagements/estimationSlips');
  estimationSlipsDB.initializeDatabase();
  const estimationSlipDetailsDB = require('./database/salesmanagements/estimationSlipDetails');
  estimationSlipDetailsDB.initializeDatabase();
  const depositSlipsDB = require('./database/salesmanagements/depositSlips');
  depositSlipsDB.initializeDatabase();
  const depositSlipDetailsDB = require('./database/salesmanagements/depositSlipDetails');
  depositSlipDetailsDB.initializeDatabase();
  const orderSlipsDB = require('./database/salesmanagements/orderSlips');
  orderSlipsDB.initializeDatabase();
  const orderSlipDetailsDB = require('./database/salesmanagements/orderSlipDetails');
  orderSlipDetailsDB.initializeDatabase();
  const salesSlipsDB = require('./database/salesmanagements/salesSlips');
  salesSlipsDB.initializeDatabase();
  const salesSlipDetailsDB = require('./database/salesmanagements/salesSlipDetails');
  salesSlipDetailsDB.initializeDatabase();
  const invoicesDB = require('./database/salesmanagements/invoices');
  invoicesDB.initializeDatabase();
}

ipcMain.on('reset-database', (event) => {
  console.log('Resetting database...');
  dropAllTables(() => {
      initializeAllDatabases();
      event.sender.send('database-reset-complete', 'All tables dropped and reinitialized.');
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(
    app.isPackaged
    ? `file://${path.join(__dirname, '../build/index.html')}`
    : 'http://localhost:3000'
  );

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  initializeAllDatabases();
  
}

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

// app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
