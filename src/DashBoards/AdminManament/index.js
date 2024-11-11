import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AdminSettingsAdd from './add';
import AdminSettingsEdit from'./edit';

const { ipcRenderer } = window.require('electron');

function Index() {

  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    ipcRenderer.send('load-admin-settings');
    ipcRenderer.on('admin-settings-data',(event, data) => {
      console.log("受信したデータ",data);
      setAdmin(data); 
    });
    return () => {
      ipcRenderer.removeAllListeners('admin-settings-data');
    };
  }, []);



  return (
    <div>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>ユーザー設定</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>新規追加</Link></div>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className='border-b'>
              <th className='text-left font-bold py-2.5 px-2 w-[232px]'>ユーザー名</th>
              <th className='text-left font-normal py-2.5 px-2 w-[232px]'>アクセスレベル</th>
              <th className='text-left font-normal py-2.5 px-2'>操作</th>
            </tr>
          </thead>
          <tbody>
            {admin.map((data) => (
              <tr className='border-b' key={data.id}>
                <td className='py-2.5 px-2'>{data.user_name}</td>
                <td className='py-2.5 px-2'>
                  {data.access_level === '1' ? '管理者' : data.access_level === '0' ? 'マスター管理者' : '未定義'}
                </td>
                <td className='py-2.5 px-2'>
                <Link to={`edit/${data.id}`} className="text-blue-500 underline">編集</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminSettingsIndex() {
  return (
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="add" element={<AdminSettingsAdd />} />
        <Route path="edit/:id" element={<AdminSettingsEdit />} />
      </Routes>
  )
}

export default AdminSettingsIndex;