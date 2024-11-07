import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BackupsSettingsIndex from './BackupsSettings';
import SalesTaxSettingsIndex from './SalesTaxSettings';

function Dashboards() {
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
  return (
    <div className='flex'>
      <div className='border-r w-48 h-[92vh]'>
        <div>
          <div className='text-center py-2 pt-4'></div>
          <div className='text-center py-2 pt-4 text-lg'></div>
          <div className={`text-center py-2 text-lg ${location.pathname.includes("/test") && "font-bold border-l-4 border-blue-600"}`}><Link to="test" className={``}>テストサイドバー</Link></div>
          <div className={`text-center py-2 text-lg ${location.pathname.includes("/backups-settings") && "font-bold border-l-4 border-blue-600"}`}><Link to="backups-settings" className={``}>バックアップ設定</Link></div>
          <div className={`text-center py-2 text-lg ${location.pathname.includes("/sales-tax-settings") && "font-bold border-l-4 border-blue-600"}`}><Link to="sales-tax-settings" className={``}>消費税設定</Link></div>

        </div>
      </div>
      <div className='overflow-y-scroll h-[92vh] w-full'>
        <Routes>
          <Route path="" element={<BackupsSettingsIndex />} />
          <Route path="backups-settings" element={<BackupsSettingsIndex />} />
          <Route path="sales-tax-settings" element={<SalesTaxSettingsIndex />} />
        </Routes>
      </div>
    </div>)
}
export default Dashboards;