import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import InvoiceProcessingsIndex from './InvoiceProcessings';
import OrderSummarySheetsIndex from './OrderSummarySheets';
import SalesSummarySheetsIndex from './SalesSummarySheets';
import MoneySalesTrendsIndex from './MoneySalesTrends';
import IncomingPaymentScheduleIndex from './IncomingPaymentSchedule';
import AccountsReceivableBalanceIndex from './AccountsReceivableBalance';
import AccountsReceivableLedgerIndex from './AccountsReceivableLedger';


function VoucherEntries() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const locatioIncomingPaymentSchedulen = useLocation();
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
        <div className={`text-center py-2 text-lg ${(location.pathname.includes("/sales-management/summary-and-management-sheets/order-summary-sheets") || location.pathname === "/sales-management/summary-and-management-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="order-summary-sheets" className={``}>受注集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/sales-summary-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="sales-summary-sheets" className={``}>売上集計表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/money-sales-trends") && "font-bold border-l-4 border-blue-600"}`}><Link to="money-sales-trends" className={``}>月次売上推移</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/invoice-processings") && "font-bold border-l-4 border-blue-600"}`}><Link to="invoice-processings" className={``}>請求処理</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/incoming-payment-schedule") && "font-bold border-l-4 border-blue-600"}`}><Link to="incoming-payment-schedule" className={``}>入金予定表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/accounts-receivable-balance") && "font-bold border-l-4 border-blue-600"}`}><Link to="accounts-receivable-balance" className={``}>売掛金残高</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/summary-and-management-sheets/accounts-receivable-ledger") && "font-bold border-l-4 border-blue-600"}`}><Link to="accounts-receivable-ledger" className={``}>得意先元帳</Link></div>
      </div>
      <div className='w-5/6'>
        <Routes>
          <Route path="" element={<OrderSummarySheetsIndex />} />
          <Route path="order-summary-sheets/*" element={<OrderSummarySheetsIndex />} />
          <Route path="sales-summary-sheets/*" element={<SalesSummarySheetsIndex />} />
          <Route path="money-sales-trends/*" element={<MoneySalesTrendsIndex />} />
          <Route path="invoice-processings/*" element={<InvoiceProcessingsIndex />} />
          <Route path="incoming-payment-schedule/*" element={<IncomingPaymentScheduleIndex />} />
          <Route path="accounts-receivable-balance/*" element={<AccountsReceivableBalanceIndex />} />
          <Route path="accounts-receivable-ledger/*" element={<AccountsReceivableLedgerIndex />} />
        </Routes>
      </div>
    </div>)
}

export default VoucherEntries;