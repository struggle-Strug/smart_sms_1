import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function CustomersEdit() {
    const { id } = useParams();  // URLから顧客IDを取得
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [customer, setCustomer] = useState({
        id: '',
        name_primary: '',
        name_secondary: '',
        name_kana: '',
        honorific: '',
        phone_number: '',
        fax_number: '',
        zip_code: '',
        address: '',
        email: '',
        remarks: '',
        billing_code: '',
        billing_information: '',
        monthly_sales_target: ''
    });

    useEffect(() => {
        // 初期ロード時に顧客データを取得
        ipcRenderer.send('edit-customer', id);
        ipcRenderer.on('edit-customer', (event, customerData) => {
            setCustomer(customerData);
        });

        // クリック時のイベント設定
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            ipcRenderer.removeAllListeners('edit-customer');
        };
    }, [id]);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = () => {
        ipcRenderer.send('save-customer', customer);
        alert('顧客情報が更新されました。');
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>株式会社テスト</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>得意先名1 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_primary" value={customer.name_primary} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>顧客名1(カタカナ) <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_kana" value={customer.name_kana} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>取引先名2 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_secondary" value={customer.name_secondary} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>取引先コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="billing_code" value={customer.billing_code} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="phone_number" value={customer.phone_number} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>FAX <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="fax_number" value={customer.fax_number} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='email' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="email" value={customer.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>郵便番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="zip_code" value={customer.zip_code} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>住所<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="address" value={customer.address} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>敬称</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="honorific" value={customer.honorific} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>請求先コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="billing_code" value={customer.billing_code} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>請求情報</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="billing_information" value={customer.billing_information} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>月次売上目標</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='number' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="monthly_sales_target" value={customer.monthly_sales_target} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="remarks" value={customer.remarks} onChange={handleChange} />
                    </div>
                </div>
                <div className='flex mt-8'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>保存</div>
                    <div className='border rounded px-4 py-3 font-bold cursor-pointer' onClick={() => setCustomer({
                        id: '',
                        name_primary: '',
                        name_secondary: '',
                        name_kana: '',
                        honorific: '',
                        phone_number: '',
                        fax_number: '',
                        zip_code: '',
                        address: '',
                        email: '',
                        remarks: '',
                        billing_code: '',
                        billing_information: '',
                        monthly_sales_target: ''
                    })}>キャンセル</div>
                </div>
            </div>
        </div>
    );
}

export default CustomersEdit;
