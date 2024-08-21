import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function CompaniesEdit() {
    const { id } = useParams();  // URLから会社IDを取得

    const [company, setCompany] = useState({
        id: '',
        name: '',
        address: '',
        phone_number: '',
        fax_number: '',
        email: '',
        representive_name: '',
        bank_name: '',
        bank_account_number: '',
        bank_branch_name: '',
        bank_branch_code: '',
        account_type: '',
        remarks: '',
    });

    useEffect(() => {
        // 初期ロード時に会社データを取得
        ipcRenderer.send('edit-company', id);
        ipcRenderer.on('edit-company', (event, companyData) => {
            setCompany(companyData);
        });

        return () => {
            ipcRenderer.removeAllListeners('edit-company');
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-company', company);
        alert('会社情報が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>会社情報編集</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>会社名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='会社名を入力' 
                            name="name" 
                            value={company.name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>住所</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='住所を入力' 
                            name="address" 
                            value={company.address} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='電話番号を入力' 
                            name="phone_number" 
                            value={company.phone_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>FAX番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='FAX番号を入力' 
                            name="fax_number" 
                            value={company.fax_number} 
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
                            value={company.email} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>代表者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='代表者名を入力' 
                            name="representive_name" 
                            value={company.representive_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>銀行名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='銀行名を入力' 
                            name="bank_name" 
                            value={company.bank_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>銀行口座番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='銀行口座番号を入力' 
                            name="bank_account_number" 
                            value={company.bank_account_number} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>銀行支店名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='銀行支店名を入力' 
                            name="bank_branch_name" 
                            value={company.bank_branch_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>銀行支店コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='銀行支店コードを入力' 
                            name="bank_branch_code" 
                            value={company.bank_branch_code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>口座種別</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='口座種別を入力' 
                            name="account_type" 
                            value={company.account_type} 
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
                            value={company.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                    <div className='border rounded px-4 py-3 font-bold cursor-pointer' onClick={() => setCompany({
                        id: '',
                        name: '',
                        address: '',
                        phone_number: '',
                        fax_number: '',
                        email: '',
                        representive_name: '',
                        bank_name: '',
                        bank_account_number: '',
                        bank_branch_name: '',
                        bank_branch_code: '',
                        account_type: '',
                        remarks: '',
                    })}>キャンセル</div>
                </div>
            </div>
        </div>
    );
}

export default CompaniesEdit;
