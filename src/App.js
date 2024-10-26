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
import SalesMagement from './SalesManagement';


const { ipcRenderer } = window.require('electron');

function App() {
  const location = useLocation();
  const [companyName, setCompanyName] = useState("自社名");

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

  return (
    <div className="App">
      <div className='bg-white border-b flex items-center w-full relative' style={{ minWidth: "1280px", margin: "auto" }}>
        <div className='text-3xl font-bold pl-10 py-4' style={{ color: "#0272F5" }}>
          Smart_SMS_ver.0.1.3_test
        </div>
        <div className='absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Link to="/" className={`py-6 px-4 mx-2  ${location.pathname === "/" && "font-bold border-b-4 border-blue-600"}`}>ダッシュボード</Link>
          <Link to="/contact" className={`py-6 px-4 mx-2  ${location.pathname === "/contact" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>検索</Link>
          <Link to="/sales-management" className={`py-6 px-4 mx-2  ${location.pathname === "/about" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>売上管理</Link>
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
                  </div>
                </div>
              </div>
            )}
          </Link>
          <Link to="/master" className={`py-6 px-4 mx-2  ${location.pathname.includes("/master") && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>マスタ管理</Link>
        </div>
        <div className='ml-auto text-xl py-3 pr-10'>{companyName}</div>
      </div>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/sales-management/*" element={<SalesManagement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/master/*" element={<Master />} />
        <Route path="/procurement/*" element={<Procurement />} />
        <Route path="/invoice-settings" element={<InvoiceSettings />} />
        <Route path="/stock-in-output-invoice-settings" element={<StockInOutputInvoiceSettings />} />
      </Routes>
    </div>
  );
}

export default App;
