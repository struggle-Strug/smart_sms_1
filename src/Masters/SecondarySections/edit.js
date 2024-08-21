import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function SecondarySectionsEdit() {
    const { id } = useParams();  // URLから区分IDを取得

    const [secondarySection, setSecondarySection] = useState({
        id: '',
        name: '',
        remarks: '',
    });


    console.log(secondarySection)

    useEffect(() => {
        // 初期ロード時に区分データを取得
        console.log("effect")
        ipcRenderer.send('edit-secondary-section', id);
        ipcRenderer.on('edit-secondary-section', (event, sectionData) => {
            console.log(sectionData)
            setSecondarySection(sectionData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-secondary-section');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSecondarySection({ ...secondarySection, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-secondary-section', secondarySection);
        alert('区分が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>区分編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>区分名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='区分名を入力' 
                            name="name" 
                            value={secondarySection.name} 
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
                            value={secondarySection.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                    <div className='border rounded px-4 py-3 font-bold cursor-pointer' onClick={() => setSecondarySection({
                        id: '',
                        name: '',
                        remarks: '',
                    })}>キャンセル</div>
                </div>
            </div>
        </div>
    );
}

export default SecondarySectionsEdit;
