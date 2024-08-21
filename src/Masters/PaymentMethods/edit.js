import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function PaymentMethodsEdit() {
    const { id } = useParams();  // URLから支払方法IDを取得

    const [paymentMethod, setPaymentMethod] = useState({
        id: '',
        name: '',
        remarks: '',
    });

    useEffect(() => {
        // 初期ロード時に支払方法データを取得
        ipcRenderer.send('edit-payment-method', id);
        ipcRenderer.on('edit-payment-method', (event, methodData) => {
            setPaymentMethod(methodData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-payment-method');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentMethod({ ...paymentMethod, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-payment-method', paymentMethod);
        alert('支払方法が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>支払方法編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>支払方法名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='支払方法名を入力' 
                            name="name" 
                            value={paymentMethod.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='備考を入力' 
                            name="remarks" 
                            value={paymentMethod.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                    <div className='border rounded px-4 py-3 font-bold cursor-pointer' onClick={() => setPaymentMethod({
                        id: '',
                        name: '',
                        remarks: '',
                    })}>キャンセル</div>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethodsEdit;
