import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

function PrimarySectionAdd() {
    const [primarySection, setPrimarySection] = useState({
        name: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrimarySection({ ...primarySection, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-primary-section', primarySection);
        // フォームのリセット
        setPrimarySection({
            name: '',
            remarks: ''
        });
        alert('新規登録が完了しました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>区分の新規登録</div>
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
                            value={primarySection.name} 
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
                            value={primarySection.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div 
                        className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' 
                        onClick={handleSubmit}
                    >
                        新規登録
                    </div>
                    <div 
                        className='border rounded px-4 py-3 font-bold cursor-pointer' 
                        onClick={() => setPrimarySection({
                            name: '',
                            remarks: ''
                        })}
                    >
                        キャンセル
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrimarySectionAdd;
