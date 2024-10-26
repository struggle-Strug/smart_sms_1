import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [customers, setCustomers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentVoucherDetails, setPaymentVoucherDetails] = useState([]);
    const [purchaseInvoiceDetails, setPurchaseInvoiceDetails] = useState([]);
    const [pvAndPiMappings, setPvAndPiMappings] = useState([]);
    const [aggregatedPvData, setAggregatedPvData] = useState([])
    const [aggregatedPiData, setAggregatedPiData] = useState([])

    const [searchQueryList, setSearchQueryList] = useState({

    });

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
    };

    useEffect(() => {
        ipcRenderer.send('load-payment-voucher-details');
        ipcRenderer.send('load-purchase-invoice-details');
        ipcRenderer.send('load-pos-pvs-mappings');

        const handleLoadPIDetails = (event, data) => {
            setPurchaseInvoiceDetails(data);
            setAggregatedPiData(handleCreateData(data))
        }

        const handleLoadPVDetails = (event, data) => {
            setAggregatedPvData(handlePaymentCreateData(data))
            setPaymentVoucherDetails(data);
        }

        const handleLoadMappingDetails = (event, data) => {

            setPvAndPiMappings(data);
        }
        ipcRenderer.on('load-purchase-invoice-details', handleLoadPIDetails);
        ipcRenderer.on('load-payment-voucher-details', handleLoadPVDetails);
        ipcRenderer.on('load-pos-pvs-mappings', handleLoadMappingDetails);

        return () => {
            ipcRenderer.removeListener('load-purchase-invoice-details', handleLoadPIDetails);
            ipcRenderer.removeListener('load-payment-voucher-details', handleLoadPVDetails);
            ipcRenderer.removeListener('load-pos-pvs-mappings', handleLoadMappingDetails);
        };
    }, []);

    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`; // 例: "2024-10"
    };




    const handleCreateData = (data) => {
        console.log(data)

        const result = data.reduce((acc, item) => {
            const month = (item.closing_date && item.closing_date !== "") ? item.closing_date.slice(0, 7) : getCurrentMonth(); // 例: "2024-09"
            const key = `${item.vender_name}-${month}`;

            if (!acc[key]) {
                acc[key] = {
                    vender_name: item.vender_name,
                    pi_id: item.purchase_invoice_id,
                    month: month,
                    totalSales: 0
                };
            }

            acc[key].totalSales += item.price * item.number;

            return acc;
        }, {});

        const resultArray = Object.values(result);

        return resultArray;

    }


    const createDisplayData = () => {
        const displayArray = []
        const currentMonth = dayjs().format('YYYY-MM'); // 現在の年月
        const previousMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

        for (let i = 0; i < aggregatedPvData.length; i++) {
            let inputData = {
                vender_name: aggregatedPvData[i].vender_name,
                balance_of_last_month: 0,
                purchase_current_month: 0,
                payment_current_month: 0,
                balance_of_current_month: 0,
            }
            if (aggregatedPvData[i].month === currentMonth) {
                inputData.purchase_current_month += aggregatedPvData[i].totalSales;
                inputData.balance_of_current_month += aggregatedPvData[i].totalSales;
            } else if (aggregatedPvData[i].month === previousMonth) {
                inputData.balance_of_last_month += aggregatedPvData[i].totalSales;
            } else {
                continue
            }
            displayArray.push(inputData)
        }

        for (let i = 0; i < displayArray.length; i++) {
            for (let j = 0; j < aggregatedPiData.length; j++) {
                if (displayArray[i].vender_name === aggregatedPiData[j].vender_name) {
                    if (aggregatedPiData[i].month === currentMonth) {
                        displayArray[i].balance_of_current_month -= aggregatedPiData[i].totalSales;
                        displayArray[i].payment_current_month += aggregatedPiData[i].totalSales;
                    } else if (aggregatedPiData[i].month === previousMonth) {
                        displayArray[i].balance_of_last_month -= aggregatedPiData[i].totalSales;
                    } else {
                        continue
                    }
                }
            }
        }

        return displayArray;
    }

    const createSumData = (data) => {
        const inputData = {
            balance_of_last_month: 0,
            purchase_current_month: 0,
            payment_current_month: 0,
            balance_of_current_month: 0,
        }

        for (let i = 0; i < data.length; i++) {
            inputData.balance_of_last_month += data[i].balance_of_last_month
            inputData.purchase_current_month += data[i].purchase_current_month
            inputData.payment_current_month += data[i].payment_current_month
            inputData.balance_of_current_month += data[i].balance_of_current_month
        }

        return inputData
    }



    const handlePaymentCreateData = (data) => {

        // 売上データを集計する
        const result = data.reduce((acc, item) => {
            // 日付から年月を取得
            const month = (item.closing_date && item.closing_date !== "") ? item.payment_date.slice(0, 7) : getCurrentMonth(); // 例: "2024-09"
            const key = `${item.vender_name}-${month}`;

            // すでに同じvender_nameと月が存在するか確認
            if (!acc[key]) {
                acc[key] = {
                    vender_name: item.vender_name,
                    pv_id: item.payment_voucher_id,
                    month: month,
                    totalSales: 0
                };
            }

            // 売上合計を計算
            acc[key].totalSales += item.payment_price;

            return acc;
        }, {});

        // 結果を配列形式に変換
        const resultArray = Object.values(result);

        return resultArray;

    }

    // const createDisplayData = () => {

    // }

    const toggleDropdown = (id) => {

        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('本当にこの顧客を削除しますか？')) {
            ipcRenderer.send('delete-customer', id);
        }
    };

    const handleSearch = () => {
        ipcRenderer.send('search-customers', searchQuery);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>買掛金残高</div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-3 gap-8'>
                        <div>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>日付 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <DatePicker
                                        selected={searchQueryList["pod.created_end"] ? new Date(searchQueryList["pod.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "pod.created_end")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                                <div>
                                    <div className='w-1'>&nbsp;</div>
                                    <div className='flex items-center'>〜</div>
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>&nbsp;</div>
                                    <DatePicker
                                        selected={searchQueryList["pod.created_end"] ? new Date(searchQueryList["pod.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "pod.created_end")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払予定日</div>
                            <DatePicker
                                selected={searchQueryList["pod.created_end"] ? new Date(searchQueryList["pod.created_end"]) : null}
                                onChange={(date) => handleDateChange(date, "pod.created_end")}
                                dateFormat="yyyy-MM-dd"
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholderText='期間を選択'
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>
                    <div className='flex mt-4'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'>集計する</div>
                    </div>
                </div>
            </div>
            <div className='flex px-8 justify-end'>
                <div className='border rounded-lg py-3 px-7 text-base font-bold text-black'>
                    エクスポート
                </div>
            </div>
            <div className='px-8 pb-8'>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b '>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>仕入先</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>先月末残高</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>当月仕入高</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>当月支払額 </div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>当月末残高</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>次回支払予定日</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {createDisplayData().map((value) => (
                            <tr className='border-b' key={value.vender_name}>
                                <td className='py-4'>{value.vender_name}</td>
                                <td className='py-4'>{value.balance_of_last_month.toLocaleString()}円</td>
                                <td className='py-4'>{value.purchase_current_month.toLocaleString()}円</td>
                                <td className='py-4'>{value.payment_current_month.toLocaleString()}円</td>
                                <td className='py-4'>{value.balance_of_current_month.toLocaleString()}円</td>
                                <td>2023-09-30</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>先月末残高</div>
                    <div className='py-1 font-bold'>{createSumData(createDisplayData()).balance_of_last_month}円</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>当月仕入高</div>
                    <div className='py-1 font-bold'>{createSumData(createDisplayData()).purchase_current_month}円</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>当月支払額</div>
                    <div className='py-1 font-bold'>{createSumData(createDisplayData()).payment_current_month}円</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>当月末残高</div>
                    <div className='py-1 font-bold'>{createSumData(createDisplayData()).balance_of_current_month}円</div>
                </div>
            </div>
        </div>
    )
}

function AccountsPayableBalancesIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default AccountsPayableBalancesIndex;
