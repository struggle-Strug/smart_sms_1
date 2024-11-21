import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function Index() {
  const [backupData, setBackupData] = useState(null);

  // IPCイベントのリスナーを登録
  useEffect(() => {
    ipcRenderer.on('export-all-tables-to-zip-reply', (event, response) => {
      if (response.error) {
        console.error("エクスポート失敗:", response.error);
        alert(`エクスポート失敗: ${response.error}`);
      } else {
        console.log("エクスポート成功:", response.zipPath);
        alert(`バックアップZIPが作成されました: ${response.zipPath}`);
      }
    });

    ipcRenderer.on('restore-all-tables-from-csv-reply', (event, data) => {
      console.log("復元結果", data);
      alert(data.message || data.error);
    });

    return () => {
      ipcRenderer.removeAllListeners('export-all-tables-to-zip-reply');
      ipcRenderer.removeAllListeners('restore-all-tables-from-csv-reply');
    };
  }, []);

  // ZIPファイル作成要求
  const createBackupZip = () => {
    ipcRenderer.invoke('export-all-tables-to-zip');
  };

  // CSVから復元
  const restoreBackup = () => {
    ipcRenderer.send('restore-all-tables-from-csv');
  };

  // データベース初期化
  const resetData = () => {
    ipcRenderer.send('reset-database');
  };

  return (
    <div>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>バックアップの新規作成</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'>
            <button onClick={createBackupZip}>ZIPファイルを作成</button>
          </div>
        </div>

        <div className='pb-6 text-2xl font-bold'>バックアップから復元</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-white text-black'>
            <button onClick={restoreBackup}>復元</button>
          </div>
        </div>

        <div className='pb-6 text-2xl font-bold'>データを初期化</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-white text-black'>
            <button onClick={resetData}>初期化</button>
          </div>
        </div>

        {/* バックアップデータ表示（任意） */}
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
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  );
}

export default BackupsSettingsIndex;
