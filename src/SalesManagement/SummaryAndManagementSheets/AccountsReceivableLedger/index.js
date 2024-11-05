import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import { BarChart } from '@mui/x-charts/BarChart';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

export function SimpleBarCharts() {
    return (
        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: ['株式会社A', '株式会社B', '株式会社C', '株式会社D', '株式会社E', '株式会社F', '株式会社G', '株式会社H', '株式会社I', '株式会社J', '株式会社K', '株式会社L'],
                    scaleType: 'band',
                },
            ]}
            yAxis={[
                {
                    id: 'yAxisId',
                    label: '円',
                    min: 0,
                    max: 10,
                    tickCount: 10,
                },
            ]}
            series={[
                {
                    data: [2, 5, 3, 4, 7, 8, 5, 2, 3, 9, 5, 6],
                    color: '#2563EB'
                },
            ]}
            width={1216}
            height={644}
            barWidth={5}
        />
    );
}


function Index() {
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
    const [customers, setCustomers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const [searchQueryList, setSearchQueryList] = useState({
        "esd.created_start": "",
        "esd.created_end": "",
        "p.category": "",
        "p.subcategory": "",
        "esd.code": "",
        "esd.vender_name": "",
        "esd.product_name": "",
        "esd.contact_person": "",
        "esd.storage_facility": "",
        "esd.status": "",
        "esd.lot_number": "",
        "esd.classification_primary": "",
        "esd.classification_secondary": ""
    });

    useEffect(() => {
        ipcRenderer.send('get-customers');
        ipcRenderer.on('customers-data', (event, data) => {
            setCustomers(data);
        });

        ipcRenderer.on('customer-deleted', (event, id) => {
            setCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
        });

        ipcRenderer.on('search-customers-result', (event, data) => {
            setCustomers(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('customers-data');
            ipcRenderer.removeAllListeners('search-customers-result');
        };
    }, []);

    const [displayData, setDisplayData] = useState([]);



    useEffect(() => {
        ipcRenderer.send('load-deposit-slip-details');
        const handleLoadDetails = (event, data) => {
            for (let i = 0; i < data.length; i++) {
                // if (slipsData[data[i].deposit_slip_id]) {
                //     slipsData[data[i].deposit_slip_id].arr.push({deposits: data[i].deposits, deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date,});
                // } else {
                //     slipsData[data[i].deposit_slip_id] = { deposit_slip_id: data[i].deposit_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, arr: [{deposits: data[i].deposits, deposit_method: data[i].deposit_method}] };    
                // }
                // displayData.push({ id:  data[i].ds_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].deposits, consumption_tax_amount: data[i].deposits * 1.1,  deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date, payment_method: data[i].deposit_method, slip: '入金伝票', status: data[i].status });
                setDisplayData((prevItems) => [...prevItems, { id:  data[i].ds_id, payment_date: data[i].deposit_date, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].deposits, consumption_tax_amount: data[i].deposits * 1.1,  deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date, payment_method: data[i].deposit_method, slip: '入金伝票', status: data[i].status }]);
            }
            // setDepositSlipDetails(data)
            // const arr = [];
            // for (let i = 0; i < data.length; i++) {
            //     const value = [
            //         data[i].deposit_date,       // 入金日付
            //         data[i].code,               // 伝票番号
            //         data[i].vender_name,        // 得意先
            //         data[i].deposit_method,     // 入金方法
            //         data[i].deposits,           // 入金額
            //         data[i].commission_fee,     // 手数料等
            //         data[i].claim_id,           // 請求番号
            //         data[i].data_category,      // データ区分
            //         data[i].status              // ステータス
            //     ];
            //     arr.push(value);
            // }

            // const dataForSet = {
            //     header: header,
            //     data: arr,
            //     fileName: fileName
            // };
            // setDataForExport(dataForSet);
        };
        const handleSearchResult = (event, data) => {
            // setDepositSlipDetails(data)
            // const arr = [];
            // for (let i = 0; i < data.length; i++) {
            //     const value = [
            //         data[i].deposit_date,       // 入金日付
            //         data[i].code,               // 伝票番号
            //         data[i].vender_name,        // 得意先
            //         data[i].deposit_method,     // 入金方法
            //         data[i].deposits,           // 入金額
            //         data[i].commission_fee,     // 手数料等
            //         data[i].claim_id,           // 請求番号
            //         data[i].data_category,      // データ区分
            //         data[i].status              // ステータス
            //     ];
            //     arr.push(value);
            // }

            // const dataForSet = {
            //     header: header,
            //     data: arr,
            //     fileName: fileName
            // };
            // setDataForExport(dataForSet);
        };

        ipcRenderer.on('load-deposit-slip-details', handleLoadDetails);
        ipcRenderer.on('search-deposit-slip-details-result', handleSearchResult);

        ipcRenderer.send('load-sales-slip-details');

        const handleSalesLoadDetails = (event, data) => {
            for (let i = 0; i < data.length; i++) {
                // displayData.push({ id: data[i].sales_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].price, consumption_tax_amount: data[i].price * 1.1,  deposit_method: data[i].payment_method, deposit_date: data[i].payment_date, payment_method: data[i].payment_method, slip: '売上伝票', status: data[i].status });
                setDisplayData((prevItems) => [...prevItems, { id: data[i].sales_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].price, consumption_tax_amount: data[i].price * 1.1,  deposit_method: data[i].payment_method, deposit_date: data[i].payment_date, payment_date: data[i].payment_date, payment_method: data[i].payment_method, slip: '売上伝票', status: data[i].status }]);
            }


            // setSalesSlipDetails(data)
            // const arr = []
            // for (let i = 0; i < data.length; i++) {
            //     const value = [
            //         data[i].order_date,               // 売上日付
            //         data[i].code,                     // 伝票番号
            //         data[i].order_slip_code,          // 受注伝票番号
            //         data[i].order_slip_code,          // 受注番号
            //         data[i].vender_name,              // 得意先
            //         data[i].product_id,               // 商品コード
            //         data[i].product_name,             // 商品名
            //         data[i].category,                 // カテゴリー
            //         data[i].subcategory,              // サブカテゴリー
            //         data[i].number,                   // 数量
            //         data[i].price,                    // 単価
            //         parseInt(data[i].number) * parseInt(data[i].price), // 金額
            //         data[i].gross_margin_rate,        // 粗利率
            //         data[i].gross_profit,             // 粗利益
            //         data[i].lot_number,               // ロット番号
            //         data[i].storage_facility,         // 倉庫
            //         data[i].contact_person,           // 担当者
            //         data[i].classification_primary,   // 区分1
            //         data[i].classification_secondary, // 区分2
            //         data[i].status         // 区分2
            //     ];
            //     arr.push(value)
            // }
            // const dataForSet = {
            //     header: header,
            //     data: arr,
            //     fileName: fileName
            // }
            // setDataForExport(dataForSet)
        };
        const handleSalesSearchResult = (event, data) => {
            // setSalesSlipDetails(data);
            // const arr = []
            // for (let i = 0; i < data.length; i++) {
            //     const value = [
            //         data[i].payment_voucher_id,
            //         data[i].vender_name,
            //         data[i].payment_method,
            //         data[i].payment_price,
            //         data[i].payment_price, // 支払金額税込と同じ値
            //         data[i].contact_person,
            //         data[i].classification1,
            //         data[i].classification2,
            //         data[i].status
            //     ];
            //     arr.push(value)
            // }
            // const dataForSet = {
            //     header: header,
            //     data: arr,
            //     fileName: fileName
            // }
            // setDataForExport(dataForSet)
        };

        ipcRenderer.on('load-sales-slip-details', handleSalesLoadDetails);
        ipcRenderer.on('search-sales-slip-details-result', handleSalesSearchResult);

        return () => {
            ipcRenderer.removeListener('load-deposit-slip-details', handleLoadDetails);
            ipcRenderer.removeListener('search-deposit-slip-details-result', handleSearchResult);
            ipcRenderer.removeListener('load-payment-voucher-details', handleLoadDetails);
            ipcRenderer.removeListener('search-payment-voucher-details-result', handleSearchResult);
        };
    }, []);

    const toggleDropdown = (id) => {
        console.log(id)
        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-3xl font-bold'>得意先元帳</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            集計表設定
                        </Link>
                    </div>
                </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='grid grid-cols-3 gap-6'>
                        <div>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>期間 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                                    <DatePicker
                                        selected={searchQueryList["esd.created_start"] ? new Date(searchQueryList["esd.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "esd.created_start")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                                <div>
                                    <div className='w-1'>&nbsp;</div>
                                    <div className='flex items-center px-2'>〜</div>
                                </div>

                                <div>
                                    <div className='text-sm pb-1.5 text-gray-100'>期間</div>
                                    <DatePicker
                                        selected={searchQueryList["esd.created_start"] ? new Date(searchQueryList["esd.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "esd.created_start")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>得意先</div>
                             <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="esd.vender_name"
                                value={searchQueryList["esd.vender_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>取引区分</div>
                            <CustomSelect className="w-full" options={options} name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                    </div>
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white'>適用して表示</div>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <div className='flex ml-auto pt-6'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            エクスポート
                        </Link>
                    </div>
                </div>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b'>
                            <th className='text-left pb-2.5'>得意先</th>
                            <th className='text-left pb-2.5'>取引日</th>
                            <th className='text-left pb-2.5'>取引区分</th>
                            <th className='text-left pb-2.5'>伝票番号</th>
                            <th className='text-left pb-2.5'>金額</th>
                            <th className='text-left pb-2.5'>消費税額</th>
                            <th className='text-left pb-2.5'>合計金額</th>
                            <th className='text-left pb-2.5'>入金予定日</th>
                            <th className='text-left pb-2.5'>残高</th>
                            <th className='text-left pb-2.5'>入金ステータス</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((data, index) => (
                            <tr className='border-b' key={index}>
                                <td className='py-4'>{data.vender_name || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.payment_date || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.data_category || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.code || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.price || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.consumption_tax_amount || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.price || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.payment_date || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{"残高" || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{data.status || <div className='border w-4'></div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function AccountsReceivableLedgerIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default AccountsReceivableLedgerIndex;