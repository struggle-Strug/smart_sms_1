import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import CustomSelect from '../../../Components/CustomSelect';
import ListTooltip from '../../../Components/ListTooltip';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Validator from '../../../utils/validator';
import DatePicker from 'react-datepicker';
import PaymentDataImport from '../PaymentDataImport/import';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios'; // 追加

const { ipcRenderer } = window.require('electron');

function AddForm() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [isVendorIdFocused, setIsVendorIdFocused] = useState(false);
    const [isVendorNameFocused, setIsVendorNameFocused] = useState(false);
    const [isProductIdFocused, setIsProductIdFocused] = useState(-1);
    const [isProductNameFocused, setIsProductNameFocused] = useState(-1);
    const [taxRateList, setTaxRateList] = useState([]);
    const [storageFacilitiesList, setStorageFacilitiesList] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleFocus = () => {
        setIsVendorIdFocused(true);
    };

    const handleBlur = () => {
        setIsVendorIdFocused(false);
    };

    const handleVendorNameFocus = () => {
        setIsVendorNameFocused(true);
    };

    const handleVendorNameBlur = () => {
        setIsVendorNameFocused(false);
    };

    const handleProductIdFocus = (index) => {
        setIsProductIdFocused(index)
    }

    const handleeProductIdBlur = () => {
        setIsProductIdFocused(-1);
    };

    const handleProductNameFocus = (index) => {
        setIsProductNameFocused(index)
    }

    const handleeProductNameBlur = () => {
        setIsProductNameFocused(-1);
    };


    const [depositSlip, setDepositSlip] = useState({
        id: '',
        code: '',
        deposit_date: '',
        status: '',
        vender_name: '',
        vender_id: '',
        remarks: '',
        updated: '',
        created: '',
    });


    const [vendors, setVendors] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        ipcRenderer.on('search-customers-result', (event, data) => {
            setVendors(data);
        });

        ipcRenderer.on('search-id-products-result', (event, data) => {
            setProducts(data);
        });

        ipcRenderer.on('search-name-products-result', (event, data) => {
            setProducts(data);
        });

        ipcRenderer.send('load-sales-tax-settings');
        ipcRenderer.on('sales-tax-settings-data', (event, data) => {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                const taxRateTemplate = {
                    value: data[i].tax_rate,
                    label: data[i].tax_rate,
                }
                arr.push(taxRateTemplate)
            }
            setTaxRateList(arr);
        });

        ipcRenderer.send('load-storage-facilities');
        ipcRenderer.on('load-storage-facilities', (event, data) => {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                const storageFacilitiesTemplate = {
                    value: data[i].name,
                    label: data[i].name,
                }
                arr.push(storageFacilitiesTemplate)
            }
            setStorageFacilitiesList(arr);
        });


        return () => {
            ipcRenderer.removeAllListeners('search-customers-result');
            ipcRenderer.removeAllListeners('search-id-products-result');
            ipcRenderer.removeAllListeners('search-name-products-result');
        };
    }, []);

    const [depositSlipDetails, setDepositSlipDetails] = useState([
        {
            id: '',
            deposit_slip_id: '',
            deposit_date: '',
            vender_id: '',
            vender_name: '',
            claim_id: '',
            deposit_method: '',
            deposits: '',
            commission_fee: '',
            data_category: '',
        }
    ]);

    const addDepositSlipDetail = () => {
        setDepositSlipDetails([...depositSlipDetails, {
            id: '',
            deposit_slip_id: '',
            deposit_date: '',
            vender_id: '',
            vender_name: '',
            claim_id: '',
            deposit_method: '',
            deposits: '',
            commission_fee: '',
            data_category: '',
        }]);
    }

    const removeDepositSlipDetail = (index) => {
        if (depositSlipDetails.length === 1) return;
        setDepositSlipDetails(depositSlipDetails.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        if (name === "product_id") {
            ipcRenderer.send('search-id-products', value);
        }

        if (name === "product_name") {
            ipcRenderer.send('search-name-products', value);
        }
        const updatedDetails = depositSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setDepositSlipDetails(updatedDetails);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "vender_id") {
            ipcRenderer.send('search-customers', { id: value });
        }

        if (name === "vender_name") {
            ipcRenderer.send('search-customers', { name_primary: value });
        }
        setDepositSlip({ ...depositSlip, [name]: value });
    };

    const handleOnClick = (name, value) => {
        setDepositSlip({ ...depositSlip, [name]: value });
    };

    const handleOnDetailClick = (name, value, index) => {
        const updatedDetails = depositSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setDepositSlipDetails(updatedDetails);
    };

    const validator = new Validator();

    const handleSubmit = () => {
        setErrors(null);
        validator.required(depositSlip.code, 'code', '伝票番号');
        for (let i = 0; i < depositSlipDetails.length; i++) {
            validator.required(depositSlipDetails[i].deposit_slip_id, 'deposit_slip_id' + i, '入金伝票番号');
            // validator.required(depositSlipDetails[i].deposit_date, 'deposit_date' + i, '入金日付');
            // // validator.required(depositSlipDetails[i].vender_id, 'vender_id' + i, '得意先コード');
            // // validator.required(depositSlipDetails[i].vender_name, 'vender_name' + i, '得意先名');
            validator.required(depositSlipDetails[i].deposit_method, 'deposit_method' + i, '入金方法');
            validator.required(depositSlipDetails[i].deposits, 'deposits' + i, '入金額');
        }
        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {
            ipcRenderer.send('save-deposit-slip', depositSlip);
            ipcRenderer.on('save-deposit-slip-result', (event, data) => {

                for (let i = 0; i < depositSlipDetails.length; i++) {
                    const depositSlipDetailData = depositSlipDetails[i];
                    depositSlipDetailData.deposit_slip_id = data.id;
                    ipcRenderer.send('save-deposit-slip-detail', depositSlipDetailData);
                }
            });
            setDepositSlip({
                id: '',
                code: '',
                deposit_date: '',
                status: '',
                vender_name: '',
                vender_id: '',
                remarks: '',
                updated: '',
                created: '',
            });
            alert('新規登録が完了しました。');
        }
    };

    const handleSumPrice = () => {
        let SumPrice = 0

        for (let i = 0; i < depositSlipDetails.length; i++) {
            SumPrice += depositSlipDetails[i].unit_price * depositSlipDetails[i].number;
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": SumPrice * 0.08, "consumptionTaxTen": 0, "totalConsumptionTax": SumPrice * 0.08, "Total": SumPrice * 1.08 }
    }

    const [isOpen, setIsOpen] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = (name) => {
        if (isOpen === name) return setIsOpen(null)
        setIsOpen(name);
    };

    const selectOption = (option, name, index) => {
        setSelectedOption(option);
        const updatedDetails = depositSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: option.value } : detail
        );
        setDepositSlipDetails(updatedDetails);
        setIsOpen(name);
    };

    const selectDepositSlipOption = (option, name) => {
        setSelectedOption(option);
        setDepositSlip({ ...depositSlip, [name]: option.value });
        setIsOpen(name);
    };

    const handleClickOutside = (event) => {
        // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        //     setIsOpen(null);
        // }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDateChange = (date, name) => {
        // 日付をフォーマットしてdepositSlipにセット
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setDepositSlip({ ...depositSlip, [name]: formattedDate });
    };





    const [error, setError] = useState('');
    const handleGetBankData = async () => {
        console.log('handleGetBankData');
        try {
            const response = await axios({
                method: 'GET',
                url: 'https://developer.api.bk.mufg.jp/btmu/retail/trial/v2/me/accounts/001001110001/transactions?inquiryDateFrom=2021-12-20&inquiryDateTo=2021-12-27',
                headers: {
                    'X-IBM-Client-Id': '216d0c5626337b3dfde41c0888e78b07', // APIキー
                    'X-BTMU-Seq-No': '20200514-0000000123456789', // ランダムな値
                    Accept: 'application/json',
                },
            });

            // APIレスポンスからデータを格納
            const data = response.data;
            setDepositSlip(prevState => ({
                ...prevState,
                deposit_date: data.transactions[0].settlementDate,
            }));

            const newDetails = data.transactions.map(transaction => ({
                id: '',
                deposit_slip_id: '',
                deposit_date: transaction.settlementDate,
                vender_id: '', // 必要に応じて値を設定
                vender_name: data.accountInfo.accountName, // 必要に応じて値を設定
                claim_id: '',
                deposit_method: transaction.transactionType, // 取引タイプをセット
                deposits: transaction.amount, // 取引額をセット
                commission_fee: '',
                data_category: '',
            }));
   
          setDepositSlipDetails(newDetails);
    
            console.log('データ取得成功:', data);
            console.log('newDetails',newDetails)
            console.log('depositSlip', depositSlip);
            console.log('depositSlipDetails', depositSlipDetails);
            navigate('/sales-management/voucher-entries/payment-slips/add/data-import', { state: { newDetails: newDetails } });
        } catch (error) {
            // エラーメッセージを表示
            setError('データの取得に失敗しました。再度お試しください。');
            console.error('エラー:', error);
        }
    };

    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>{'入金伝票の新規作成'}</div>
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
                    {
                        depositSlipDetails.map((depositSlipDetail, index) => (
                            <div>
                                <div className='flex items-center'>
                                    <div>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex' onClick={addDepositSlipDetail}>＋</div>
                                    </div>
                                    <div className=''>
                                        <div className='flex items-center'>
                                            <div className=''>
                                                <div className='text-sm pb-1.5'>入金伝票番号 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="deposit_slip_id" value={depositSlipDetail.deposit_slip_id} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                                {errors.deposit_slip_id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.deposit_slip_id}</div>}

                                            </div>
                                            <div className='ml-4'>
                                                <div className='w-30 text-sm pb-1.5'>入金日付 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
                                                <DatePicker
                                                    selected={depositSlipDetail.deposit_date ? new Date(depositSlipDetail.deposit_date) : null}
                                                    onChange={(date) => handleDateChange(date, "deposit_date")}
                                                    dateFormat="yyyy-MM-dd"
                                                    className='w-40 border rounded px-4 py-2.5 bg-white w-[180px]'
                                                    placeholderText='入金日付を選択'
                                                />
                                                {errors.deposit_date && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.deposit_date}</div>}
                                            </div>
                                            <div className='ml-4 relative'>
                                                <div className='w-45 text-sm pb-1.5'>得意先コード <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="vender_id" value={depositSlipDetail.vender_id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ width: "180px" }} />
                                                {
                                                    isVendorIdFocused &&
                                                    <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                                                        <div className="relative inline-block">
                                                            <div className="left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                                                            <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                                                <div className="flex flex-col space-y-2">
                                                                    {
                                                                        vendors.map((value, index) => (
                                                                            <div className="p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={(e) => handleOnClick("vender_id", value.id)}>{value.name_primary}</div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className='ml-4 relative'>
                                                <div className='w-45 text-sm pb-1.5'>得意先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="vender_name" value={depositSlipDetail.vender_name} onChange={handleChange} onFocus={handleVendorNameFocus} onBlur={handleVendorNameBlur} style={{ width: "180px" }} />
                                                {
                                                    isVendorNameFocused &&
                                                    <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                                                        <div className="relative inline-block">
                                                            <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                                                            <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                                                <div className="flex flex-col space-y-2">
                                                                    {
                                                                        vendors.map((value, index) => (
                                                                            <div className="p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={(e) => handleOnClick("vender_name", value.name_primary)}>{value.name_primary}</div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5 w-30'>請求番号</div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="claim_id" value={depositSlipDetail.claim_id} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5 w-30'>入金方法<span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-whit' placeholder='' name="deposit_method" value={depositSlipDetail.deposit_method} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5 w-30'>入金額 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="deposits" value={depositSlipDetail.deposits} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                        </div>
                                        {errors["vender_id" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["vender_id" + index]}</div>}
                                        {errors["vender_name" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["vender_name" + index]}</div>}
                                        {errors["deposit_method" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["deposit_method" + index]}</div>}
                                        {errors["deposits" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["deposits" + index]}</div>}
                                        <div className='flex items-center mt-4'>
                                            <div className=''>
                                                <div className='text-sm pb-1.5'>手数料</div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="commission_fee" value={depositSlipDetail.commission_fee} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>データ区分</div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="data_category" value={depositSlipDetail.data_category} style={{ width: "180px" }} onChange={(e) => handleInputChange(index, e)} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5 w-30'>備考</div>
                                                <input className='border rounded px-4 py-2.5 bg-white resize-none' placeholder='' rows={1} name="remarks" value={depositSlip.remarks} onChange={handleChange} style={{ width: "640px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-4'>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => removeDepositSlipDetail(index)}>
                                            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className='pb-6 flex flex-col mr-14'>
                                    <div className='flex items-center mr-10 pt-3'>
                                        <div className='ml-auto flex'>消費税額</div>
                                        <div className='ml-4'>0円</div>
                                        <div className='ml-10 flex'>金額</div>
                                        <div className='ml-4 text-lg font-semibold'>0円</div>
                                    </div>
                                    <div className='py-3'>
                                        <hr className='' />
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                    <div className='pb-6 flex flex-col mr-14'>
                        <div className='flex items-center mr-10 pt-3'>
                            <div className='ml-auto flex'>消費税額</div>
                            <div className='ml-4'>0円</div>
                            <div className='ml-10 flex'>金額</div>
                            <div className='ml-4 text-lg font-semibold'>0円</div>
                        </div>
                    </div>
                    <div 
                      className='w-36 bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' 
                      onClick={handleGetBankData}>
                        銀行データ取込
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='pb-2 mb-24'>
                        <textarea className='border rounded px-4 py-2.5 bg-white w-full resize-none' placeholder='' rows={5} name="remarks" value={depositSlip.remarks} onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
            <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                <Link to={`salesmanagements/deposit-slips`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
            </div>
        </div>
    );
}

function PaymentSlipsAdd() {
  return (
    <Routes>
      <Route path="" element={<AddForm />} />
      <Route path="data-import/*" element={<PaymentDataImport />} />
    </Routes>
  )
}

export default PaymentSlipsAdd;


