import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function SalesTaxSettingsEdit() {
    const [contactPerson, setContactPerson] = useState({
        name: '',
        department: '',
        position: '',
        phone_number: '',
        email: '',
        remarks: ''
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactPerson({ ...contactPerson, [name]: value });
    };

    const handleSubmit = () => {
        // バリデーションを実行
        validator.required(contactPerson.name, 'name', '担当者名');
        validator.required(contactPerson.phone_number, 'phone_number', '電話番号');
        validator.required(contactPerson.email, 'email', 'メールアドレス');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-contact-person', contactPerson);
            setContactPerson({
                name: '',
                department: '',
                position: '',
                phone_number: '',
                email: '',
                remarks: ''
            });
            alert('新規登録が完了しました。');
        }
    };

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規登録</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='担当者名を入力'
                            name="name"
                            value={contactPerson.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>所属部署</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='所属部署を入力'
                            name="department"
                            value={contactPerson.department}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.department && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.department}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='担当者コードを入力'
                            name="id"
                            value={contactPerson.id}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.id}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/sales-tax-settings`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SalesTaxSettingsEdit;
