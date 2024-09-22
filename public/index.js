const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

  require('./database/setupDatabase');
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
  // companiesDB.addZipCodeColumn();
  // companiesDB.addAccountHolderColumn();
  const primarySectionsDB = require('./database/masters/primarySections');
  primarySectionsDB.initializeDatabase();
  const secondarySectionsDB = require('./database/masters/secondarySections');
  secondarySectionsDB.initializeDatabase();
  const shopsSectionsDB = require('./database/masters/shops');
  shopsSectionsDB.initializeDatabase();
}

const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath);

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});