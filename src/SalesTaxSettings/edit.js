import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function SalesTaxSettingsEdit() {
    const { id } = useParams(); // URLから商品のIDを取得
    const [salesTaxSetting, setSalesTaxSetting] = useState({
        id: id, // 追加
        tax_rate: '',
        start_date: '',
        end_date: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    useEffect(() => {
        // 初期ロード時に商品のデータを取得
        ipcRenderer.send('edit-sales-tax-setting', id);
        ipcRenderer.on('edit-sales-tax-setting', (event, setProductData) => {
            setSalesTaxSetting(setProductData);
        });

        // コンポーネントのアンマウント時にリスナーを削除
        return () => {
            ipcRenderer.removeAllListeners('edit-sales-tax-setting');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSalesTaxSetting({ ...salesTaxSetting, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(salesTaxSetting.tax_rate, 'tax_rate', '消費税率');
        validator.required(salesTaxSetting.start_date, 'start_date', '適用開始日');
        // validator.maxLength(salesTaxSetting.tax_rate, 'tax_rate', '消費税率') // 追加

        setErrors(validator.getErrors());
        console.log(validator.required(salesTaxSetting.tax_rate, 'tax_rate', '消費税率'));

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-sales-tax-setting', salesTaxSetting);
            alert('消費税設定が更新されました。');
        }
    };

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>消費税率 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='消費税率を入力 (%)'
                            name="tax_rate"
                            value={salesTaxSetting.tax_rate}
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
                            value={salesTaxSetting.start_date}
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
                            value={salesTaxSetting.end_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/sales-tax-settings`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SalesTaxSettingsEdit;
