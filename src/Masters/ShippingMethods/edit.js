import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function ShippingMethodsEdit() {
    const { id } = useParams();  // URLから配送方法IDを取得

    const [shippingMethod, setShippingMethod] = useState({
        id: id,
        name: '',
        code: '',
        remarks: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    useEffect(() => {
        // 初期ロード時に配送方法データを取得
        ipcRenderer.send('edit-shipping-method', id);
        ipcRenderer.on('edit-shipping-method', (event, methodData) => {
            setShippingMethod(methodData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-shipping-method');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingMethod({ ...shippingMethod, [name]: value });
    };

    const handleSubmit = () => {
        // バリデーションを実行
        validator.required(shippingMethod.name, 'name', '配送方法名');
        validator.required(shippingMethod.id, 'id', '配送方法コード');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-shipping-method', shippingMethod);
            alert('配送方法が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{shippingMethod.name}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>配送方法名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='配送方法名を入力' 
                            name="name" 
                            value={shippingMethod.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}
                
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>配送方法コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='配送方法コードを入力' 
                            name="code" 
                            value={shippingMethod.code} 
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
                            value={shippingMethod.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/shipping-methods`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default ShippingMethodsEdit;
