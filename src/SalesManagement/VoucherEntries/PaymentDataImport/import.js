import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PaymentDataInquiry from './inquiry';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function PaymentDataImport() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentData, setPaymentData] = useState([]);
  const newDetails = location.state?.newDetails;
  console.log(newDetails);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        transactionDate: '2024/3/21',
        status: 'confirmed',
        payer: '株式会社A',
        amount: '100,000円',
      },
      {
        id: 2,
        transactionDate: '2024/3/21',
        status: 'pending',
        payer: 'B商事',
        amount: '100,000円',
      },
      {
        id: 3,
        transactionDate: '2024/3/21',
        status: 'pending',
        payer: '株式会社B',
        amount: '100,000円',
      },
    ];
    setPaymentData(newDetails);
  }, []);

  const handleSearch = () => {
    ipcRenderer.send('search-storage-facilities', searchQuery);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const renderStatusIcon = (status) => {
    const statusLabel = status === 'confirmed' ? '照合確定' : '照合中';
    const statusColor = status === 'confirmed' ? 'text-green-500' : 'text-gray-500';
    const statusIcon = status === 'confirmed' ? (
      <svg width="16" height="16" fill="green" xmlns="http://www.w3.org/2000/svg" className="mr-1">
        <circle cx="8" cy="8" r="8" />
        <path d="M4 8l2.5 2.5L12 5" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ) : (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.7119 0.518677C5.19191 0.518677 0.711914 4.99868 0.711914 10.5187C0.711914 16.0387 5.19191 20.5187 10.7119 20.5187C16.2319 20.5187 20.7119 16.0387 20.7119 10.5187C20.7119 4.99868 16.2319 0.518677 10.7119 0.518677ZM10.7119 18.5187C6.30191 18.5187 2.71191 14.9287 2.71191 10.5187C2.71191 6.10868 6.30191 2.51868 10.7119 2.51868C15.1219 2.51868 18.7119 6.10868 18.7119 10.5187C18.7119 14.9287 15.1219 18.5187 10.7119 18.5187ZM15.3019 6.09868L8.71191 12.6887L6.12191 10.1087L4.71191 11.5187L8.71191 15.5187L16.7119 7.51868L15.3019 6.09868Z" fill="#6B7280"/>
      </svg>
    );

    return (
      <Link to={`data-inquiry`} className={`flex items-center ${statusColor}`}>
        {statusIcon}
        <span>{statusLabel}</span>
      </Link>
    );
  };

  return (
    <div className='w-full'>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>入金データ取込</div>
        <div className='bg-gray-100 rounded p-6'>
          <div className='pb-3 text-lg font-bold'>検索する</div>
          <div className='flex'>
            <div className='border rounded flex p-3 bg-white'>
              <input
                className='outline-none'
                placeholder='検索'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <table className="w-full mt-8 table-auto">
          <thead>
            <tr className='border-b'>
              <th className='text-left pb-2.5'>取引日</th>
              <th className='text-left pb-2.5'>ステータス</th>
              <th className='text-left pb-2.5'>入金元</th>
              <th className='text-left pb-2.5'>金額</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((facility) => (
              <tr 
                className='border-b hover:border-gray-300 hover:bg-gray-50 transition-colors' 
                key={facility.id}
              >
                <td className="py-2">{facility.deposit_date}</td>
                <td>{renderStatusIcon(facility.status)}</td>
                <td>{facility.vender_name
                }</td>
                <td>{facility.deposits.toLocaleString()}円</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentDataIndex () {
  return (
    <Routes>
      <Route path="" element={<PaymentDataImport />} />
      <Route path="data-inquiry" element={<PaymentDataInquiry />} />
    </Routes>
  )
}

export default PaymentDataIndex;
