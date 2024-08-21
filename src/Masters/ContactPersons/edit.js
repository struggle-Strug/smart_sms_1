import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ContactPersonsEdit() {
    const { id } = useParams();  // URLから担当者IDを取得

    const [contactPerson, setContactPerson] = useState({
        id: '',
        name: '',
        department: '',
        position: '',
        phone_number: '',
        email: '',
        remarks: '',
    });

    useEffect(() => {
        // 初期ロード時に担当者データを取得
        ipcRenderer.send('edit-contact-person', id);
        ipcRenderer.on('edit-contact-person', (event, personData) => {
            setContactPerson(personData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-contact-person');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactPerson({ ...contactPerson, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-contact-person', contactPerson);
        alert('担当者情報が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>担当者情報編集</div>
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
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>役職</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='役職を入力' 
                            name="position" 
                            value={contactPerson.position} 
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
                            value={contactPerson.phone_number} 
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
                            value={contactPerson.email} 
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
                            value={contactPerson.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                    <div className='border rounded px-4 py-3 font-bold cursor-pointer' onClick={() => setContactPerson({
                        id: '',
                        name: '',
                        department: '',
                        position: '',
                        phone_number: '',
                        email: '',
                        remarks: '',
                    })}>キャンセル</div>
                </div>
            </div>
        </div>
    );
}

export default ContactPersonsEdit;
