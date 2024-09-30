import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Contact from './Contact'
import Home from './Home'
import About from './About'
import { useLocation } from 'react-router-dom';
import Procurement from './Procurement';
import Master from './Master';
import SalesMagement from './SalesManagement';

function App() {
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="App">
      <div className='bg-white border-b flex items-center w-full relative' style={{ minWidth: "1280px", margin: "auto" }}>
        <div className='text-3xl font-bold pl-10 py-4' style={{ color: "#0272F5" }}>
          Smart_SMS
        </div>
        <div className='absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Link to="/" className={`py-6 px-4 mx-2  ${location.pathname === "/" && "font-bold border-b-4 border-blue-600"}`}>ダッシュボード</Link>
          <Link to="/contact" className={`py-6 px-4 mx-2  ${location.pathname === "/contact" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>検索</Link>
          <Link to="/sales-management" className={`py-6 px-4 mx-2  ${location.pathname === "/about" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>売上管理</Link>
          <Link to="/procurement" className={`py-6 px-4 mx-2  ${location.pathname.includes("/procurement") && "font-bold border-b-4 border-blue-600"} relative`}
            activeClassName=''
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            仕入管理
            {isHovered && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`absolute bg-white shadow-md mt-2 top-12 p-3 left-0`}
              >
                <div className='font-normal' style={{width: "344px"}}>
                  <div className='px-3 pb-4'>
                    <div className='font-bold flex items-center'>
                      <div className='w-24'>伝票入力</div>
                      <div className='border w-full'></div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>見積伝票</div>
                      <div>売上伝票</div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>受注伝票</div>
                      <div>入金伝票</div>
                    </div>
                  </div>
                  <div className='px-3 pb-4'>
                    <div className='font-bold flex items-center'>
                      <div className='w-20'>明細表</div>
                      <div className='border w-full'></div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>見積伝票</div>
                      <div>売上伝票</div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>受注伝票</div>
                      <div>入金伝票</div>
                    </div>
                  </div>
                  <div className='px-3 pb-4'>
                    <div className='font-bold flex items-center'>
                      <div className='w-28'>集計管理表</div>
                      <div className='border w-full'></div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>見積伝票</div>
                      <div>売上伝票</div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>受注伝票</div>
                      <div>入金伝票</div>
                    </div>
                  </div>
                  <div className='px-3 pb-4'>
                    <div className='font-bold flex items-center'>
                      <div className='w-36'>エクスポート</div>
                      <div className='border w-full'></div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>エクスポート</div>
                    </div>
                  </div>
                  <div className='px-3 pb-4'>
                    <div className='font-bold flex items-center'>
                      <div className='w-24'>請求処理</div>
                      <div className='border w-full'></div>
                    </div>
                    <div className='grid grid-cols-2 text-gray-600'>
                      <div>請求処理</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Link>
          <Link to="/master" className={`py-6 px-4 mx-2  ${location.pathname.includes("/master") && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>マスタ管理</Link>
        </div>
        <div className='ml-auto text-xl py-3 pr-10'>国際キャリア事業協同組合</div>
      </div>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sales-management/*" element={<SalesMagement />} />
        <Route path="/master/*" element={<Master />} />
        <Route path="/procurement/*" element={<Procurement />} />
      </Routes>
    </div>
  );
}

export default App;
