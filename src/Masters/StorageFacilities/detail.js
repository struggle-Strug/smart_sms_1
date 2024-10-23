import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function StorageFacilityDetail() {
    const { id } = useParams();
    const [facility, setFacility] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-storage-facility-detail', id);
        ipcRenderer.on('storage-facility-detail-data', (event, facilityData) => {
            setFacility(facilityData);
        });
        
        return () => {
            ipcRenderer.removeAllListeners('storage-facility-detail-data');
        };
    }, [id]);

    if (!facility) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{facility.name || '倉庫詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.code || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>倉庫所在地</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.address || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.phone_number || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>FAX番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.fax_number || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.contact_person || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.email || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.storage_method || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{facility.remarks || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StorageFacilityDetail;
