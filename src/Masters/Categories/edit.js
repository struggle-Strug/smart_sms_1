import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function CategoriesEdit() {
    const { id } = useParams();  // URLからカテゴリーIDを取得

    const [category, setCategory] = useState({
        id: '',
        name: '',
        code: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    useEffect(() => {
        // 初期ロード時にカテゴリーのデータを取得
        ipcRenderer.send('edit-category', id);
        ipcRenderer.on('edit-category', (event, categoryData) => {
            setCategory(categoryData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-category');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = () => {
        // バリデーションを実行
        validator.required(category.name, 'name', 'カテゴリ名');
        validator.required(category.code, 'code', 'カテゴリコード');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-category', category);
            alert('カテゴリーが更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{category.output_format}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリ名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='カテゴリ名を入力' 
                            name="name" 
                            value={category.name} 
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
                            value={category.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/subcategories`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default CategoriesEdit;
