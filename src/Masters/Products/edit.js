import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import Validator from '../../utils/validator';
import { Tooltip } from 'react-tooltip';

const { ipcRenderer } = window.require('electron');

function ProductEdit() {
    const { id } = useParams(); // URLから商品のIDを取得
    const [product, setProduct] = useState({
        id: id, //追加
        name: '',
        code: '',
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
        validator.required(product.name, 'name', '商品名');
        validator.required(product.classification_primary, 'classification_primary', 'カテゴリー');
        validator.required(product.jan_code, 'jan_code', 'JANコード');
        validator.required(product.unit, 'unit', '単位');

        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-product', product);
            alert('商品情報が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8 mb-16'>
                <div className='text-2xl font-bold mb-8'>{product.name}</div>
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
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>商品コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='商品コードを入力'
                            name="code"
                            value={product.code}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.classification_primary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.classification_primary}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリー<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.classification_primary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.classification_primary}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>サブカテゴリー</div>
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
                <div className="flex bg白">
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
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>仕入単価</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
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
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>規格・仕様</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='規格・仕様を入力'
                            name="specification"
                            value={product.specification}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>単位<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect placeholder={"1つ選んでください"} options={unitOptions} name={"unit"} data={product} setData={setProduct} />
                    </div>
                </div>
                {errors.unit && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.unit}</div>}
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>原産国</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
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
                        <CustomSelect placeholder={"1つ選んでください"} options={storageLocation} name={"storage_location"} data={product} setData={setProduct} />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='保管方法を入力'
                            name="storage_method"
                            value={product.storage_method}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4 flex items-center'>
                            警告値
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="各倉庫で設定した警告値を下回ると在庫補充アラートが出ます" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='警告値を入力'
                            name="threshold"
                            value={product.threshold}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg白'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/products`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default ProductEdit;