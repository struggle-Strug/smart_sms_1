// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import CustomSelect from '../../Components/CustomSelect';
// import { Tooltip } from 'react-tooltip';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import Validator from '../../utils/validator';
// import { useNavigate } from 'react-router-dom';

// const { ipcRenderer } = window.require('electron');

// function PurchaseOrdersAdd() {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const location = useLocation();
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const validator = new Validator();

//     const options = [
//         { value: '御中', label: '御中' },
//         { value: '貴社', label: '貴社' },
//     ];

//     const [customer, setCustomer] = useState({
//         id: '',
//         name_primary: '',
//         name_secondary: '',
//         name_kana: '',
//         honorific: '',
//         phone_number: '',
//         fax_number: '',
//         zip_code: '',
//         address: '',
//         email: '',
//         remarks: '',
//         billing_code: '',
//         billing_information: '',
//         monthly_sales_target: ''
//     });

//     const toggleDropdown = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleClickOutside = (event) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setIsOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCustomer({ ...customer, [name]: value });
//     };

//     const handleSubmit = () => {
//         validator.required(customer.name_primary, 'name_primary', '得意先名1');
//         validator.required(customer.billing_code, 'billing_code', '得意先コード');
//         validator.required(customer.phone_number, 'phone_number', '電話番号');
//         validator.required(customer.fax_number, 'fax_number', 'Fax');
//         validator.required(customer.address, 'address', '住所');

//         setErrors(validator.getErrors());
//         if (!validator.hasErrors()) {
//             ipcRenderer.send('save-customer', customer);
//             alert('新規登録が完了しました。');
//             navigate("/master/customers");
//         }
//     };

//     return (
//         <div className='w-full'>
//             <div className='p-8'>
//                 <div className='text-2xl font-bold mb-8'>新規登録</div>
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>得意先名1 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_primary" value={customer.name_primary} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.name_primary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_primary}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>顧客名1(カタカナ)</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_kana" value={customer.name_kana} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.name_kana && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_kana}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4 flex items-center'>
//                             得意先名2
//                             <a data-tooltip-id="my-tooltip" data-tooltip-content="得意先名の続き、支店名、部署名等" className='flex ml-3'>
//                                 <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
//                                 </svg>
//                             </a>
//                             <Tooltip id="my-tooltip" />
//                         </div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="name_secondary" value={customer.name_secondary} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.name_secondary && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.name_secondary}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>得意先コード <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="billing_code" value={customer.billing_code} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.billing_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.billing_code}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>電話番号 <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="phone_number" value={customer.phone_number} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.phone_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.phone_number}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>FAX <span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='株式会社テスト' name="fax_number" value={customer.fax_number} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.fax_number && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.fax_number}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>メールアドレス</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='email' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="email" value={customer.email} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.email && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.email}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>郵便番号</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="zip_code" value={customer.zip_code} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.zip_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.zip_code}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>住所<span className='text-red-600 bg-red-100 py-0.5 px-1.5'>必須</span></div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="address" value={customer.address} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.address && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.address}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>敬称</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <CustomSelect options={options} name={"honorific"} data={customer} setData={setCustomer} />
//                     </div>
//                 </div>
//                 {errors.honorific && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.honorific}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>請求先コード</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="billing_code" value={customer.billing_code} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.billing_code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.billing_code}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>請求情報</div>
//                     </div>
//                     <div className="w-4/5 py-1.5 flex items-end">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-48' placeholder='' name="billing_information" value={customer.billing_information} onChange={handleChange} />
//                         日締
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-48 ml-10' placeholder='' name="billing_information" value={customer.billing_information} onChange={handleChange} />
//                         日後入金
//                     </div>
//                 </div>
//                 {errors.billing_information && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.billing_information}</div>}
//                 <div className="flex bg-gray-100">
//                     <div className="w-1/5">
//                         <div className='p-4'>月次売上目標</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='number' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="monthly_sales_target" value={customer.monthly_sales_target} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.monthly_sales_target && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.monthly_sales_target}</div>}
//                 <div className="flex bg-white">
//                     <div className="w-1/5">
//                         <div className='p-4'>備考</div>
//                     </div>
//                     <div className="w-4/5 py-1.5">
//                         <input type='text' className='border rounded px-4 py-2.5 bg-white w-2/3' placeholder='' name="remarks" value={customer.remarks} onChange={handleChange} />
//                     </div>
//                 </div>
//                 {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
//             </div>
//             <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
//                 <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
//                 <Link to={`/master/customers`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
//             </div>
//         </div>
//     );
// }
// 
// export default PurchaseOrdersAdd;

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import CustomSelect from '../../../Components/CustomSelect';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function PurchaseOrdersAdd() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

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
    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>{'株式会社テスト'}</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                                    <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                                </svg>
                            </div>
                            伝票設定
                        </Link>
                    </div>
                </div>
                <div className='px-8 py-6'>
                    <div className='py-2.5 font-bold text-xl'>伝票番号</div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>伝票番号 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>発注日付 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>取引先情報</div>
                    <div className='pb-2'>
                        <div className='flex'>
                            <div>
                                <div className='w-40 text-sm pb-1.5'>仕入先コード</div>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-28' placeholder='' name="" value={""} />
                            </div>
                            <div>
                                <div className='w-40 text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-80' placeholder='' name="" value={""} />
                            </div>
                            <div className='ml-12'>
                                <div className='w-40 text-sm pb-1.5'></div>
                                <CustomSelect options={options} name={"honorific"} data={customer} setData={setCustomer} placeholder='御中' />
                            </div>
                        </div>
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>先方担当者</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    <div className='flex items-center'>
                        <div>
                            <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>＋</div>
                        </div>
                        <div className=''>
                            <div className='flex items-center'>
                                <div className=''>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "120px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "440px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "180px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "120px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "180px" }} />
                                </div>
                            </div>
                            <div className='flex items-center mt-4'>
                                <div className=''>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "120px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "180px" }} />
                                </div>
                                <div className='ml-4'>
                                    <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="" value={""} style={{ width: "180px" }} />
                                </div>
                            </div>
                        </div>
                        <div className='ml-4'>
                            <div className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                                <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    {/* <div className='py-2.5 font-bold text-xl'>明細</div> */}
                    <div className='py-6 flex'>
                        <div className='ml-auto rounded px-10 py-8 bg-gray-100'>
                            <div className='flex pb-2'>
                                <div className='w-40'>税抜合計</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(8%)</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(10%)</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税合計</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex'>
                                <div className='w-40'>税込合計</div>
                                <div>5,000円</div>
                            </div>
                        </div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='pb-2'>
                       <textarea className='border rounded px-4 py-2.5 bg-white w-full resize-none' placeholder='' rows={5} name="" value={""} ></textarea>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>支払情報</div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>締日</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>支払期日</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>支払方法</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>納品情報</div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>入荷予定日</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="" value={""} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PurchaseOrdersAdd;

