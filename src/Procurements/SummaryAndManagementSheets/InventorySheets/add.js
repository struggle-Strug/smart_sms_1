import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function InventoriesAdd() {
    const [inventory, setInventory] = useState({
      product_id: '',
      product_name: '',
      lot_number: '',
      inventory: '',
      estimated_inventory: '',
      warning_value: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventory({ ...inventory, [name]: value });
    };

    const handleSubmit = () => {
        // validator.required(inventory.tax_rate, 'tax_rate', '消費税率');
        // validator.required(inventory.start_date, 'start_date', '適用開始日');
        // validator.required(inventory.tax_rate, 'tax_rate', '消費税率');

        // setErrors(validator.getErrors());
        
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-inventory', inventory);
            // フォームのリセット
            setInventory({
                product_id: '',
                product_name: '',
                lot_number: '',
                inventory: '',
                estimated_inventory: '',
                warning_value: '',
            });
            alert('在庫表が正常に追加されました。');
        }
    };

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規追加</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>商品コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='商品コードを入力'
                            name="product_id"
                            value={inventory.product_id}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* {errors.product_id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.product_id}</div>} */}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>商品名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='商品名を入力'
                            name="product_name"
                            value={inventory.product_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* {errors.product_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.product_name}</div>} */}

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>ロット番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='ロット番号を入力'
                            name="lot_number"
                            value={inventory.lot_number}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>在庫数</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='在庫数を入力'
                            name="inventory"
                            value={inventory.inventory}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>在庫予定数</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='number'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='在庫予定数を入力'
                            name="estimated_inventory"
                            value={inventory.estimated_inventory}
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
                            name="warning_value"
                            value={inventory.warning_value}
                            onChange={handleChange}
                        />
                    </div>
                </div>

            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/inventories`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default InventoriesAdd;
