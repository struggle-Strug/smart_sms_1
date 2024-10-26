import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import VoucherEntries from './SalesManagement/VoucherEntries';
import Statements from './SalesManagement/Statements';
import SummaryAndManagementSheets from './SalesManagement/SummaryAndManagementSheets';

function SalesManagement() {
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
        <div className='pb-6 text-2xl font-bold'>売上管理</div>
        <div className=''>
          <div className='flex items-center mb-4'>
            <Link to={"/sales-management/voucher-entries"} className='flex items-center py-3 px-4 border rounded'>
              <div className='font-bold'>伝票入力</div>
              <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937"/>
</svg></div>
            </Link>
            <Link to={"/sales-management/statements"} className='flex items-center py-3 px-4 border rounded  ml-5'>
              <div className='font-bold'>明細表</div>
              <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937"/>
</svg></div>
            </Link>
            <Link to={"/sales-management/summary-and-management-sheets"} className='flex items-center py-3 px-4 border rounded  ml-5'>
              <div className='font-bold'>集計・管理表</div>
              <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937"/>
</svg></div>
            </Link>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/sales-management/voucher-entries" element={<VoucherEntries />} />
        <Route path="/sales-management/statements" element={<Statements />} />
        <Route path="/sales-management/summary-and-management-sheets" element={<SummaryAndManagementSheets />} />
      </Routes>
    </div>)
}

export default SalesManagement;