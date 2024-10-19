import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import CustomersIndex from './Masters/Customers';
// import MastersIndex from './Masters';
// import DeliveryCustomersIndex from './Masters/DeliveryCustomers';
// import ProductsIndex from './Masters/Products';
// import VendorsIndex from './Masters/Vendors';
// import StorageFacilitiesIndex from './Masters/StorageFacilities';
// import PaymentMethodsIndex from './Masters/PaymentMethods';
// import ContactPersonsIndex from './Masters/ContactPersons';
// import ShippingMethodsIndex from './Masters/ShippingMethods';
// import CompaniesIndex from './Masters/Companies';
// import PrimarySectionsIndex from './Masters/PrimarySections';
// import SecondarySectionsIndex from './Masters/SecondarySections';
// import ShopsIndex from './Masters/Shops';
import QuotationSlipIndex from './QuotationSlip';
import PaymentSlipsIndex from './PaymentSlips';
import SalesSlipsIndex from './SalesSlips';
import SalesOrderSlipsIndex from './SalesOrderSlips';

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
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/voucher-entries/quotation-slip") && "font-bold border-l-4 border-blue-600"}`}><Link to="quotation-slip" className={``}>見積伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/voucher-entries/sales-order-slips") && "font-bold border-l-4 border-blue-600"}`}><Link to="sales-order-slips" className={``}>受注伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/voucher-entries/sales-slips") && "font-bold border-l-4 border-blue-600"}`}><Link to="sales-slips" className={``}>売上伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-management/voucher-entries/payment-slips") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-slips" className={``}>入金伝票</Link></div>
      </div>
      <Routes>
        <Route path="" element={<QuotationSlipIndex />}/>
        <Route path="quotation-slip/*" element={<QuotationSlipIndex />}/>
        <Route path="sales-order-slips/*" element={<SalesOrderSlipsIndex />}/>
        <Route path="sales-slips/*" element={<SalesSlipsIndex />}/>
        <Route path="payment-slips/*" element={<PaymentSlipsIndex />}/>
      </Routes>
    </div>)
}

export default VoucherEntries;