import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function Index() {
    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>バックアップの新規作成</div>
                <div className='flex'>
                <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>新規追加</Link></div>
                </div>
            </div>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>バックアップから復元</div>
                <div className='flex'>
                <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-white text-black'><Link to="add" className={``}>ファイルを選択</Link></div>
                </div>
            </div>

        </div>
    )
}

function BackupsSettingsIndex() {
    return (
        <>
        <Routes>
        <Route path="" element={<Index />} />
        </Routes>
        </>
    )
}

export default BackupsSettingsIndex;