import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import Validator from '../../utils/validator';

const { ipcRenderer } = window.require('electron');

function SetProductEdit() {
    const { id } = useParams(); // URLから商品のIDを取得
    const [product, setProduct] = useState({
        id: id, // 追加
        set_product_name: '',
        code: '',
        category: '',
        sub_category: '',
        jan_code: '',
        tax_rate: '',
        warning_threshold: '',
        product_search: '',
        set_product_contents: '',
        set_product_price: ''
    });

    const unitOptions = [
        { value: 'kg', label: 'kg' },
        { value: 'mg', label: 'mg' },
    ];

    const storageLocation = [
        { value: '倉庫', label: '倉庫' },
        { value: '社内', label: '社内' },
    ];

    const [errors, setErrors] = useState({});

    const validator = new Validator();

    useEffect(() => {
        // 初期ロード時に商品のデータを取得
        ipcRenderer.send('edit-set-product', id);
        ipcRenderer.on('edit-set-product', (event, setProductData) => {
            setProduct(setProductData);
        });

        // コンポーネントのアンマウント時にリスナーを削除
        return () => {
            ipcRenderer.removeAllListeners('edit-set-product');
        };
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(product.set_product_name, 'set_product_name', 'セット商品名');
        validator.required(product.category, 'category', 'カテゴリー');
        validator.required(product.sub_category, 'sub_category', 'サブカテゴリー');
        validator.required(product.jan_code, 'jan_code', 'JANコード');
        validator.required(product.tax_rate, 'tax_rate', '税率');
        validator.required(product.warning_threshold, 'warning_threshold', '警告値');
        // validator.maxLength(product.set_product_name, 'set_product_name', 'セット商品名') // 追加

        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-set-product', product);
            alert('商品情報が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8 mb-16'>
                <div className='text-2xl font-bold mb-8'>{product.set_product_name}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>セット商品名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='セット商品名を入力' 
                            name="set_product_name" 
                            value={product.set_product_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>セット商品コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='セット商品コードを入力' 
                            name="code" 
                            value={product.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.set_product_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.set_product_name}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリー <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='カテゴリーを入力' 
                            name="category" 
                            value={product.category} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.category && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.category}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>サブカテゴリー<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='サブカテゴリーを入力' 
                            name="sub_category" 
                            value={product.sub_category} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.sub_category && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.sub_category}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>JANコード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='JANコードを入力' 
                            name="jan_code" 
                            value={product.jan_code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.jan_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.jan_code}</div>}
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>税率 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='税率を入力' 
                            name="tax_rate" 
                            value={product.tax_rate} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.tax_rate && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.tax_rate}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>警告値 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='警告値を入力' 
                            name="warning_threshold" 
                            value={product.warning_threshold} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.warning_threshold && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.warning_threshold}</div>}
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>商品検索</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg白 w-2/3' 
                            placeholder='商品検索を入力' 
                            name="product_search" 
                            value={product.product_search} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>セット内容</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='セット内容を入力' 
                            name="set_product_contents" 
                            value={product.set_product_contents} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>セット販売価格</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg白 w-2/3' 
                            placeholder='セット販売価格を入力' 
                            name="set_product_price" 
                            value={product.set_product_price} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg白'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/set-products`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SetProductEdit;
