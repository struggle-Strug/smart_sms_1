import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function DataConversionsAdd() {
  return (
    <div className="my-40 mx-80">  
      <div className='border rounded-lg py-3 px-2 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="/data-conversions" className={``}>戻る</Link></div>
    </div>
  )
}
export default DataConversionsAdd;