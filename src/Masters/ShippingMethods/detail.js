import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ShippingMethodDetail() {
    const { id } = useParams();
    const [shippingMethod, setShippingMethod] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-shipping-method-detail', id);
        ipcRenderer.on('shipping-method-detail-data', (event, data) => {
            setShippingMethod(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('shipping-method-detail-data');
        };
    }, [id]);

    if (!shippingMethod) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{shippingMethod.name || '配送方法詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>配送方法名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{shippingMethod.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>配送方法コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{shippingMethod.code || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{shippingMethod.remarks || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShippingMethodDetail;
