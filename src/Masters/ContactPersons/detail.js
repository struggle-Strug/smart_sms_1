import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ContactPersonDetail() {
    const { id } = useParams();
    const [contactPerson, setContactPerson] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-contact-person-detail', id);
        ipcRenderer.on('contact-person-detail-data', (event, data) => {
            setContactPerson(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('contact-person-detail-data');
        };
    }, [id]);

    if (!contactPerson) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className=' mb-8 flex'>
                    <div className='text-2xl font-bold'>{contactPerson.name || '担当者詳細'}</div>
                    <Link to={`/master/contact-persons/edit/${contactPerson.id}`} className='ml-auto py-3 px-4 border rounded-lg text-base font-bold'>編集する</Link>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>所属部署</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.department || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.code || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>役職</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.position || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.phone_number || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.email || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{contactPerson.remarks || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPersonDetail;
