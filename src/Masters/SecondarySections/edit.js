import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function SecondarySectionsEdit() {
    const { id } = useParams();  // URLから区分IDを取得

    const [secondarySection, setSecondarySection] = useState({
        id: '',
        name: '',
        code: '',
        remarks: '',
    });

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    useEffect(() => {
        // 初期ロード時に区分データを取得
        console.log("effect");
        ipcRenderer.send('edit-secondary-section', id);
        ipcRenderer.on('edit-secondary-section', (event, sectionData) => {
            console.log(sectionData);
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
        // バリデーションを実行
        validator.required(secondarySection.name, 'name', '区分名2');
        validator.required(secondarySection.id, 'id', '区分コード2');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-secondary-section', secondarySection);
            alert('区分が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{secondarySection.name}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>区分名2 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>区分コード2 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='区分コードを入力' 
                            name="code" 
                            value={secondarySection.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}

                <div className="flex bg-gray-100">
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
                {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/secondary-sections`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default SecondarySectionsEdit;
