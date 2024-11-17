import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function Index() {
  const [backupData, setBackupData] = useState(null);

  // useEffect内で受信したデータを扱う
  useEffect(() => {
    ipcRenderer.on('all-tables-data', (event, data) => {
      console.log("受信したデータ", data);
      setBackupData(data); // 受信したデータをstateに格納
    });

    return () => {
      ipcRenderer.removeAllListeners('all-tables-data');
    };
  }, []);

  // ボタン押下時に実行する処理
  const hoge = () => {
    ipcRenderer.send('export-all-tables-to-csv'); // ボタン押下でデータを要求
  };

  useEffect(() => {
    ipcRenderer.on('restore-all-tables-from-csv-reply', (event, data) => {
      console.log("復元結果", data);
      alert(data.message || data.error); // 復元結果をアラートで表示
    });

    return () => {
      ipcRenderer.removeAllListeners('restore-all-tables-from-csv-reply');
    };
  }, []);

  const restoreBackup = () => {
    ipcRenderer.send('restore-all-tables-from-csv');
  };

  return (
    <div>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>バックアップの新規作成</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'>
            <button onClick={hoge}>新規作成</button>
          </div>
        </div>

        <div className='pb-6 text-2xl font-bold'>バックアップから復元</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-white text-black'>
          <button onClick={restoreBackup}>復元</button>
          </div>
        </div>

        {/* 受信したデータを表示（任意） */}
        {backupData && (
          <div>
            <h3>バックアップデータ</h3>
            <pre>{JSON.stringify(backupData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function BackupsSettingsIndex() {
  return (
    <>
      <Routes>
        <Route path="" element={<Index />} />
      </Routes>
    </>
  );
}

export default BackupsSettingsIndex;
