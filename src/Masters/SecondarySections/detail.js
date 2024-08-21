import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function SecondarySectionDetail() {
    const { id } = useParams();
    const [secondarySection, setSecondarySection] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-secondary-section-detail', id);
        ipcRenderer.on('secondary-section-detail-data', (event, data) => {
            setSecondarySection(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('secondary-section-detail-data');
        };
    }, [id]);

    if (!secondarySection) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{secondarySection.name || '区分詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>区分名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{secondarySection.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{secondarySection.remarks || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>作成日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{secondarySection.created || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>更新日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{secondarySection.updated || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecondarySectionDetail;
