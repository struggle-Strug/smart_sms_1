import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Validator from '../../utils/validator';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function PaymentMethodsEdit() {
    const { id } = useParams();  // URLから支払方法IDを取得

    const [paymentMethod, setPaymentMethod] = useState({
        id: '',
        name: '',
        code: '',
        remarks: '',
    });

    const [errors, setErrors] = useState({}); // エラー状態を管理

    const validator = new Validator(); // バリデーターを初期化

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
        validator.required(paymentMethod.name, 'name', '支払方法名');

        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-payment-method', paymentMethod);
            alert('支払方法が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{paymentMethod.name}</div>
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
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>支払方法コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='支払方法コードを入力' 
                            name="code" 
                            value={paymentMethod.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.id}</div>}
                <div className="flex bg-gray-100">
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
                {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/payment-methods`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default PaymentMethodsEdit;
