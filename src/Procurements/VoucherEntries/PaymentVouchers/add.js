import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import CustomSelect from '../../../Components/CustomSelect';
import ListTooltip from '../../../Components/ListTooltip';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../../utils/validator';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const { ipcRenderer } = window.require('electron');

function PaymentVouchersAdd() {
    const [isVendorIdFocused, setIsVendorIdFocused] = useState(false);
    const [isVendorNameFocused, setIsVendorNameFocused] = useState(false);
    const [isProductIdFocused, setIsProductIdFocused] = useState(-1);
    const [isProductNameFocused, setIsProductNameFocused] = useState(-1);
    const [taxRateList, setTaxRateList] = useState([]);
    const [errors, setErrors] = useState({});

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

    const [paymentVoucher, setPaymentVoucher] = useState(
        {
            code: '',
            order_date: '',
            vender_id: '',
            vender_name: '',
            honorific: '',
            vender_contact_person: '',
            contact_person: "",
            purchase_voucher_id: '',
            remarks: '',
        }
    );

    const [vendors, setVendors] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        ipcRenderer.on('search-id-vendors-result', (event, data) => {
            setVendors(data);
        });

        ipcRenderer.on('search-name-vendors-result', (event, data) => {
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
            console.log(data)
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


        return () => {
            ipcRenderer.removeAllListeners('search-id-vendors-result');
            ipcRenderer.removeAllListeners('search-name-vendors-result');
            ipcRenderer.removeAllListeners('search-id-products-result');
            ipcRenderer.removeAllListeners('search-name-products-result');
        };
    }, []);


    const [paymentVoucherDetails, setPaymentVoucherDetails] = useState([
        {
            payment_voucher_id: '',
            payment_method: '',
            payment_price: '',
            fees_and_charges: ''
        }
    ]);

    const addPaymentVoucherDetail = () => {
        setPaymentVoucherDetails([...paymentVoucherDetails, {
            payment_voucher_id: '',
            payment_method: '',
            payment_price: '',
            fees_and_charges: ''
        }]);
    }

    const removePaymentVoucherDetail = (index) => {
        if (paymentVoucherDetails.length === 1) return;
        setPaymentVoucherDetails(paymentVoucherDetails.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        if (name === "product_id") {
            ipcRenderer.send('search-id-products', value);
        }

        if (name === "product_name") {
            ipcRenderer.send('search-name-products', value);
        }
        const updatedDetails = paymentVoucherDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setPaymentVoucherDetails(updatedDetails);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "vender_id") {
            ipcRenderer.send('search-id-vendors', value);
        }

        if (name === "vender_name") {
            ipcRenderer.send('search-name-vendors', value);
        }
        setPaymentVoucher({ ...paymentVoucher, [name]: value });
    };


    const handleOnClick = (name, value) => {
        setPaymentVoucher({ ...paymentVoucher, [name]: value });
    };

    const handleOnDetailClick = (name, value, index) => {
        const updatedDetails = paymentVoucherDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setPaymentVoucherDetails(updatedDetails);
    };



    const validator = new Validator();


    const handleSumPrice = () => {
        let SumPrice = 0
        let consumptionTaxEight = 0
        let consumptionTaxTen = 0

        for (let i = 0; i < paymentVoucherDetails.length; i++) {
            SumPrice += paymentVoucherDetails[i].price * paymentVoucherDetails[i].number;
            if (paymentVoucherDetails[i].tax_rate === 8) {
                consumptionTaxEight += paymentVoucherDetails[i].price * paymentVoucherDetails[i].number * 0.08;
            } else if (paymentVoucherDetails[i].tax_rate === 10) {
                consumptionTaxTen += paymentVoucherDetails[i].price * paymentVoucherDetails[i].number * 0.1;
            }
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": consumptionTaxEight, "consumptionTaxTen": consumptionTaxTen, "totalConsumptionTax": consumptionTaxTen, "Total": SumPrice + consumptionTaxEight + consumptionTaxTen}
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
        const updatedDetails = paymentVoucherDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: option.value } : detail
        );
        setPaymentVoucherDetails(updatedDetails);
        setIsOpen(name);
    };

    const selectPaymentVoucherOption = (option, name) => {
        setSelectedOption(option);
        setPaymentVoucher({ ...paymentVoucher, [name]: option.value });
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
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setPaymentVoucher({ ...paymentVoucher, [name]: formattedDate });
    };

    const [purchaseOrderConditions, setPurchaseOrderConditions] = useState({
        po_start_date: "",
        po_end_date: "",
        po_code: "",
        po_name: "",
    })

    const handleConditionChange = (e) => {
        const { name, value } = e.target;
        setPurchaseOrderConditions({ ...purchaseOrderConditions, [name]: value });
    }

    const handleConditionDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setPurchaseOrderConditions({ ...purchaseOrderConditions, [name]: formattedDate });
    }

    const handleSearch = () => {
        ipcRenderer.send('search-purchase-orders-on-pv', purchaseOrderConditions);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const [connectedPurchaseOrders, setConnectedPurchaseOrders] = useState([])

    const handleCheckboxChange = (id) => {
        setConnectedPurchaseOrders(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(purchaseOrderId => purchaseOrderId !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    ipcRenderer.on('search-purchase-orders-on-pv-result', (event, results) => {
        setPurchaseOrders(results);
    });

    const handleSubmit = () => {
        setErrors(null);
        validator.required(paymentVoucher.code, 'code', '伝票番号');
        validator.required(paymentVoucher.order_date, 'order_date', '発注日付');
        validator.required(paymentVoucher.vender_id, 'vender_id', '仕入先コード');
        validator.required(paymentVoucher.vender_name, 'vender_name', '仕入先名');
        for (let i = 0; i < paymentVoucherDetails.length; i++) {
            validator.required(paymentVoucherDetails[i].payment_method, 'payment_method' + i, '支払方法');
            validator.required(paymentVoucherDetails[i].payment_price, 'payment_price' + i, '支払金額');
        }
        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {

            ipcRenderer.send('save-payment-voucher', paymentVoucher);
            ipcRenderer.on('save-payment-voucher-result', (event, data) => {
                for (let i = 0; i < paymentVoucherDetails.length; i++) {
                    const paymentVoucherDetailData = paymentVoucherDetails[i];
                    paymentVoucherDetailData.payment_voucher_id = data.id;
                    ipcRenderer.send('save-payment-voucher-detail', paymentVoucherDetailData);
                }

                for (let i = 0; i < connectedPurchaseOrders.length; i++) {
                    const pos_id = connectedPurchaseOrders[i];
                    const pvs_id = data.id;
                    ipcRenderer.send('save-pos-pvs-mapping', { pos_id, pvs_id });
                    ipcRenderer.send('update-purchase-invoice-status', { id: pos_id, status: "支払済" });
                }
            });
            setPaymentVoucher({
                code: '',
                order_date: '',
                vender_id: '',
                vender_name: '',
                honorific: '',
                vender_contact_person: '',
                remarks: '',
                closing_date: '',
                payment_due_date: '',
                payment_method: '',
                estimated_delivery_date: '',
            });
            alert('新規登録が完了しました。');
        }
    };

    return (
        <div className='w-full mb-20'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>支払伝票</div>
                    <div className='flex ml-auto'>
                        <Link to="/invoice-settings" className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
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
                        <input type='text' className='border rounded px-4 py-2.5 bg-white  w-[480px]' placeholder='' name="code" value={paymentVoucher.code} onChange={handleChange} />
                        {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>発注日付 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <DatePicker
                            selected={paymentVoucher.order_date ? new Date(paymentVoucher.order_date) : null}
                            onChange={(date) => handleDateChange(date, "order_date")}
                            dateFormat="yyyy-MM-dd"
                            className='border rounded px-4 py-2.5 bg-white  w-[480px]'
                            placeholderText='発注日付を選択'
                        />
                        {errors.order_date && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.order_date}</div>}
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>取引先情報</div>
                    <div className='pb-2'>
                        <div className='flex'>
                            <div className='relative'>
                                <div className='w-40 text-sm pb-1.5'>仕入先コード <span className='text-sm font-bold text-red-600'>必須</span></div>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-28' placeholder='' name="vender_id" value={paymentVoucher.vender_id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                                {
                                    isVendorIdFocused &&
                                    <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                                        <div className="relative inline-block">
                                            <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
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
                            <div className='relative'>
                                <div className='w-40 text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-80' placeholder='' name="vender_name" value={paymentVoucher.vender_name} onChange={handleChange} onFocus={handleVendorNameFocus} onBlur={handleVendorNameBlur} />
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
                            <div className='ml-12'>
                                <div className='text-sm pb-1.5 w-40'>宛名</div>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                                        onClick={() => toggleDropdown("honorific")}
                                    >
                                        <span>{paymentVoucher.honorific ? paymentVoucher.honorific : "宛名"}</span>
                                        <svg
                                            className={`w-4 h-4 transform transition-transform ${isOpen === "honorific" ? 'rotate-180' : ''}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isOpen === "honorific" && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                                            {[{ label: "御中", value: "御中" }, { label: "貴社", value: "貴社" }].map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                                    onClick={() => selectPaymentVoucherOption(option, "honorific")}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {errors.vender_id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.vender_id}</div>}
                    {errors.vender_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.vender_name}</div>}
                    <div className='pb-2'>
                        <div className='text-sm pb-1.5'>先方担当者</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="vender_contact_person" value={paymentVoucher.vender_contact_person} onChange={handleChange} />
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>自社情報</div>
                    <div className='pb-2'>
                        <div className='text-sm pb-1.5'>担当者</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="contact_person" value={paymentVoucher.contact_person} onChange={handleChange} />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>支払伝票</div>
                    <div className='rounded-lg bg-gray-100 p-6 flex'>
                        <div className=''>
                            <div className='text-sm pb-1.5'>仕入日付</div>
                            <div className='flex items-center'>
                                <DatePicker
                                    selected={purchaseOrderConditions.po_start_date ? new Date(purchaseOrderConditions.po_start_date) : null}
                                    onChange={(date) => handleConditionDateChange(date, "po_start_date")}
                                    onKeyDown={handleKeyDown}
                                    dateFormat="yyyy-MM-dd"
                                    className='border rounded px-4 py-2.5 bg-white  w-48'
                                    placeholderText='仕入日付を選択'
                                />
                                <div>〜</div>
                                <DatePicker
                                    selected={purchaseOrderConditions.po_end_date ? new Date(purchaseOrderConditions.po_end_date) : null}
                                    onChange={(date) => handleConditionDateChange(date, "po_end_date")}
                                    onKeyDown={handleKeyDown}
                                    dateFormat="yyyy-MM-dd"
                                    className='border rounded px-4 py-2.5 bg-white  w-48'
                                    placeholderText='仕入日付を選択'
                                />
                            </div>
                        </div>
                        <div className='ml-4'>
                            <div className='text-sm pb-1.5'>仕入先名</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-80' placeholder='' name="po_name" value={purchaseOrderConditions.po_name} onChange={handleConditionChange} onKeyDown={handleKeyDown} />
                        </div>
                        <div className='ml-4'>
                            <div className='text-sm pb-1.5'>仕入伝票番号</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-80' placeholder='' name="po_code" value={purchaseOrderConditions.po_code} onChange={handleConditionChange} onKeyDown={handleKeyDown} />
                        </div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <table className="w-full mt-8 table-auto">
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left py-2'>選択</th>
                                <th className='text-left py-2 w-72'>仕入日付</th>
                                <th className='text-left py-2'>仕入伝票番号</th>
                                <th className='text-left py-2'>仕入先名</th>
                                <th className='text-left py-2'>金額</th>
                                <th className='text-left py-2'>ステータス</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((voucher) => (
                                <tr className='border-b' key={voucher.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={connectedPurchaseOrders.includes(voucher.id)}
                                            onChange={() => handleCheckboxChange(voucher.id)}
                                        /></td>
                                    <td className='py-4'>{voucher.order_date || <div className='border w-4'></div>}</td>
                                    <td>{voucher.code || <div className='border w-4'></div>}</td>
                                    <td>{voucher.vender_name || <div className='border w-4'></div>}</td>
                                    <td>{voucher.vender_id || <div className='border w-4'></div>}</td>
                                    <td>{voucher.status || <div className='border w-4'></div>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <div className='flex my-6'>
                        <div className='border rounded-lg py-3 px-4 text-base font-bold bg-blue-600 text-white'>紐付ける</div>
                    </div> */}
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    {
                        paymentVoucherDetails.map((paymentVoucherDetail, index) => (
                            <div>
                                <div className='flex items-end'>
                                    <div>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex' onClick={addPaymentVoucherDetail}>＋</div>
                                    </div>
                                    <div className=''>
                                        <div className='flex items-center'>
                                            <div className=''>
                                                <div className='text-sm pb-1.5'>支払方法 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="payment_method" value={paymentVoucherDetail.payment_method} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>支払金額 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="payment_price" value={paymentVoucherDetail.payment_price} onChange={(e) => handleInputChange(index, e)} style={{ width: "440px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>手数料</div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="fees_and_charges" value={paymentVoucherDetail.fees_and_charges} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-4'>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => removePaymentVoucherDetail(index)}>
                                            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {errors["payment_method" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["payment_method" + index]}</div>}
                                {errors["payment_price" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["payment_price" + index]}</div>}
                                <div className='flex items-center justify-end'>
                                    <div className='flex items-center'>
                                        <div className='mr-4'>消費税額</div>
                                        <div className='mr-4'>{(paymentVoucherDetails[index].price * paymentVoucherDetails[index].number * paymentVoucherDetails[index].tax_rate*0.01).toFixed(0)}円</div>
                                        <div className='mr-4'>金額</div>
                                        <div className='text-lg font-bold'>{(paymentVoucherDetails[index].price * paymentVoucherDetails[index].number * (paymentVoucherDetails[index].tax_rate*0.01 + 1)).toFixed(0)}円</div>
                                    </div>
                                </div>
                                <hr className='py-3' />
                            </div>
                        ))
                    }
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-6 flex'>
                        <div className='ml-auto rounded px-10 py-8 bg-gray-100'>
                            <div className='flex pb-2'>
                                <div className='w-40'>税抜合計</div>
                                <div>{handleSumPrice().subtotal.toFixed(0).toLocaleString()}円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(8%)</div>
                                <div>{handleSumPrice().consumptionTaxEight.toFixed(0).toLocaleString()}円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(10%)</div>
                                <div>{handleSumPrice().consumptionTaxTen.toFixed(0).toLocaleString()}円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税合計</div>
                                <div>{handleSumPrice().totalConsumptionTax.toFixed(0).toLocaleString()}円</div>
                            </div>
                            <div className='flex'>
                                <div className='w-40'>税込合計</div>
                                <div>{handleSumPrice().Total.toFixed(0).toLocaleString()}円</div>
                            </div>
                        </div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='pb-2'>
                        <textarea className='border rounded px-4 py-2.5 bg-white w-full resize-none' placeholder='' name="remarks" value={paymentVoucher.remarks} onChange={handleChange} ></textarea>
                        {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                </div>
                <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                    <Link to={`/procurement/voucher-entries/payment-vouchers`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentVouchersAdd;

