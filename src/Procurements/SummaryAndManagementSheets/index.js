import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AccountsPayableBalancesIndex  from './AccountsPayableBalances';
import InventoryInOutSummarySheetsIndex from './InventoryInOutSummarySheets';
import InventorySheetsIndex from './InventorySheets';
import OrderSummarySheetsIndex from './OrderSummarySheets';
import PaymentSummarySheetsIndex from './PaymentSummarySheets';
import PurchaseSummarySheetsIndex from './PurchaseSummarySheets';



function SummaryAndManagementSheets() {
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
        <div className={`text-center py-2 text-lg ${(location.pathname.includes("/procurement/summary-and-management-sheets/order-summary-sheet") || location.pathname === "/procurement/summary-and-management-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="order-summary-sheet" className={``}>発注集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/summary-and-management-sheets/purchase-summary-sheet") && "font-bold border-l-4 border-blue-600"}`}><Link to="purchase-summary-sheet" className={``}>仕入集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/summary-and-management-sheets/inventory-in-out-summary-sheet") && "font-bold border-l-4 border-blue-600"}`}><Link to="inventory-in-out-summary-sheet" className={``}>入出庫集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/summary-and-management-sheets/payment-summary-sheet") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-summary-sheet" className={``}>支払集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/summary-and-management-sheets/account-payment-balance") && "font-bold border-l-4 border-blue-600"}`}><Link to="account-payment-balance" className={``}>買掛金残高</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/summary-and-management-sheets/inventory-sheet") && "font-bold border-l-4 border-blue-600"}`}><Link to="inventory-sheet" className={``}>在庫表</Link></div>
      </div>
      <Routes>
        <Route path="" element={<OrderSummarySheetsIndex />}/>
        <Route path="account-payment-balance/*" element={<AccountsPayableBalancesIndex />}/>
        <Route path="inventory-in-out-summary-sheet/*" element={<InventoryInOutSummarySheetsIndex />}/>
        <Route path="inventory-sheet/*" element={<InventorySheetsIndex />}/>
        <Route path="order-summary-sheet/*" element={<OrderSummarySheetsIndex />}/>
        <Route path="payment-summary-sheet/*" element={<PaymentSummarySheetsIndex />}/>
        <Route path="purchase-summary-sheet/*" element={<PurchaseSummarySheetsIndex />}/>
      </Routes>
    </div>)
}

export default SummaryAndManagementSheets;