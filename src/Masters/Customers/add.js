import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import { Tooltip } from 'react-tooltip';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../utils/validator';
import { useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function CustomersAdd() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validator = new Validator();

    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [customer, setCustomer] = useState({
        code: '',
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

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(customer.name_primary, 'name_primary', '得意先名1');
        validator.required(customer.code, 'code', '得意先コード');
        validator.required(customer.phone_number, 'phone_number', '電話番号');
        validator.required(customer.fax_number, 'fax_number', 'Fax');
        validator.required(customer.address, 'address', '住所');

        setErrors(validator.getErrors());
        if (!validator.hasErrors()) {
            ipcRenderer.send('save-customer', customer);
            alert('新規登録が完了しました。');
            navigate("/master/customers");
        }
    };

    return (
        <div className='w-full mb-20'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>新規登録</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>得意先名1 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='得意先名1を入力' name="name_primary" value={customer.name_primary} onChange={handleChange} />
                    </div>
                </div>
                {errors.name_primary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_primary}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>得意先名1(カタカナ)</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='得意先名1(カタカナ)を入力' name="name_kana" value={customer.name_kana} onChange={handleChange} />
                    </div>
                </div>
                {errors.name_kana && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_kana}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4 flex items-center'>
                            得意先名2
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="得意先名の続き、支店名、部署名等" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='得意先名2を入力' name="name_secondary" value={customer.name_secondary} onChange={handleChange} />
                    </div>
                </div>
                {errors.name_secondary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_secondary}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>得意先コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='得意先コードを入力' name="code" value={customer.code} onChange={handleChange} />
                    </div>
                </div>
                {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='電話番号を入力' name="phone_number" value={customer.phone_number} onChange={handleChange} />
                    </div>
                </div>
                {errors.phone_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.phone_number}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>FAX <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='FAXを入力' name="fax_number" value={customer.fax_number} onChange={handleChange} />
                    </div>
                </div>
                {errors.fax_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.fax_number}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='email' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='メールアドレスを入力' name="email" value={customer.email} onChange={handleChange} />
                    </div>
                </div>
                {errors.email && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.email}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>郵便番号</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='郵便番号を入力' name="zip_code" value={customer.zip_code} onChange={handleChange} />
                    </div>
                </div>
                {errors.zip_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.zip_code}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>住所<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='住所を入力' name="address" value={customer.address} onChange={handleChange} />
                    </div>
                </div>
                {errors.address && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.address}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>敬称</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} name={"honorific"} data={customer} setData={setCustomer} />
                    </div>
                </div>
                {errors.honorific && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.honorific}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>請求先コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='請求先コードを入力' name="billing_code" value={customer.billing_code} onChange={handleChange} />
                    </div>
                </div>
                {errors.billing_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.billing_code}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>請求情報</div>
                    </div>
                    <div className="w-4/5 py-1.5 flex items-end">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-48' placeholder='請求情報を入力' name="billing_information" value={customer.billing_information} onChange={handleChange} />
                    </div>
                </div>
                {errors.billing_information && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.billing_information}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                    <div className='p-4 flex items-center'>
                            月次売上目標
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="月次売上推移表に表示" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='number' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='月次売上目標を入力' name="monthly_sales_target" value={customer.monthly_sales_target} onChange={handleChange} />
                    </div>
                </div>
                {errors.monthly_sales_target && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.monthly_sales_target}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='備考を入力' name="remarks" value={customer.remarks} onChange={handleChange} />
                    </div>
                </div>
                {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/master/customers`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default CustomersAdd;
