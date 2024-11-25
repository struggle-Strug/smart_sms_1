import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function PaymentMethodDetail() {
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    ipcRenderer.send('get-payment-method-detail', id);
    ipcRenderer.on('payment-method-detail-data', (event, data) => {
      setPaymentMethod(data);
    });

    return () => {
      ipcRenderer.removeAllListeners('payment-method-detail-data');
    };
  }, [id]);

  if (!paymentMethod) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full'>
      <div className='p-8'>
        <div className=' mb-8 flex'>
          <div className='text-2xl font-bold'>{paymentMethod.name || '支払方法詳細'}</div>
          <Link to={`/master/payment-methods/edit/${paymentMethod.id}`} className='ml-auto py-3 px-4 border rounded-lg text-base font-bold'>編集する</Link>
        </div>
        <div className="flex bg-gray-100">
          <div className="w-1/5">
            <div className='p-4'>支払方法名</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{paymentMethod.name || ''}</div>
          </div>
        </div>
        <div className="flex bg-white">
          <div className="w-1/5">
            <div className='p-4'>支払方法コード</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{paymentMethod.code || ''}</div>
          </div>
        </div>
        <div className="flex bg-gray-100">
          <div className="w-1/5">
            <div className='p-4'>備考</div>
          </div>
          <div className="w-4/5 py-1.5">
            <div className='px-4 py-2.5'>{paymentMethod.remarks || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodDetail;
