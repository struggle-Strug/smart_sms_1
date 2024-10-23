import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import CustomSelect from '../../Components/CustomSelect';
import Validator from '../../utils/validator';

const { ipcRenderer } = window.require('electron');

function VendorAdd() {
    const [vendor, setVendor] = useState({
        name_primary: '',
        name_secondary: '',
        code: '',
        name_kana: '',
        phone_number: '',
        fax_number: '',
        zip_code: '',
        address: '',
        contact_person: '',
        email: '',
        terms_of_trade: '',
        remarks: '',
        classification1: '',     // 区分１
        classification2: '',     // 区分２
        tax_calculation: '',     // 消費税計算
        closing_date: '',        // 締日
        payment_date: '',        // 支払日
        payment_method: '',
    });

    const options = [
        { value: '現金', label: '現金' },
        { value: 'クレジット', label: 'クレジット' },
    ];

    const [errors, setErrors] = useState({});

    const validator = new Validator();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendor({ ...vendor, [name]: value });
    };

    const handleSubmit = () => {
        validator.required(vendor.name_primary, 'name_primary', '仕入先名1');
        validator.required(vendor.phone_number, 'phone_number', '電話番号');
        validator.required(vendor.address, 'address', '住所');

        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-vendor', vendor);
            // フォームのリセット
            setVendor({
                name_primary: '',
                name_secondary: '',
                code: '',
                name_kana: '',
                phone_number: '',
                fax_number: '',
                zip_code: '',
                address: '',
                contact_person: '',
                email: '',
                terms_of_trade: '',
                remarks: '',
                classification1: '',     // 区分１
                classification2: '',     // 区分２
                tax_calculation: '',     // 消費税計算
                closing_date: '',        // 締日
                payment_date: '',        // 支払日
                payment_method: '',      // 支払方法
            });
            alert('仕入先が正常に追加されました。');
        }
    };

    return (
        <div className='w-full'>
            <div className='p-8 mb-16'>
                <div className='text-2xl font-bold mb-8'>新規追加</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>仕入先名1 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='仕入先名1を入力'
                            name="name_primary"
                            value={vendor.name_primary}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.name_primary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_primary}</div>}
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>仕入れ先名（カタカナ）</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='カナ検索を入力'
                            name="name_kana"
                            value={vendor.name_kana}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4 flex items-center'>
                            仕入先名2
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="仕入先名の続き、支店名、部署名等" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='仕入先名2を入力'
                            name="name_secondary"
                            value={vendor.name_secondary}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>仕入先コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='仕入先コードを入力'
                            name="code"
                            value={vendor.code}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>電話番号 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='電話番号を入力'
                            name="phone_number"
                            value={vendor.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.phone_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.phone_number}</div>}
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>FAX</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='FAX番号を入力'
                            name="fax_number"
                            value={vendor.fax_number}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>担当者名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg-white w-2/3'
                            placeholder='担当者名を入力'
                            name="contact_person"
                            value={vendor.contact_person}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>メールアドレス</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='email'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='メールアドレスを入力'
                            name="email"
                            value={vendor.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
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
                            value={vendor.zip_code}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>住所 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='住所を入力'
                            name="address"
                            value={vendor.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {errors.address && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.address}</div>}
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>取引条件</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} placeholder={"1つ選んでください"} name={"terms_of_trade"} data={vendor} setData={setVendor} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>区分1</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} placeholder={"1つ選んでください"} name={"classification1"} data={vendor} setData={setVendor} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>区分2</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} placeholder={"1つ選んでください"} name={"classification2"} data={vendor} setData={setVendor} />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>消費税計算</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} placeholder={"1つ選んでください"} name={"tax_calculation"} data={vendor} setData={setVendor} />
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>締日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='住所を入力'
                            name="closing_date"
                            value={vendor.closing_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>支払日</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='住所を入力'
                            name="payment_date"
                            value={vendor.payment_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>支払い方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <CustomSelect options={options} placeholder={"1つ選んでください"} name={"payment_method"} data={vendor} setData={setVendor} />
                    </div>
                </div>
                <div className="flex bg白">
                    <div className="w-1/5">
                        <div className='p-4'>備考</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <input
                            type='text'
                            className='border rounded px-4 py-2.5 bg白 w-2/3'
                            placeholder='備考を入力'
                            name="remarks"
                            value={vendor.remarks}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg白'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`/master/vendors`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

export default VendorAdd;
