import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function VendorEdit() {
    const { id } = useParams(); // URLから仕入先のIDを取得
    const [vendor, setVendor] = useState({
        name_primary: '',
        name_secondary: '',
        name_kana: '',
        phone_number: '',
        fax_number: '',
        zip_code: '',
        address: '',
        contact_person: '',
        email: '',
        terms_of_trade: '',
        remarks: ''
    });

    useEffect(() => {
        ipcRenderer.send('edit-vendor', id);
        ipcRenderer.on('edit-vendor', (event, vendorData) => {
            console.log(vendorData)
            setVendor(vendorData);
        });
        return () => {
            ipcRenderer.removeAllListeners('edit-vendor');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendor({ ...vendor, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-vendor', vendor);
        alert('仕入先情報が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>仕入先情報編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>仕入先名1 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='仕入先名1を入力' 
                            name="name_primary" 
                            value={vendor.name_primary} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>仕入先名2</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='仕入先名2を入力' 
                            name="name_secondary" 
                            value={vendor.name_secondary} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>カナ検索</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='カナ検索を入力' 
                            name="name_kana" 
                            value={vendor.name_kana} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='電話番号を入力' 
                            name="phone_number" 
                            value={vendor.phone_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>FAX番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='FAX番号を入力' 
                            name="fax_number" 
                            value={vendor.fax_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>郵便番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='郵便番号を入力' 
                            name="zip_code" 
                            value={vendor.zip_code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>住所</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='住所を入力' 
                            name="address" 
                            value={vendor.address} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='担当者名を入力' 
                            name="contact_person" 
                            value={vendor.contact_person} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='email' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='メールアドレスを入力' 
                            name="email" 
                            value={vendor.email} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>取引条件</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='取引条件を入力' 
                            name="terms_of_trade" 
                            value={vendor.terms_of_trade} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
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
                            value={vendor.remarks} 
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
                        onClick={() => setVendor({
                            name_primary: '',
                            name_secondary: '',
                            name_kana: '',
                            phone_number: '',
                            fax_number: '',
                            zip_code: '',
                            address: '',
                            contact_person: '',
                            email: '',
                            terms_of_trade: '',
                            remarks: ''
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

export default VendorEdit;
