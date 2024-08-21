import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ProductEdit() {
    const { id } = useParams(); // URLから商品のIDを取得
    const [product, setProduct] = useState({
        name: '',
        classification_primary: '',
        classification_secondary: '',
        jan_code: '',
        standard_retail_price: '',
        procurement_cost: '',
        manufacturer_name: '',
        specification: '',
        unit: '',
        country_of_origin: '',
        storage_location: '',
        storage_method: '',
        threshold: ''
    });

    useEffect(() => {
        // 初期ロード時に商品のデータを取得
        ipcRenderer.send('edit-product', id);
        ipcRenderer.on('edit-product', (event, productData) => {
            setProduct(productData);
        });

        // コンポーネントのアンマウント時にリスナーを削除
        return () => {
            ipcRenderer.removeAllListeners('edit-product');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-product', product);
        alert('商品情報が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>商品情報編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>商品名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='商品名を入力' 
                            name="name" 
                            value={product.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>商品分類1</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='商品分類1を入力' 
                            name="classification_primary" 
                            value={product.classification_primary} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>商品分類2</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='商品分類2を入力' 
                            name="classification_secondary" 
                            value={product.classification_secondary} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>JANコード</div>
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
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>標準売価</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='標準売価を入力' 
                            name="standard_retail_price" 
                            value={product.standard_retail_price} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>仕入単価</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='仕入単価を入力' 
                            name="procurement_cost" 
                            value={product.procurement_cost} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メーカー名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='メーカー名を入力' 
                            name="manufacturer_name" 
                            value={product.manufacturer_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>規格・仕様</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='規格・仕様を入力' 
                            name="specification" 
                            value={product.specification} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>単位</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='単位を入力' 
                            name="unit" 
                            value={product.unit} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>原産国</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='原産国を入力' 
                            name="country_of_origin" 
                            value={product.country_of_origin} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>保管場所</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='保管場所を入力' 
                            name="storage_location" 
                            value={product.storage_location} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='保管方法を入力' 
                            name="storage_method" 
                            value={product.storage_method} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>警告値</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='number' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='警告値を入力' 
                            name="threshold" 
                            value={product.threshold} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <button 
                        onClick={handleSubmit} 
                        className='bg-blue-600 text-white rounded px-4 py-2'
                    >
                        保存
                    </button>
                    <button 
                        onClick={() => setProduct({
                            name: '',
                            classification_primary: '',
                            classification_secondary: '',
                            jan_code: '',
                            standard_retail_price: '',
                            procurement_cost: '',
                            manufacturer_name: '',
                            specification: '',
                            unit: '',
                            country_of_origin: '',
                            storage_location: '',
                            storage_method: '',
                            threshold: ''
                        })} 
                        className='border rounded px-4 py-2 ml-4'
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductEdit;
