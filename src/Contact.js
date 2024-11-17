import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [search, setSearch] = useState('');
  const [filteredScreens, setFilteredScreens] = useState([]);

  // 画面名のリスト（例）
  const screenList = [
    //ダッシュボード
    { name: 'ダッシュボード', path: '/' },
    { name: 'ユーザー設定', path: '/user-settings' },
    { name: 'バックアップ設定', path: '/dashboards/backups-settings' },
    { name: 'データコンバート', path: '/dashboards/data-conversions' },
    { name: '管理者設定', path: '/dashboards/admin-settings' },
    { name: 'POS連携設定', path: '/dashboards/pos-coordination-settings' },
    { name: '消費税設定', path: '/dashboards/sales-tax-settings' },
    { name: '銀行API設定', path: '/dashboards/banks-api-settings' },
    ////////売り上げ管理
    { name: '売上管理', path: '/sales-management' },
    //伝票入力
    { name: '見積伝票', path: '/sales-management/voucher-entries/estimation-slip' },
    { name: '受注伝票', path: '/sales-management/voucher-entries/order-slips' },
    { name: '売上伝票', path: '/sales-management/voucher-entries/sales-slips' },
    { name: '入金伝票', path: '/sales-management/voucher-entries/payment-slips' },
    //明細表
    { name: '見積明細表', path: '/sales-management/statements/quotation-detail-sheets' },
    { name: '受注明細表', path: '/sales-management/statements/order-detail-sheets' },
    { name: '売上明細表', path: '/sales-management/statements/sales-detail-sheets' },
    { name: '入金明細表', path: '/sales-management/statements/payment-detail-sheets' },
    //集計・管理表
    { name: '受注集計表', path: '/sales-management/summary-and-management-sheets/order-summary-sheets' },
    { name: '売上集計表', path: '/sales-management/summary-and-management-sheets/sales-summary-sheets' },
    { name: '月次売上推移', path: '/sales-management/summary-and-management-sheets/money-sales-trends' },
    { name: '請求処理', path: '/sales-management/summary-and-management-sheets/invoice-processings' },
    { name: '入金予定表', path: '/sales-management/summary-and-management-sheets/incoming-payment-schedule' },
    { name: '売掛金残高', path: '/sales-management/summary-and-management-sheets/accounts-receivable-balance' },
    { name: '得意先元帳', path: '/sales-management/summary-and-management-sheets/accounts-receivable-ledger' },
    //仕入管理
    { name: '仕入管理', path: '/procurement' },
    //伝票入力
    { name: '発注伝票', path: '/procurement/voucher-entries/purchase-orders' },
    { name: '仕入伝票', path: '/procurement/voucher-entries/purchase-invoices' },
    { name: '入出庫伝票', path: '/procurement/voucher-entries/stock-in-out-slips' },
    { name: '支払伝票', path: '/procurement/voucher-entries/payment-vouchers' },
    //明細表
    { name: '発注明細表', path: '/procurement/statements/purchase-order-statement' },
    { name: '仕入明細表', path: '/procurement/statements/purchase-detail-statement' },
    { name: '入出庫明細表', path: '/procurement/statements/stock-in-out-statement' },
    { name: '支払明細表', path: '/procurement/statements/payment-statement' },
    //集計・管理表
    { name: '発注集計表', path: '/procurement/summary-and-management-sheets/order-summary-sheet' },
    { name: '仕入集計表', path: '/procurement/summary-and-management-sheets/purchase-summary-sheet' },
    { name: '入出庫集計表', path: '/procurement/summary-and-management-sheets/inventory-in-out-summary-sheet' },
    { name: '支払集計表', path: '/procurement/summary-and-management-sheets/payment-summary-sheet' },
    { name: '買掛集計表', path: '/procurement/summary-and-management-sheets/account-payment-balance' },
    { name: '在庫表', path: '/procurement/summary-and-management-sheets/inventory-sheet' },
    { name: '月次在庫表', path: '/procurement/summary-and-management-sheets/monthly-inventory-sheet' },
    //マスタ管理
    { name: 'マスタ管理', path: '/master' },
    { name: '得意先', path: '/master/customers' },
    { name: '納品先', path: '/master/delivery-customers' },
    { name: '商品', path: '/master/products' },
    { name: 'セット商品', path: '/master/set-products' },
    { name: '仕入先', path: '/master/vendors' },
    { name: '倉庫', path: '/master/storage-facilities' },
    { name: '支払方法', path: '/master/payment-methods' },
    { name: '担当者', path: '/master/contact-persons' },
    { name: '配送方法', path: '/master/shipping-methods' },
    { name: '店舗', path: '/master/shops' },
    { name: '区分１', path: '/master/primary-sections' },
    { name: '区分２', path: '/master/secondary-sections' },
    { name: '自社マスタ', path: '/master/companies' },
    { name: 'カテゴリ', path: '/master/categories' },
    { name: 'サブカテゴリ', path: '/master/subcategories' },
    { name: '', path: '' },
    // 他の画面も追加できます
  ];

  // 検索の処理
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query) {
      // 入力値に基づいて画面をフィルタリング
      const filtered = screenList.filter((screen) =>
        screen.name.includes(query)
      );
      setFilteredScreens(filtered);
    } else {
      // 検索欄が空のとき、検索結果をクリア
      setFilteredScreens([]);
    }
  };

  return (
    <div className="px-8">
      <div className="pt-6 pb-4 text-lg font-bold">画面の検索</div>
      <div className="relative w-2/3 mb-6">
        <input
          type="text"
          className="border rounded pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="画面を検索する"
          value={search}
          onChange={handleSearch}
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-900"
          >
            <path
              d="M12.8892 11.3369H12.0992L11.8192 11.0669C12.7992 9.92691 13.3892 8.44691 13.3892 6.83691C13.3892 3.24691 10.4792 0.336914 6.88916 0.336914C3.29916 0.336914 0.38916 3.24691 0.38916 6.83691C0.38916 10.4269 3.29916 13.3369 6.88916 13.3369C8.49916 13.3369 9.97916 12.7469 11.1192 11.7669L11.3892 12.0469V12.8369L16.3892 17.8269L17.8792 16.3369L12.8892 11.3369ZM6.88916 11.3369C4.39916 11.3369 2.38916 9.32691 2.38916 6.83691C2.38916 4.34691 4.39916 2.33691 6.88916 2.33691C9.37916 2.33691 11.3892 4.34691 11.3892 6.83691C11.3892 9.32691 9.37916 11.3369 6.88916 11.3369Z"
              fill="#9CA3AF"
            />
          </svg>
        </div>
      </div>

      {/* 検索結果 */}
      <div>
        {filteredScreens.length > 0 ? (
          <ul>
            {filteredScreens.map((screen, index) => (
              <li key={index} className="my-2">
                <Link
                  to={screen.path}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {screen.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          search && <p className="text-gray-500">一致する画面がありません</p>
        )}
      </div>
    </div>
  );
}


export default Contact;
