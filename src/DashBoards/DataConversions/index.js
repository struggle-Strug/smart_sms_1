import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DataConversionsAdd from './add';

const { ipcRenderer } = window.require('electron');

function Index() {
  const [dataConversions, setDataConversions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // 選択されたファイル

  useEffect(() => {
    ipcRenderer.send('load-data-conversions');
    ipcRenderer.on('data-conversions-data', (event, data) => {
      console.log("受信したデータ", data);
      setDataConversions(data); 
    });

    return () => {
      ipcRenderer.removeAllListeners('data-conversions-data');
    };
  }, []);

  const handleFolderSelection = async () => {
    const result = await ipcRenderer.invoke('show-folder-dialog', {
        properties: ['openDirectory'], // フォルダ選択
    });
    console.log(result.filePaths);
    setSelectedFile(result.filePaths[0]);
  };

  // const handleFileSelection = async () => {
  //   // Electronのダイアログを使ってファイルを選択
  //   const result = await ipcRenderer.invoke('show-file-dialog', {
  //     properties: ['openFile'], // ファイル選択のみ許可
  //     filters: [
  //       { name: 'Excel Files', extensions: ['xlsx', 'xls'] }, // Excelファイルのフィルター
  //     ],
  //   });

  //   if (!result.canceled && result.filePaths.length > 0) {
  //     setSelectedFile(result.filePaths[0]);
  //     console.log("選択されたファイル:", result.filePaths[0]);
  //   } else {
  //     console.log("ファイル選択がキャンセルされました");
  //   }
  // };

  const handleImport = () => {
    if (!selectedFile) {
      alert("ファイルを選択してください");
      return;
    }

    const csvDirPath = '/Users/esakiryota/smart-sms/public/excel/csv'; // 一時的なCSV保存ディレクトリ
    const excelDirPath = selectedFile;
    console.log(excelDirPath);

    // バックエンドにインポートリクエストを送信
    ipcRenderer.send('import-excel-to-database', {
      excelDirPath,
      csvDirPath,
    });
    ipcRenderer.send('save-excel-to-db', selectedFile);
  };

  // インポート完了やエラー通知をリッスン
  useEffect(() => {
    const importListener = (event, response) => {
      if (response.error) {
        console.error("インポートエラー:", response.error);
        alert("インポートエラー: " + response.error);
      } else {
        console.log("インポート成功:", response.message);
        alert("インポート完了");
        setSelectedFile(null); // ファイル選択をリセット
      }
    };

    ipcRenderer.on('import-excel-to-database-reply', importListener);

    // クリーンアップ時にリスナーを削除
    return () => {
      ipcRenderer.removeListener('import-excel-to-database-reply', importListener);
    };
  }, []);  // 依存配列が空なので一度だけ設定されます

  return (
    <div>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>データコンバート</div>
        <div className='flex'>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white mr-4'>
            <button onClick={handleFolderSelection}>ファイルを選択</button>
          </div>
          <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-green-600 text-white'>
            <button onClick={handleImport}>インポート</button>
          </div>
        </div>
        <div className='pb-4'>
          <span className='text-sm text-gray-600'>選択されたファイル:</span> 
          <span className='text-sm font-bold'>{selectedFile || "ファイル未選択"}</span>
        </div>
        <table className="w-full table-auto">
          <thead className=''>
            <tr className='border-b'>
              <th className='text-left text-base py-2.5'>ファイル名</th>
              <th className='text-left text-base py-2.5 font-normal'>完了日時</th>
              <th className='text-left text-base py-2.5 font-normal'>総行数</th>
              <th className='text-left text-base py-2.5 font-normal'>更新されたレコード</th>
              <th className='text-left text-base py-2.5 font-normal'>インポートされた行数</th>
              <th className='text-left text-base py-2.5 font-normal'>新規レコード</th>
            </tr>
          </thead>
          <tbody>
            {dataConversions.map((data) => (
              <tr className='border-b' key={data.id}>
                <td className='py-2.5'>{data.file_name || <div className='border w-4'></div>}</td>
                <td className='py-2.5'>{data.complete_time || <div className='border w-4'></div>}</td>
                <td className='py-2.5'>{data.total_line_count || <div className='border w-4'></div>}</td>
                <td className='py-2.5'>{data.updated_record || <div className='border w-4'></div>}</td>
                <td className='py-2.5'>{data.imported_line_count || <div className='border w-4'></div>}</td>
                <td className='py-2.5'>{data.new_record || <div className='border w-4'></div>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DataConversionsIndex() {
  return (
    <>
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="add" element={<DataConversionsAdd />} />
      </Routes>
    </>
  );
}

export default DataConversionsIndex;
