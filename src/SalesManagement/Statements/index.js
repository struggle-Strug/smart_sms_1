import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PaymentDetailSheetsIndex from './PaymentDetailSheets';
import QuotationDetailSheetsIndex from './QuotationDetailSheets';
import OrderDetailSheetsIndex from './OrderDetailSheets';
import SalesDetailSheetsIndex from './SalesDetailSheets';


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
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/statements/quotation-detail-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="quotation-detail-sheets" className={``}>見積明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/statements/order-detail-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="order-detail-sheets" className={``}>受注明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/statements/sales-detail-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="sales-detail-sheets" className={``}>売上明細表</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/statements/payment-detail-sheets") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-detail-sheets" className={``}>入金明細表</Link></div>
      </div>
      <Routes>
        <Route path="" element={<QuotationDetailSheetsIndex />}/>
        <Route path="quotation-detail-sheets/*" element={<QuotationDetailSheetsIndex />}/>
        <Route path="order-detail-sheets/*" element={<OrderDetailSheetsIndex />}/>
        <Route path="sales-detail-sheets/*" element={<SalesDetailSheetsIndex />}/>
        <Route path="payment-detail-sheets/*" element={<PaymentDetailSheetsIndex />}/>
      </Routes>
    </div>)
}

export default VoucherEntries;