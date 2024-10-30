import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function SalesTaxSettingsDetail() {
    const { id } = useParams();
    const [contactPerson, setContactPerson] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-sales-tax-setting-detail', id);
        ipcRenderer.on('set-sales-tax-setting-detail-data', (event, salesTaxSettingData) => {
            setContactPerson(salesTaxSettingData);
        });
        
        return () => {
            ipcRenderer.removeAllListeners('sales-tax-setting-detail-data');
        };
    }, [id]);

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className=' mb-8 flex'>
                    <div className='text-2xl font-bold'>担当者詳細</div>
                    <Link to={`/master/contact-persons/edit/1`} className='ml-auto py-3 px-4 border rounded-lg text-base font-bold'>編集する</Link>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>担当者</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>所属部署</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>所属部署</div>
                    </div>
                </div>
            </div>
        </div>



    );

    
}

export default SalesTaxSettingsDetail;
