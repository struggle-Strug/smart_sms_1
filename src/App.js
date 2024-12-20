import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Contact from './Contact'
import Home from './Home'
import SalesManagement from './SalesManagement';
import { useLocation } from 'react-router-dom';
import Procurement from './Procurement';
import Master from './Master';
import InvoiceSettings from './Components/InvoiceSettings/InvoiceSettings';
import StockInOutputInvoiceSettings from './Components/InvoiceSettings/StockInOutputInvoiceSettings';
import InvoiceExportSettings from './Components/InvoiceSettings/InvoiceExportSettings';
import SalesMagement from './SalesManagement';


const { ipcRenderer } = window.require('electron');

function App() {
  const location = useLocation();
  const [companyName, setCompanyName] = useState("株式会社サンプル");

  const [dashboardIsHover, setDashboardIsHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [SalesManagementIsHover, setSalesManagementIsHover] = useState(false);
  const [masterIsHover, setMasterIsHover] = useState(false);

  const handleDashboardMouseEnter = () => {
    setDashboardIsHover(true);
  };
  const handleDashboardMouseLeave = () => {
    setDashboardIsHover(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlSalesManagementMouseEnter = () => {
    setSalesManagementIsHover(true);
  };
  const handlelSalesManagementMouseLeave = () => {
    setSalesManagementIsHover(false);
  };

  const handleMasterMouseEnter = () => {
    setMasterIsHover(true);
  };
  const handleMasterMouseLeave = () => {
    setMasterIsHover(false);
  };

  useEffect(() => {
    ipcRenderer.send('load-companies');
    ipcRenderer.on('load-companies', (event, data) => {
      if (data.length === 0) return;
      setCompanyName(data[0].name);
    });
    return () => {
      ipcRenderer.removeAllListeners('load-companies');
    };
  })

  console.log(location.pathname);

  return (
    <div className="App">
      <div className='fixed w-full'>
        <div className='bg-white border-b flex items-center w-full relative' style={{ minWidth: "1440px", margin: "auto" }}>
          <div className='text-2xl font-bold pl-10 py-4' style={{ color: "#0272F5" }}>
            Smart_SmS
          </div>
          <div className='absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <Link to="/dashboards" className={`py-6 px-4 mx-2  ${location.pathname.includes("/dashboards") && "font-bold border-b-4 border-blue-600"} relative`}
              activeClassName=''
              onMouseEnter={handleDashboardMouseEnter}
              onMouseLeave={handleDashboardMouseLeave}>
              ダッシュボード
              {dashboardIsHover && (
                <div
                  onMouseEnter={handleDashboardMouseEnter}
                  onMouseLeave={handleDashboardMouseLeave}
                  className={`absolute bg-white shadow-md mt-2 top-12 p-3 left-0 z-auto`}
                >
                  <div className='font-normal' style={{ width: "344px" }}>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-28'>データ設定</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/dashboards/backups-settings">バックアップ設定</Link>
                        <Link to="/dashboard/data-conversion">データコンバート</Link>
                      </div>
                    </div>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-28'>ファイル管理</div>
                        <div className='border w-56'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/dashboards/admin-settings">管理者設定</Link>
                        <Link to="/dashboards/pos-coordination-settings">POS連携設定</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/dashboards/sales-tax-settings">消費税設定</Link>
                        <Link to="/dashboards/banks-api-settings">銀行API設定</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </Link>
            <Link to="/contact" className={`py-6 px-4 mx-2  ${location.pathname === "/contact" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>検索</Link>
            <Link to="/sales-management" className={`py-6 px-4 mx-2  ${location.pathname.includes("/sales-management") && "font-bold border-b-4 border-blue-600"} relative z-20`}
              activeClassName=''
              onMouseEnter={handlSalesManagementMouseEnter}
              onMouseLeave={handlelSalesManagementMouseLeave}>
              売上管理
              {SalesManagementIsHover && (
                <div
                  onMouseEnter={handlSalesManagementMouseEnter}
                  onMouseLeave={handlelSalesManagementMouseLeave}
                  className={`absolute bg-white shadow-md mt-2 top-12 p-3 left-0 z-auto`}
                >
                  <div className='font-normal' style={{ width: "344px" }}>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-24'>伝票入力</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/voucher-entries/estimation-slip">見積伝票</Link>
                        <Link to="/sales-management/voucher-entries/order-slips">受注伝票</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/voucher-entries/sales-slips">売上伝票</Link>
                        <Link to="/sales-management/voucher-entries/payment-slips">入金伝票</Link>
                      </div>
                    </div>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-20'>明細表</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/statements/quotation-detail-sheets">見積明細表</Link>
                        <Link to="/sales-management/statements/order-detail-sheets">受注明細表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/statements/sales-detail-sheets">売上明細表</Link>
                        <Link to="/sales-management/statements/payment-detail-sheets">入金明細表</Link>
                      </div>
                    </div>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-28'>集計管理表</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/summary-and-management-sheets/order-summary-sheets">受注集計表</Link>
                        <Link to="/sales-management/summary-and-management-sheets/sales-summary-sheets">売上集計表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/summary-and-management-sheets/money-sales-trends">月次売上推移</Link>
                        <Link to="/sales-management/summary-and-management-sheets/invoice-processings">請求処理</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/summary-and-management-sheets/incoming-payment-schedule">入金予定表</Link>
                        <Link to="/sales-management/summary-and-management-sheets/accounts-receivable-balance">売掛金残高</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/sales-management/summary-and-management-sheets/accounts-receivable-ledger">得意先元帳</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Link>
            <Link to="/procurement" className={`py-6 px-4 mx-2  ${location.pathname.includes("/procurement") && "font-bold border-b-4 border-blue-600"} relative`}
              activeClassName=''
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              仕入管理
              {isHovered && (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={`absolute bg-white shadow-md mt-2 top-12 p-3 left-0`}
                >
                  <div className='font-normal' style={{ width: "344px" }}>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-24'>伝票入力</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/voucher-entries/purchase-orders">発注伝票</Link>
                        <Link to="/procurement/voucher-entries/purchase-invoices">仕入伝票</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/voucher-entries/stock-in-out-slips">入出庫伝票</Link>
                        <Link to="/procurement/voucher-entries/payment-vouchers">支払伝票</Link>
                      </div>
                    </div>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-20'>明細表</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/statements/purchase-order-statement">発注明細表</Link>
                        <Link to="/procurement/statements/purchase-detail-statement">仕入明細表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/statements/stock-in-out-statement">入出庫明細表</Link>
                        <Link to="/procurement/statements/payment-statement">支払明細表</Link>
                      </div>
                    </div>
                    <div className='px-3 pb-4'>
                      <div className='font-bold flex items-center'>
                        <div className='w-28'>集計管理表</div>
                        <div className='border w-full'></div>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/summary-and-management-sheets/order-summary-sheet">発注集計表</Link>
                        <Link to="/procurement/summary-and-management-sheets/purchase-summary-sheet">仕入集計表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/summary-and-management-sheets/inventory-in-out-summary-sheet">入出庫集計表</Link>
                        <Link to="/procurement/summary-and-management-sheets/payment-summary-sheet">支払集計表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/summary-and-management-sheets/account-payment-balance">買掛金残高</Link>
                        <Link to="/procurement/summary-and-management-sheets/inventory-sheet">在庫表</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/procurement/summary-and-management-sheets/monthly-inventory-sheet">月次在庫表</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Link>
            <Link to="/master" className={`pt-6 pb-5 px-4 mx-2  ${location.pathname.includes("/master") && "font-bold border-b-4 border-blue-600"} relative`}
              activeClassName=''
              onMouseEnter={handleMasterMouseEnter}
              onMouseLeave={handleMasterMouseLeave}>
              マスタ管理
              {masterIsHover && (
                <div
                  onMouseEnter={handleMasterMouseEnter}
                  onMouseLeave={handleMasterMouseLeave}
                  className={`absolute bg-white shadow-md mt-2 top-12 p-3 left-0 z-auto`}
                >
                  <div className='font-normal' style={{ width: "344px" }}>
                    <div className='px-3 pb-4'>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/customers">得意先</Link>
                        <Link to="/master/delivery-customers">納品先</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/products">商品</Link>
                        <Link to="/master/set-products">セット商品</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/vendors">仕入先</Link>
                        <Link to="/master/storage-facilities">倉庫</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/payment-methods">支払方法</Link>
                        <Link to="/master/contact-persons">担当者</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/shipping-methods">配送方法</Link>
                        <Link to="/master/shops">店舗</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/primary-sections">区分1</Link>
                        <Link to="/master/secondary-sections">区分2</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/companies">自社マスタ</Link>
                        <Link to="/master/categories">カテゴリー</Link>
                      </div>
                      <div className='grid grid-cols-2 text-gray-600'>
                        <Link to="/master/subcategories">サブカテゴリー</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          </div>
          <div className='ml-auto text-xl py-3 pr-10'>{companyName}</div>
        </div>
      </div>
      <div className='pt-16'>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="dashboards/*" element={<Home />} />
          <Route path="/sales-management/*" element={<SalesManagement />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/master/*" element={<Master />} />
          <Route path="/procurement/*" element={<Procurement />} />
          <Route path="/invoice-settings" element={<InvoiceSettings />} />
          <Route path="/stock-in-output-invoice-settings" element={<StockInOutputInvoiceSettings />} />
          <Route path="/invoice-export" element={<InvoiceExportSettings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
