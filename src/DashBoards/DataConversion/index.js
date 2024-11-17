import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DataConversionAdd from './add';

const { ipcRenderer } = window.require('electron');

function Index() {
  return (
    <div className='mx-8'>
      <div className='p-8'>
        <div className='pb-6 text-2xl font-bold'>データコンバート</div>
        <div className='flex'>
        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>インポート</Link></div>
        </div>
        <table className="w-full mt-8 table-auto">
        <thead className=''>
          <tr className='border-b'>
            <th className='text-left pb-2.5'>ファイル名</th>
            <th className='text-left pb-2.5 font-normal'>完了日時</th>
            <th className='text-left pb-2.5 font-normal'>総行数</th>
            <th className='text-left pb-2.5 font-normal'>更新されたレコード</th>
            <th className='text-left pb-2.5 font-normal'>インポートされた行数</th>
            <th className='text-left pb-2.5 font-normal'>新規レコード</th>
          </tr>
      </thead>

        </table>
      </div>
      <div className='p-8'>
      </div>

    </div>
  )
}

function DataConversionIndex() {
  return (
    <>
    <Routes>
    <Route path="" element={<Index />} />
    <Route path="add" element={<DataConversionAdd />} />
    </Routes>
    </>
  )
}

export default DataConversionIndex;