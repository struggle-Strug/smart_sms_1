const { ipcMain } = require('electron');
const { Client } = require('square');
require('dotenv').config();
const { loadPosCoordinationSettings } = require('../../database/dashboard/posCoordinationSettings');


const {
  getLatestLogByRequestDateTime,
  saveSquareLog,
} = require('../../database/procurements/squareLogs');

const {
  subtractInventoryByProductName,
} = require('../../database/procurements/inventories');

// loadPosCoordinationSettings を Promise に変換
function loadPosCoordinationSettingsAsync() {
  return new Promise((resolve, reject) => {
    loadPosCoordinationSettings((err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function processTransactions(event) {
  try {
    let requestDateTime = null;

    // POS連携設定データを取得
    const posSettings = await loadPosCoordinationSettingsAsync();
    console.log("POS Coordination Settings:", posSettings);

    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: 'sandbox'
    });

    // 最新のログデータを取得
    await new Promise((resolve) => {
      getLatestLogByRequestDateTime((err, log) => {
        if (err) {
          console.error('Error fetching latest log:', err);
          resolve();
        } else if (log && log.request_date_time) {
          requestDateTime = log.request_date_time; // 最新のリクエスト日時を取得
        }
        resolve();
      });
    });

    const locationInfo = await fetchSandboxLocationId();
    if (locationInfo.length === 0) {
      console.error('No location found.');
      return [];
    }

    const locationId = locationInfo[0].id;

    const response = await client.paymentsApi.listPayments();

    const query = {
      locationIds: [locationId],
    };

    if (requestDateTime) {
      query.filter = {
        dateTimeFilter: {
          createdAt: {
            startAt: requestDateTime, // 最後のリクエスト日時以降
          },
        },
      };
    }

    // Square API の注文検索
    const orderResponse = await client.ordersApi.searchOrders({
      locationIds: [locationId],
      query: query,
    });

    // ログを保存
    const log = {
      status: 'success',
      request_date_time: new Date().toISOString(),
      remarks: '取引情報を取得しました',
    };

    saveSquareLog(log, (err, result) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Log saved:', result);
      }
    });

    const orders = orderResponse.result.orders || [];
    console.log('Fetched orders:', orders);

    if (orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const lineItems = order.lineItems || [];

        for (let j = 0; j < lineItems.length; j++) {
          const lineItem = lineItems[j];
          const productName = lineItem.name;
          const quantity = lineItem.quantity;

          // POS連携設定を基に特定の処理を追加可能
          const posSetting = posSettings.find(setting => setting.product_name === productName);
          if (posSetting) {
            console.log(`Found POS setting for ${productName}:`, posSetting);
            // POS設定に基づく処理をここに記述
          }

          // 商品名を元に在庫を減らす
          subtractInventoryByProductName(productName, quantity, (err, result) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log('Inventory subtracted:', result);
            }
          });
        }
      }
    }
    if (event) {
      event.sender.send('get-transactions-result', response.result);
    }
  } catch (error) {
    console.error('Error processing transactions:', error);
    if (event) {
      event.sender.send('get-transactions-error', { error: error.message });
    }
  }
}

ipcMain.on('get-transactions', async (event, data) => {
  processTransactions(event);
});

async function fetchSandboxLocationId() {
  try {
    const response = await client.locationsApi.listLocations();
    const locations = response.result.locations;
    if (locations && locations.length > 0) {
      const locationInfo = locations.map((location) => ({
        name: location.name,
        id: location.id,
      }));
      return locationInfo;
    } else {
      console.log("No locations found in sandbox.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching sandbox locations:", error);
    throw error;
  }
}

setInterval(() => {
  console.log('Running periodic transaction processing...');
  processTransactions(null); // 定期実行時は `event` を渡さない
}, 15 * 60 * 1000);
