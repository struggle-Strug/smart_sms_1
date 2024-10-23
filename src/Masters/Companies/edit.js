import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import Validator from '../../utils/validator'; // バリデーション用のクラスをインポート

const { ipcRenderer } = window.require('electron');

function CompaniesEdit() {
    const { id } = useParams();  // URLから会社IDを取得

    const [company, setCompany] = useState({
        id: '',
        name: '',
        code: '',
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

    const [errors, setErrors] = useState({}); // エラーメッセージ用の状態

    const validator = new Validator(); // バリデーターを初期化

    const options = [
        { value: '普通', label: '普通' },
        { value: '当座', label: '当座' },
    ];

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

    console.log(company)

    const handleSubmit = () => {
        // バリデーションを実行
        validator.required(company.name, 'name', '会社名');
        validator.required(company.code, 'code', '自社コード');
        validator.required(company.address, 'address', '住所');
        validator.required(company.bank_name, 'bank_name', '銀行名');
        validator.required(company.bank_account_number, 'bank_account_number', '銀行口座番号');
        validator.required(company.account_type, 'account_type', '口座種別');
        // validator.required(company.account_holder_name, 'account_holder_name', '口座名義人');

        setErrors(validator.getErrors()); // エラーを設定

        // エラーがなければ送信処理を行う
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-company', company);
            alert('会社情報が更新されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8 mb-16'>
                <div className='text-2xl font-bold mb-8'>{company.name}</div>
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
                {errors.name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>自社コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='自社コードを入力' 
                            name="code" 
                            value={company.code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>郵便番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='郵便番号を入力'
                            name="zip_code" 
                            value={company.zip_code} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.zip_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.zip_code}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>住所 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.address && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.address}</div>}

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
                {errors.phone_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.phone_number}</div>}

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
                {errors.fax_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.fax_number}</div>}

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
                {errors.email && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.email}</div>}

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
                {errors.representive_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.representive_name}</div>}

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>銀行名 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.bank_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.bank_name}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>銀行口座番号 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
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
                {errors.bank_account_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.bank_account_number}</div>}

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
                {errors.bank_branch_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.bank_branch_name}</div>}

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
                {errors.bank_branch_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.bank_branch_code}</div>}

                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>口座種別 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} name={"account_type"} data={company} setData={setCompany} placeholder='口座種別を選択' />
                    </div>
                </div>
                {errors.account_type && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.account_type}</div>}

                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>口座名義人（カタカナ） <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input 
                            type='text' 
                            className='border rounded px-4 py-2.5 bg-white w-2/3' 
                            placeholder='口座名義人を入力' 
                            name="account_holder_name" 
                            value={company.account_holder_name} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.account_holder_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.account_holder_name}</div>}

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
                            value={company.remarks} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                <Link to={`/master/companies`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default CompaniesEdit;
