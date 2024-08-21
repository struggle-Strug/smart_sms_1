import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

function StorageFacilityAdd() {
    const [facility, setFacility] = useState({
        name: '',
        address: '',
        phone_number: '',
        fax_number: '',
        contact_person: '',
        email: '',
        storage_method: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacility({ ...facility, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-storage-facility', facility);
        // フォームのリセット
        setFacility({
            name: '',
            address: '',
            phone_number: '',
            fax_number: '',
            contact_person: '',
            email: '',
            storage_method: '',
            remarks: ''
        });
        alert('倉庫が正常に追加されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新しい倉庫を追加</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='倉庫名を入力' 
                            name="name" 
                            value={facility.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>所在地</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='所在地を入力' 
                            name="address" 
                            value={facility.address} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='電話番号を入力' 
                            name="phone_number" 
                            value={facility.phone_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>FAX番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='FAX番号を入力' 
                            name="fax_number" 
                            value={facility.fax_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='担当者名を入力' 
                            name="contact_person" 
                            value={facility.contact_person} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='email' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='メールアドレスを入力' 
                            name="email" 
                            value={facility.email} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='保管方法を入力' 
                            name="storage_method" 
                            value={facility.storage_method} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='備考を入力' 
                            name="remarks" 
                            value={facility.remarks} 
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
                        onClick={() => setFacility({
                            name: '',
                            address: '',
                            phone_number: '',
                            fax_number: '',
                            contact_person: '',
                            email: '',
                            storage_method: '',
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

export default StorageFacilityAdd;
