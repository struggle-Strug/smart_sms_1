import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import Validator from '../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function DataConversionAdd() {
  // ↓味気ないので戻るボタン配置
  return (
    <div className="my-40 mx-80">  
      <div className='border rounded-lg py-3 px-2 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="/data-conversion" className={``}>戻る</Link></div>
    </div>
  )
}

export default DataConversionAdd;