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
import PurchaseOrdersIndex from './PurchaseOrders';
import PaymentVouchersIndex from './PaymentVouchers';
import StockInOutSlipsIndex from './StockInOutSlips';
import PurchaseInvoicesIndex from './PurchaseInvoices';

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
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/voucher-entries/purchase-orders") && "font-bold border-l-4 border-blue-600"}`}><Link to="purchase-orders" className={``}>発注伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/voucher-entries/purchase-invoices") && "font-bold border-l-4 border-blue-600"}`}><Link to="purchase-invoices" className={``}>仕入伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/voucher-entries/stock-in-out-slips") && "font-bold border-l-4 border-blue-600"}`}><Link to="stock-in-out-slips" className={``}>入出庫伝票</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/procurement/voucher-entries/payment-vouchers") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-vouchers" className={``}>支払伝票</Link></div>
      </div>
      <Routes>
        <Route path="" element={<PurchaseOrdersIndex />}/>
        <Route path="purchase-orders/*" element={<PurchaseOrdersIndex />}/>
        <Route path="purchase-invoices/*" element={<PurchaseInvoicesIndex />}/>
        <Route path="stock-in-out-slips/*" element={<StockInOutSlipsIndex />}/>
        <Route path="payment-vouchers/*" element={<PaymentVouchersIndex />}/>
      </Routes>
    </div>)
}

export default VoucherEntries;