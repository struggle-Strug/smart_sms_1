import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function PrimarySectionDetail() {
  const { id } = useParams();
  const [primarySection, setPrimarySection] = useState(null);

  useEffect(() => {
    ipcRenderer.send('get-primary-section-detail', id);
    ipcRenderer.on('primary-section-detail-data', (event, data) => {
      setPrimarySection(data);
    });

    return () => {
      ipcRenderer.removeAllListeners('primary-section-detail-data');
    };
  }, [id]);

  if (!primarySection) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full'>
      <div className='p-8'>
        <div className=' mb-8 flex'>
          <div className='text-2xl font-bold'>{primarySection.name || '区分詳細'}</div>
          <Link to={`/master/primary-sections/edit/${primarySection.id}`} className='ml-auto py-3 px-4 border rounded-lg text-base font-bold'>編集する</Link>
        </div>
        <div className="flex bg-gray-100">
          <div className="w-1/5">
            <div className='p-4'>区分名1</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{primarySection.name || ''}</div>
          </div>
        </div>
        <div className="flex bg-white">
          <div className="w-1/5">
            <div className='p-4'>区分コード</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{primarySection.code || ''}</div>
          </div>
        </div>
        <div className="flex bg-gray-100">
          <div className="w-1/5">
            <div className='p-4'>備考</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{primarySection.remarks || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrimarySectionDetail;
