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

function StockInOutSlipsAdd() {
    const options = [
        { value: '倉庫A', label: '倉庫A' },
        { value: '倉庫B', label: '倉庫B' },
    ];
    const [isVendorIdFocused, setIsVendorIdFocused] = useState(false);
    const [isVendorNameFocused, setIsVendorNameFocused] = useState(false);
    const [isProductIdFocused, setIsProductIdFocused] = useState(-1);
    const [isProductNameFocused, setIsProductNameFocused] = useState(-1);
    const [storageFacilitiesList, setStorageFacilitiesList] = useState([]);
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

    const [stockInOutSlip, setStockInOutSlip] = useState({
        id: '',
        stock_in_out_date: '',
        processType: '',
        warehouse_from: '',
        warehouse_to: '',
        contact_person: '',
        remarks: '',
    });

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
            ipcRenderer.removeAllListeners('search-id-vendors-result');
            ipcRenderer.removeAllListeners('search-name-vendors-result');
            ipcRenderer.removeAllListeners('search-id-products-result');
            ipcRenderer.removeAllListeners('search-name-products-result');
        };
    }, []);


    const [stockInOutSlipDetails, setStockInOutSlipDetails] = useState([
        {
            id: '',
            stock_in_out_slip_id: '',
            product_id: '',
            product_name: '',
            number: '',
            unit: '',
            price: '',
            lot_number: '',
        }
    ]);

    const addStockInOutSlipDetail = () => {
        setStockInOutSlipDetails([...stockInOutSlipDetails, {
            id: '',
            stock_in_out_slip_id: '',
            product_id: '',
            product_name: '',
            number: '',
            unit: '',
            price: '',
            lot_number: '',
        }]);
    }

    const removeStockInOutSlipDetail = (index) => {
        if (stockInOutSlipDetails.length === 1) return;
        setStockInOutSlipDetails(stockInOutSlipDetails.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        if (name === "product_id") {
            ipcRenderer.send('search-id-products', value);
        }

        if (name === "product_name") {
            ipcRenderer.send('search-name-products', value);
        }
        const updatedDetails = stockInOutSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setStockInOutSlipDetails(updatedDetails);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "vender_id") {
            ipcRenderer.send('search-id-vendors', value);
        }

        if (name === "vender_name") {
            ipcRenderer.send('search-name-vendors', value);
        }
        setStockInOutSlip({ ...stockInOutSlip, [name]: value });
    };


    const handleOnClick = (name, value) => {
        setStockInOutSlip({ ...stockInOutSlip, [name]: value });
    };

    const handleOnDetailClick = (name, value, index) => {
        const updatedDetails = stockInOutSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setStockInOutSlipDetails(updatedDetails);
    };



    const validator = new Validator();

    const handleSubmit = () => {
        setErrors(null);
        validator.required(stockInOutSlip.code, 'code', '伝票番号');
        validator.required(stockInOutSlip.stock_in_out_date, 'stock_in_out_date', '発注日付');
        validator.required(stockInOutSlip.processType, 'processType', '処理種別');
        for (let i = 0; i < stockInOutSlipDetails.length; i++) {
            validator.required(stockInOutSlipDetails[i].product_id, 'product_id' + i, '商品コード');
            validator.required(stockInOutSlipDetails[i].product_name, 'product_name' + i, '商品名');
            validator.required(stockInOutSlipDetails[i].number, 'number' + i, '数量');
            validator.required(stockInOutSlipDetails[i].price, 'price' + i, '値段');
        }
        setErrors(validator.getErrors());

        if (!validator.hasErrors()) {

            ipcRenderer.send('save-stock-in-out-slip', stockInOutSlip);
            ipcRenderer.on('get-stock-in-out-slip-data-result', (event, data) => {
                console.log("stockInOutSlipDetails", stockInOutSlipDetails)
                for (let i = 0; i < stockInOutSlipDetails.length; i++) {
                    const stockInOutSlipDetailData = stockInOutSlipDetails[i];
                    stockInOutSlipDetailData.stock_in_out_slip_id = data.id;

                    ipcRenderer.send('save-stock-in-out-slip-detail', stockInOutSlipDetailData);
                }
            });
            setStockInOutSlip({
                id: '',
                stock_in_out_date: '',
                processType: '',
                warehouse_from: '',
                warehouse_to: '',
                contact_person: '',
                remarks: '',
            });
            setStockInOutSlipDetails([
                {
                    id: '',
                    stock_in_out_slip_id: '',
                    product_id: '',
                    product_name: '',
                    number: '',
                    unit: '',
                    price: '',
                    lot_number: '',
                }
            ])
            alert('新規登録が完了しました。');
        }
    };

    const handleSumPrice = () => {
        let SumPrice = 0
        let consumptionTaxEight = 0
        let consumptionTaxTen = 0

        for (let i = 0; i < stockInOutSlipDetails.length; i++) {
            SumPrice += stockInOutSlipDetails[i].price * stockInOutSlipDetails[i].number;
            if (stockInOutSlipDetails[i].tax_rate === 8) {
                consumptionTaxEight += stockInOutSlipDetails[i].price * stockInOutSlipDetails[i].number * 0.08;
            } else if (stockInOutSlipDetails[i].tax_rate === 10) {
                consumptionTaxTen += stockInOutSlipDetails[i].price * stockInOutSlipDetails[i].number * 0.1;
            }
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": consumptionTaxEight, "consumptionTaxTen": consumptionTaxTen, "totalConsumptionTax": consumptionTaxEight + consumptionTaxTen, "Total": SumPrice + consumptionTaxEight + consumptionTaxTen }
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
        const updatedDetails = stockInOutSlipDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: option.value } : detail
        );
        setStockInOutSlipDetails(updatedDetails);
        setIsOpen(name);
    };

    const selectStockInOutSlipOption = (option, name) => {
        setSelectedOption(option);
        setStockInOutSlip({ ...stockInOutSlip, [name]: option.value });
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
        // 日付をフォーマットしてstockInOutSlipにセット
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setStockInOutSlip({ ...stockInOutSlip, [name]: formattedDate });
    };

    return (
        <div className='w-5/6 mb-20'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>新規作成</div>
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
                        <input type='text' className='border rounded px-4 py-2.5 bg-white  w-[480px]' placeholder='' name="code" value={stockInOutSlip.code} onChange={handleChange} />
                        {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
                    </div>
                    <div className='pb-2'>
                        <div className='w-40 text-sm pb-1.5'>入出庫日付 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <DatePicker
                            selected={stockInOutSlip.stock_in_out_date ? new Date(stockInOutSlip.stock_in_out_date) : null}
                            onChange={(date) => handleDateChange(date, "stock_in_out_date")}
                            dateFormat="yyyy-MM-dd"
                            className='border rounded px-4 py-2.5 bg-white  w-[480px]'
                            placeholderText='発注日付を選択'
                        />
                        {errors.stock_in_out_date && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.stock_in_out_date}</div>}
                    </div>
                    <div className='w-40 text-sm pb-1.5 flex items-center'>
                        処理種別
                        <a data-tooltip-id="my-tooltip" data-tooltip-content="倉庫間移動は振替、入庫先を指定しない場合は出庫、出庫元を指定しない場合は入庫" className='flex ml-3'>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                            </svg>
                        </a>
                        <Tooltip id="my-tooltip" />
                        <span className='ml-2.5 text-xs font-bold text-red-600'>必須</span>
                    </div>
                    <div className='pb-4 flex'>
                        <label className='text-base'>
                            <input
                                type="radio"
                                name="processType"
                                value="type1"
                                className='mr-2'
                                onChange={handleChange}
                            />
                            出庫
                        </label>
                        <label className='text-base ml-10'>
                            <input
                                type="radio"
                                name="processType"
                                value="type2"
                                className='mr-2'
                                onChange={handleChange}
                            />
                            入庫
                        </label>
                        <label className='text-base ml-10'>
                            <input
                                type="radio"
                                name="processType"
                                value="type3"
                                className='mr-2'
                                onChange={handleChange}
                            />
                            振替
                        </label>
                    </div>
                    {errors.processType && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.processType}</div>}
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='pb-2'>
                        <div className='flex items-center text-sm pb-1.5'>出庫元倉庫
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="出庫処理の場合：出庫元倉庫のみを指定" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                        <div className="w-[480px] pb-1.5">
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleDropdown("warehouse_to")}
                                >
                                    <span>{stockInOutSlip.warehouse_to ? stockInOutSlip.warehouse_to : "倉庫"}</span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform ${isOpen === "warehouse_to" ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isOpen === "warehouse_to" && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                                        {storageFacilitiesList.map((option) => (
                                            <div
                                                key={option.value}
                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                                onClick={() => selectStockInOutSlipOption(option, "warehouse_to")}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='pb-2'>
                        <div className='flex items-center text-sm pb-1.5'>入庫先倉庫
                            <a data-tooltip-id="my-tooltip" data-tooltip-content="入庫処理の場合：入庫先倉庫のみを指定" className='flex ml-3'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                                </svg>
                            </a>
                            <Tooltip id="my-tooltip" />
                        </div>
                        <div className="w-[480px] pb-1.5">
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleDropdown("warehouse_from")}
                                >
                                    <span>{stockInOutSlip.warehouse_from ? stockInOutSlip.warehouse_from : "倉庫"}</span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform ${isOpen === "warehouse_from" ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isOpen === "warehouse_from" && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                                        {storageFacilitiesList.map((option) => (
                                            <div
                                                key={option.value}
                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                                onClick={() => selectStockInOutSlipOption(option, "warehouse_from")}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    {
                        stockInOutSlipDetails.map((stockInOutSlipDetail, index) => (
                            <div>
                                <div className='flex items-center'>
                                    <div>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex' onClick={addStockInOutSlipDetail}>＋</div>
                                    </div>
                                    <div className=''>
                                        <div className='flex items-center'>
                                            <div className='relative'>
                                                <div className='text-sm pb-1.5'>商品コード <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number'
                                                    className='border rounded px-4 py-2.5 bg-white w-30'
                                                    placeholder=''
                                                    name="product_id"
                                                    value={stockInOutSlipDetail.product_id}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    style={{ width: "120px" }}
                                                    onFocus={(e) => handleProductIdFocus(index)}
                                                    onBlur={handleeProductIdBlur}
                                                />
                                                {
                                                    isProductIdFocused === index &&
                                                    <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                                                        <div className="relative inline-block">
                                                            <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                                                            <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                                                <div className="flex flex-col space-y-2">
                                                                    {
                                                                        products.map((product, idx) => (
                                                                            <div key={idx}
                                                                                className="p-2 hover:bg-gray-100 hover:cursor-pointer"
                                                                                onClick={(e) => handleOnDetailClick("product_id", product.id, index)}
                                                                            >
                                                                                {product.name}
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className='ml-4 relative'>
                                                <div className='text-sm pb-1.5'>商品名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='text'
                                                    className='border rounded px-4 py-2.5 bg-white'
                                                    placeholder=''
                                                    name="product_name"
                                                    value={stockInOutSlipDetail.product_name}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    style={{ width: "400px" }}
                                                    onFocus={(e) => handleProductNameFocus(index)}
                                                    onBlur={handleeProductNameBlur}
                                                />
                                                {
                                                    isProductNameFocused === index &&
                                                    <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                                                        <div className="relative inline-block">
                                                            <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                                                            <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                                                <div className="flex flex-col space-y-2">
                                                                    {
                                                                        products.map((product, idx) => (
                                                                            <div key={idx}
                                                                                className="p-2 hover:bg-gray-100 hover:cursor-pointer"
                                                                                onClick={(e) => handleOnDetailClick("product_name", product.name, index)}
                                                                            >
                                                                                {product.name}
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>数量 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="number" value={stockInOutSlipDetail.number} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>単位</div>
                                                <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="unit" value={stockInOutSlipDetail.unit} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm pb-1.5'>単価 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="price" value={stockInOutSlipDetail.price} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                                            </div>
                                        </div>
                                        {errors["product_id" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["product_id" + index]}</div>}
                                        {errors["product_name" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["product_name" + index]}</div>}
                                        {errors["number" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["number" + index]}</div>}
                                        {errors["price" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["price" + index]}</div>}
                                        <div className='flex items-center mt-4'>
                                            <div className=''>
                                                <div className='text-sm pb-1.5'>ロット番号</div>
                                                <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="lot_number" value={stockInOutSlipDetail.lot_number} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-4'>
                                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => removeStockInOutSlipDetail(index)}>
                                            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-end'>
                                    <div className='flex items-center'>
                                        <div className='mr-4'>消費税額</div>
                                        <div className='mr-4'>{(stockInOutSlipDetails[index].price * stockInOutSlipDetails[index].number * (stockInOutSlipDetails[index].tax_rate * 0.01)).toFixed(0)}円</div>
                                        <div className='mr-4'>金額</div>
                                        <div className='text-lg font-bold'>{(stockInOutSlipDetails[index].price * stockInOutSlipDetails[index].number * (stockInOutSlipDetails[index].tax_rate * 0.01 + 1)).toFixed(0)}円</div>
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
                        <textarea className='border rounded px-4 py-2.5 bg-white w-full resize-none' placeholder='' name="remarks" value={stockInOutSlip.remarks} onChange={handleChange} ></textarea>
                        {errors.remarks && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.remarks}</div>}
                    </div>
                </div>
                <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
                    <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
                    <Link to={`/procurement/voucher-entries/stock-in-out-slips`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
                </div>
            </div>
        </div>
    )
}

export default StockInOutSlipsAdd;

