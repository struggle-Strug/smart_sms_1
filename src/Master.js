import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomersIndex from './Masters/Customers';
import MastersIndex from './Masters';
import DeliveryCustomersIndex from './Masters/DeliveryCustomers';
import ProductsIndex from './Masters/Products';
import SetProductsIndex from './Masters/SetProducts';
import VendorsIndex from './Masters/Vendors';
import StorageFacilitiesIndex from './Masters/StorageFacilities';
import PaymentMethodsIndex from './Masters/PaymentMethods';
import ContactPersonsIndex from './Masters/ContactPersons';
import ShippingMethodsIndex from './Masters/ShippingMethods';
import CompaniesIndex from './Masters/Companies';
import PrimarySectionsIndex from './Masters/PrimarySections';
import SecondarySectionsIndex from './Masters/SecondarySections';
import ShopsIndex from './Masters/Shops';

function Master() {
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
      {location.pathname !== '/master' && (
      <div className='border-r w-48 h-[100vh]'>
        <div className='text-center py-2 pt-4'></div>
        <div className='text-center py-2 pt-4 text-lg'></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/customers") && "font-bold border-l-4 border-blue-600"}`}><Link to="customers" className={``}>得意先</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/delivery-customers") && "font-bold border-l-4 border-blue-600"}`}><Link to="delivery-customers">納品先</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/products") && "font-bold border-l-4 border-blue-600"}`}><Link to="products">商品</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/set-products") && "font-bold border-l-4 border-blue-600"}`}><Link to="set-products">セット商品</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/vendors") && "font-bold border-l-4 border-blue-600"}`}><Link to="vendors">仕入先</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/storage-facilities") && "font-bold border-l-4 border-blue-600"}`}><Link to="storage-facilities">倉庫</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/payment-methods") && "font-bold border-l-4 border-blue-600"}`}><Link to="payment-methods">支払方法</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/contact-persons") && "font-bold border-l-4 border-blue-600"}`}><Link to="contact-persons">担当者</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/shipping-methods") && "font-bold border-l-4 border-blue-600"}`}><Link to="shipping-methods">配送方法</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/shops") && "font-bold border-l-4 border-blue-600"}`}><Link to="shops">店舗</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/primary-sections") && "font-bold border-l-4 border-blue-600"}`}><Link to="primary-sections">区分1</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/secondary-sections") && "font-bold border-l-4 border-blue-600"}`}><Link to="secondary-sections">区分2</Link></div>
        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/companies") && "font-bold border-l-4 border-blue-600"}`}><Link to="companies">自社マスタ</Link></div>
      </div>
      )}
      <Routes>
        <Route path="" element={<MastersIndex />} />
        <Route path="customers/*" element={<CustomersIndex />} />
        <Route path="delivery-customers/*" element={<DeliveryCustomersIndex />} />
        <Route path="products/*" element={<ProductsIndex />} />
        <Route path="set-products/*" element={<SetProductsIndex />} />
        <Route path="vendors/*" element={<VendorsIndex />} />
        <Route path="storage-facilities/*" element={<StorageFacilitiesIndex />} />
        <Route path="payment-methods/*" element={<PaymentMethodsIndex />} />
        <Route path="contact-persons/*" element={<ContactPersonsIndex />} />
        <Route path="shipping-methods/*" element={<ShippingMethodsIndex />} />
        <Route path="shops/*" element={<ShopsIndex />} />
        <Route path="primary-sections/*" element={<PrimarySectionsIndex />} />
        <Route path="secondary-sections/*" element={<SecondarySectionsIndex />} />
        <Route path="companies/*" element={<CompaniesIndex />} />
      </Routes>
    </div>)
}

export default Master;