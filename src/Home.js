import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BackupsSettingsIndex from './DashBoards/BackupsSettings';
import DataConversionsIndex from './DashBoards/DataConversions';
import AdminSettingsIndex from './DashBoards/AdminManament';
import PosCoordinationSettingsIndex from './DashBoards/PosCoordinationSettings';
import SalesTaxSettingsIndex from './DashBoards/SalesTaxSettings';
import BanksApiSettingsIndex from './DashBoards/BanksApiSettings';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Dashboards from './DashBoards';

const { ipcRenderer } = window.require('electron');

function Home() {
  const location = useLocation();
  const [messageDetail, setMessageDetail ] = useState([])

  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    ipcRenderer.send('load-inventories');

    ipcRenderer.on('load-inventories', (event, data) => {
      let inventoryData = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].warning_value > data[i].inventory) {
          inventoryData.push({
            date: new Date().toISOString(),
            content: `在庫補充アラート: ${data[i].product_name}（緊急）`
          });
        }
      }
      setMessageDetail(inventoryData);
    });
    return () => {
        ipcRenderer.removeAllListeners('load-inventories');
    };
}, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  };
  const renderIcon = (content) => {
    if (content.includes("（予定）")) {
      return (
        <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline mr-2">
          <path d="M11.8066 3.99L19.3366 17H4.27664L11.8066 3.99ZM11.8066 0L0.806641 19H22.8066L11.8066 0ZM12.8066 14H10.8066V16H12.8066V14ZM12.8066 8H10.8066V12H12.8066V8Z" fill="#B88B14"/>
        </svg>
      );
    } else if (content.includes("（緊急）")) {
      return (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline mr-2">
          <path d="M7.97777 6.25736L6.56356 7.67157L9.39198 10.5L6.56356 13.3284L7.97777 14.7426L10.8062 11.9142L13.6346 14.7426L15.0488 13.3284L12.2204 10.5L15.0488 7.67157L13.6346 6.25736L10.8062 9.08579L7.97777 6.25736ZM3.73513 3.42893C-0.168099 7.33216 -0.168099 13.6678 3.73513 17.5711C7.63836 21.4743 13.974 21.4743 17.8773 17.5711C21.7805 13.6678 21.7805 7.33216 17.8773 3.42893C13.974 -0.474297 7.63836 -0.474297 3.73513 3.42893ZM16.4631 16.1569C13.3447 19.2752 8.26768 19.2752 5.14934 16.1569C2.031 13.0385 2.031 7.96149 5.14934 4.84315C8.26768 1.72481 13.3447 1.72481 16.4631 4.84315C19.5814 7.96149 19.5814 13.0385 16.4631 16.1569Z" fill="#DC2626"/>
        </svg>
      );
    }
    return null;
  };
  return (
    <>
      {
        location.pathname === '/' &&
        <div className='mx-40 my-9'>
          <>
            <div className='text-3xl font-bold'>
              通知
            </div>
            <div className='py-6 rounded-xl'>
              {/* メッセージがない場合 */}
              {messageDetail.length === 0 ? (
                <div className="flex items-center justify-center text-center text-black " style={{ minHeight: '230px' }}>
                  通知がありません
                </div>
              ) : (
                // メッセージがある場合
                messageDetail.map((message, index) => (
                  <div key={index} className='grid grid-cols-12 mb-4 border-b py-3'>
                    <div className='col-start-1 col-end-4 text-gray-600'>
                      {formatDate(message.date)}
                    </div>
                    <div
                      className={`col-start-4 col-end-12 pl-4 flex items-center ${
                        message.content.includes('（予定）')
                          ? 'text-[#B88B14]'  // (予定) の場合
                          : message.content.includes('（緊急）')
                          ? 'text-[#DC2626]'  // (緊急) の場合
                          : ''
                      }`}
                    >
                      {renderIcon(message.content)}
                      {message.content}
                    </div>
                    <div className='col-start-12 col-end-13'>
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='text-3xl font-bold my-9'>
              データ設定
            </div>
            <div className='flex items-center'>
              <Link to="dashboards/backups-settings" className='flex items-center py-3 px-4 border rounded'>
                <div className='font-bold'>バックアップ設定</div>
                <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                </svg></div>
              </Link>
              <Link to="dashboards/data-conversions" className='flex items-center py-3 px-4 border rounded ml-14'>
                <div className='font-bold'>データコンバート</div>
                <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                </svg></div>
              </Link>
            </div>
            <div className='text-3xl font-bold my-9'>
              ファイル管理
            </div>
            <div className=''>
              <div className='flex items-center'>
                <Link to="dashboards/admin-settings" className='flex items-center py-3 px-4 border rounded'>
                  <div className='font-bold'>管理者設定</div>
                  <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                  </svg>
                  </div>
                </Link>
                <Link to='dashboards/pos-coordination-settings' className='flex items-center py-3 px-4 border rounded ml-14'>
                  <div className='font-bold'>POS連携</div>
                  <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                  </svg></div>
                </Link>
                <Link to="dashboards/sales-tax-settings" className='flex items-center py-3 px-4 border rounded ml-14'>
                  <div className='font-bold'>消費税設定</div>
                  <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                  </svg></div>
                </Link>
                <div className='flex items-center py-3 px-4 border rounded ml-14'>
                  <div className='font-bold'>使用者設定</div>
                  <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                  </svg></div>
                </div>
                <Link to='dashboards/banks-api-settings' className='flex items-center py-3 px-4 border rounded ml-14'>
                  <div className='font-bold'>銀行API連携</div>
                  <div><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.48522 17.3513C9.43259 17.407 9.39145 17.4725 9.36414 17.5441C9.33683 17.6157 9.32389 17.692 9.32606 17.7686C9.32823 17.8452 9.34546 17.9206 9.37677 17.9905C9.40808 18.0605 9.45286 18.1235 9.50855 18.1762C9.56425 18.2288 9.62976 18.2699 9.70135 18.2973C9.77294 18.3246 9.84921 18.3375 9.9258 18.3353C10.0024 18.3332 10.0778 18.3159 10.1477 18.2846C10.2177 18.2533 10.2808 18.2085 10.3334 18.1528L15.2917 12.9028C15.3941 12.7945 15.4512 12.6511 15.4512 12.5021C15.4512 12.353 15.3941 12.2096 15.2917 12.1013L10.3334 6.85076C10.2811 6.79385 10.218 6.74789 10.1479 6.71556C10.0777 6.68323 10.0017 6.66517 9.92451 6.66242C9.84728 6.65968 9.77028 6.67231 9.69797 6.69958C9.62566 6.72685 9.55949 6.76821 9.50331 6.82127C9.44712 6.87432 9.40203 6.93801 9.37067 7.00864C9.33931 7.07927 9.32229 7.15543 9.32061 7.23269C9.31892 7.30995 9.33261 7.38677 9.36087 7.4587C9.38913 7.53063 9.4314 7.59622 9.48522 7.65167L14.0656 12.5021L9.48522 17.3513Z" fill="#1F2937" />
                  </svg></div>
                </Link>
              </div>
              <div className='flex items-center mt-6'>

              </div>
            </div>
          </>
        </div>
      }
      <Routes>
        <Route path="dashboards/*" element={<Dashboards />} />
        <Route path="backups-settings/*" element={<BackupsSettingsIndex />} />
        <Route path="data-conversions/*" element={<DataConversionsIndex />} />
        <Route path="admin-settings/*" element={<AdminSettingsIndex />} />
        <Route path="pos-coordination-settings/*" element={<PosCoordinationSettingsIndex />} />
        <Route path="sales-tax-settings/*" element={<SalesTaxSettingsIndex />} />
        <Route path="banks-api-settings/*" element={<BanksApiSettingsIndex />} />
      </Routes>
    </>
  )
}

export default Home;