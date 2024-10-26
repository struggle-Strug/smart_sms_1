import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import Validator from '../../utils/validator';

const { ipcRenderer } = window.require('electron');

function StorageFacilityAdd() {
    const options = [
        { value: '倉庫', label: '倉庫' },
        { value: '社内', label: '社内' },
    ];

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

    const [errors, setErrors] = useState({});

    const validator = new Validator();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacility({ ...facility, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(facility.name, 'name', '倉庫名');
        validator.required(facility.address, 'address', '所在地');

        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
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
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規追加</div>
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
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='倉庫コードを入力' 
                            name="id" 
                            value={facility.id} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.id}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫所在地 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.address && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.address}</div>}
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
                            value={facility.phone_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.phone_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.phone_number}</div>}
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
                            value={facility.fax_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.fax_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.fax_number}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg白 w-2/3' 
                            placeholder='担当者名を入力' 
                            name="contact_person" 
                            value={facility.contact_person} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.contact_person && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.contact_person}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='email' 
                            className='border rounded px-4 py-2.5 bg白 w-2/3' 
                            placeholder='メールアドレスを入力' 
                            name="email" 
                            value={facility.email} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.email && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.email}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect placeholder={"1つお選びください"} options={options} name={"storage_method"} data={facility} setData={setFacility} />
                    </div>
                </div>
                {errors.email && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.email}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg白 w-2/3' 
                            placeholder='備考を入力' 
                            name="remarks" 
                            value={facility.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg白'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/master/storage-facilities`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default StorageFacilityAdd;
