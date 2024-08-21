import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
                <div className='text-2xl font-bold mb-8'>{paymentMethod.name || '支払方法詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>支払方法名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{paymentMethod.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{paymentMethod.remarks || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>作成日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{paymentMethod.created || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>更新日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{paymentMethod.updated || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethodDetail;
