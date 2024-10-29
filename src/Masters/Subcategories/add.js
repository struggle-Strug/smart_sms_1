import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../utils/validator'; // バリデーション用のクラスをインポート
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function SubcategoryAdd() {
    const [subcategory, setCategory] = useState({
        name: '',
        code: '',
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...subcategory, [name]: value });
    };

    const handleSubmit = () => {
        // バリデーションを実行
        validator.required(subcategory.name, 'name', 'カテゴリ名');
        validator.required(subcategory.code, 'code', 'カテゴリコード');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-subcategory', subcategory);
            // フォームのリセット
            setCategory({
                name: '',
                code: '',
            });
            alert('新規登録が完了しました。');
            navigate("/master/subcategories");
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規登録</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4 flex items-center'>
                        カテゴリ名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span>
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="直営店・百貨店・自社EC・加盟店・期間限定店等" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='カテゴリ名を入力' 
                            name="name" 
                            value={subcategory.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリコード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='カテゴリコードを入力' 
                            name="code" 
                            value={subcategory.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/master/subcategories`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SubcategoryAdd;
