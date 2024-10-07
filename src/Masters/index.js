import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function MastersIndex() {
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
    <div className='w-full'>
      <div className='px-40 py-10'>
        <div className='pb-6 text-2xl font-bold'>マスタ管理</div>
        <div className=''>
          <div className='flex items-center mb-4'>
            <Link to={"/master/customers"} className='flex items-center py-3 px-4 border rounded'>
              <div className='font-bold'>得意先</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/delivery-customers"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>納品先</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/products"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>商品</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/set-products"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>セット商品</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/vendors"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>仕入先</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/storage-facilities"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>倉庫</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/payment-methods"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>支払い方法</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/contact-persons"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>担当者</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
          </div>
          <div className='flex items-center'>
            <Link to={"/master/shipping-methods"} className='flex items-center py-3 px-4 border rounded'>
              <div className='font-bold'>配送方法</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/customers"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>店舗</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/primary-sections"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>区分1</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/secondary-sections"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>区分2</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/master/companies"} className='flex items-center py-3 px-4 border rounded ml-5'>
              <div className='font-bold'>自社マスタ</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
          </div>
        </div>
      </div>
    </div>)
}

export default MastersIndex;