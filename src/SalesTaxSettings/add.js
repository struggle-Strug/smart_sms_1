import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function SalesTaxSettingsAdd() {
    const [contactPerson, setContactPerson] = useState({
        tax_rate: '',
        start_date: '',
        end_date: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactPerson({ ...contactPerson, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(contactPerson.tax_rate, 'tax_rate', '消費税率');
        validator.required(contactPerson.start_date, 'start_date', '適用開始日');
        validator.required(contactPerson.tax_rate, 'tax_rate', '消費税率');

        setErrors(validator.getErrors());
        
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-sales-tax-setting', contactPerson);
            // フォームのリセット
            setContactPerson({
                tax_rate: '',
                start_date: '',
                end_date: '',
            });
            alert('商品が正常に追加されました。');
        }
    };

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規追加</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>消費税率 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='消費税率を入力'
                            name="tax_rate"
                            value={contactPerson.tax_rate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.tax_rate && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.tax_rate}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>適用開始日 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='date'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='適用開始日を入力'
                            name="start_date"
                            value={contactPerson.start_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.start_date && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.start_date}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>適用終了日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='date'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='適用終了日を入力'
                            name="end_date"
                            value={contactPerson.end_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/sales-tax-settings`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SalesTaxSettingsAdd;
