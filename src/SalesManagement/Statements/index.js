import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PaymentStatementsIndex from './PaymentStatements';
import PurchaseOrderStatementsIndex from './PurchaseOrderStatements';
import PurchaseDetailStatementsIndex from './PurchaseDetailStatements';
import StockInOutStatementsIndex from './StockInOutStatements';


function VoucherEntries() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropDown = (id) => {
    return (
    <div className='absolute left-0 origin-top-right rounded shadow bg-white' style={{ top: "50px" }}>
      <div className='text-center py-2 hover:bg-gray-100 mt-2'>詳細</div>
      <div className='px-4 py-2 hover:bg-gray-100'>編集</div>
      <div className='px-4 py-2 mb-2 hover:bg-gray-100'>削除</div>
    </div>
    )
  }

  return (
    <div className='flex'>
      <div className='border-r w-48 h-[100vh]'>
        <div className='text-center py-2 pt-4'></div>
        <div className='text-center py-2 pt-4 text-lg'></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/statements/purchase-order-statement") && "font-bold border-l-4 border-blue-600"}`}><Link to="purchase-order-statement" className={``}>発注明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/statements/purchase-detail-statement") && "font-bold border-l-4 border-blue-600"}`}><Link to="purchase-detail-statement" className={``}>仕入明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/statements/stock-in-out-statement") && "font-bold border-l-4 border-blue-600"}`}><Link to="stock-in-out-statement" className={``}>入出庫明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/statements/payment-statement") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-statement" className={``}>支払明細表</Link></div>
      </div>
      <Routes>
        <Route path="" element={<PaymentStatementsIndex />}/>
        <Route path="purchase-order-statement/*" element={<PurchaseOrderStatementsIndex />}/>
        <Route path="purchase-detail-statement/*" element={<PurchaseDetailStatementsIndex />}/>
        <Route path="stock-in-out-statement/*" element={<StockInOutStatementsIndex />}/>
        <Route path="payment-statement/*" element={<PaymentStatementsIndex />}/>
      </Routes>
    </div>)
}

export default VoucherEntries;