import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Contact from './Contact'
import Home from './Home'
import About from './About'
import { useLocation } from 'react-router-dom';
import Procurement from './Procurement';
import Master from './Master';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <div className='bg-white border-b flex items-center w-full relative' style={{minWidth: "1280px", margin: "auto"}}>
        <div className='text-3xl font-bold pl-10 py-4' style={{ color: "#0272F5" }}>
          Smart_SMS
        </div>
        <div className='absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Link to="/" className={`py-6 px-4 mx-2  ${location.pathname === "/" && "font-bold border-b-4 border-blue-600"}`}>ダッシュボード</Link>
          <Link to="/contact" className={`py-6 px-4 mx-2  ${location.pathname === "/contact" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>検索</Link>
          <Link to="/about" className={`py-6 px-4 mx-2  ${location.pathname === "/about" && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>売上管理</Link>
          <Link to="/procurement" className={`py-6 px-4 mx-2  ${location.pathname.includes("/procurement") && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>仕入管理</Link>
          <Link to="/master" className={`py-6 px-4 mx-2  ${location.pathname.includes("/master") && "font-bold border-b-4 border-blue-600"}`} activeClassName=''>マスタ管理</Link>
        </div>
        <div className='ml-auto text-xl py-3 pr-10'>国際キャリア事業協同組合</div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/master/*" element={<Master />} />
        <Route path="/procurement/*" element={<Procurement />} />
      </Routes>
    </div>
  );
}

export default App;
