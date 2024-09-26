import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import VoucherEntries from './Procurements/VoucherEntries';
import Statements from './Procurements/Statements';

function Procurement() {
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
      {
        location.pathname === '/procurement' && 
        <div className='px-40 py-10'>
        <div className='pb-6 text-2xl font-bold'>仕入管理</div>
        <div className=''>
          <div className='flex items-center mb-4'>
            <Link to={"/procurement/voucher-entries"} className='flex items-center py-3 px-4 border rounded'>
              <div className='font-bold'>伝票入力</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/procurement/statements"} className='flex items-center py-3 px-4 border rounded  ml-5'>
              <div className='font-bold'>明細表</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
            <Link to={"/procurement/voucher-entries"} className='flex items-center py-3 px-4 border rounded  ml-5'>
              <div className='font-bold'>集計・管理表</div>
              <div><img src='/Icon.png' width={24} /></div>
            </Link>
          </div>
        </div>
      </div>
      }
      <Routes>
        <Route path="voucher-entries/*" element={<VoucherEntries />} />
        <Route path="statements/*" element={<Statements />} />
      </Routes>
    </div>)
}

export default Procurement;