import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-category-detail', id);
        ipcRenderer.on('category-detail-data', (event, data) => {
            setCategory(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('category-detail-data');
        };
    }, [id]);

    if (!category) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{category.name || 'カテゴリ詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリ名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{category.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリコード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{category.code || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;
