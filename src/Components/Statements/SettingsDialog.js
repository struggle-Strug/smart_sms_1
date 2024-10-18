import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

const SettingsDialog = ({ isOpen, onConfirm, onCancel, settingId }) => {
    const [outputFormat, setOutputFormat] = useState('csv');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (settingId) {
            ipcRenderer.send('get-statement-setting-detail', settingId);
            ipcRenderer.once('statement-setting-detail-data', (event, data) => {
                if (data) {
                    setOutputFormat(data.output_format || 'csv');
                    setRemarks(data.remarks || '');
                }
            });
        }
    }, [settingId]);

    if (!isOpen) return null;

    const handleSave = () => {
        const settingData = {
            id: settingId,
            output_format: outputFormat,
            remarks: remarks,
        };
        
        ipcRenderer.send('save-statement-setting', settingData);
        ipcRenderer.once('load-statement-settings', (event, data) => {
            onConfirm(data); // 更新されたデータを返す
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="container mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-md">
                <p className='text-2xl font-bold px-6 py-4'>明細表設定</p>
                <hr />
                <div className='flex-col px-6 pt-4'>
                    <div className=''>出力形式選択</div>
                    <div className='mt-2.5 flex'>
                        <label className='text-base'>
                            <input
                                type="radio"
                                name="outputFormat"
                                value="csv"
                                checked={outputFormat === 'csv'}
                                onChange={() => setOutputFormat('csv')}
                                className='mr-2'
                            />csv
                        </label>
                        <label className='text-base ml-10'>
                            <input
                                type="radio"
                                name="outputFormat"
                                value="Excel"
                                checked={outputFormat === 'Excel'}
                                onChange={() => setOutputFormat('Excel')}
                                className='mr-2'
                            />Excel
                        </label>
                        <label className='text-base ml-10'>
                            <input
                                type="radio"
                                name="outputFormat"
                                value="PDF"
                                checked={outputFormat === 'PDF'}
                                onChange={() => setOutputFormat('PDF')}
                                className='mr-2'
                            />PDF
                        </label>
                        <label className='text-base ml-10'>
                            <input
                                type="radio"
                                name="outputFormat"
                                value="print"
                                checked={outputFormat === 'print'}
                                onChange={() => setOutputFormat('print')}
                                className='mr-2'
                            />印刷
                        </label>
                    </div>
                </div>
                <div className='px-6 pb-4'>
                    <div className='py-2.5 text-xl'>備考</div>
                    <div className='pb-2'>
                        <textarea
                            className='border rounded px-4 py-2.5 bg-white w-full resize-none'
                            placeholder=''
                            rows={5}
                            name="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <hr />
                <div className="flex justify-end py-4 px-6">
                    <button onClick={onCancel} className="px-5 py-3 font-semibold text-base mr-6 bg-white border border-gray-300 rounded-xl">キャンセル</button>
                    <button onClick={handleSave} className="px-11 py-3 font-semibold text-base bg-blue-600 text-white border-0 rounded-xl">保存</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsDialog;

