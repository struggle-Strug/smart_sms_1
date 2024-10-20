import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import { BarChart } from '@mui/x-charts/BarChart';
import ProcessRegistrationIndex from '../ProcessRegistration';

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

    const toggleDropdown = (id) => {
        console.log(id)
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

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-3xl font-bold'>月次売上推移</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            集計表設定
                        </Link>
                    </div>
                </div>
                <div className='bg-gray-100 rounded p-6 mb-8'>
                    <div className='pb-6 text-2xl font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-5 gap-6'>
                        <div>
                            <div className='text-sm pb-1.5'>最終年 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                            <CustomSelect className="w-full" options={options} placeholder={"2024"} name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>最終月 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                            <CustomSelect className="w-full" options={options} placeholder={"3月"}  name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>月数 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                            <CustomSelect className="w-full" options={options} placeholder={"12ヶ月"}  name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>得意先 </div>
                            <CustomSelect className="w-full" options={options} name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品 </div>
                            <CustomSelect className="w-full" options={options} name={"honorific"} data={customer} setData={setCustomer} />
                        </div>
                    </div>
                    <div className='pt-3 flex items-center'>
                        <Link to="#" onClick={toggleFilters} className='text-sm flex underline'>
                            {showFilters ? '' : 'フィルターを表示'}
                            <svg
                                className={`ml-1 w-4 h-4 transform transition-transform ${showFilters ? '' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                    </div>

                    {showFilters && (
                        <div className='flex-col'>
                            <div className='grid grid-cols-3 gap-6 mt-4'>
                                <div>
                                    <div className='text-sm pb-1.5'>カテゴリー</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>サブカテゴリー</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>担当者</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-6 mt-6'>
                                <div>
                                    <div className='text-sm pb-1.5'>倉庫</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>ロット番号</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>区分１</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>区分２</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div className='flex text-sm cursor-pointer underline' onClick={toggleFilters}>
                                    フィルターを閉じる
                                    <svg
                                        className={`ml-1 w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white'>適用して表示</div>
                    </div>
                    </div>

                    <div class="relative overflow-x-auto mb-8">
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="w-1/13 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                <th scope="col" class="px-2 py-2.5">
                                        
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年1月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年2月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年3月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年4月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年5月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年6月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年7月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年8月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年9月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年10月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年11月
                                    </th>
                                    <th scope="col" class="px-2 py-2.5">
                                        2024年12月
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" class="px-2 py-1.5 font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 whitespace-nowrap">
                                        売上金額
                                    </th>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                    <td class="px-2 py-1.5">
                                        ￥3,000,000
                                    </td>
                                </tr>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" class="px-2 py-1.5 font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 whitespace-nowrap">
                                        数量
                                    </th>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                    <td class="px-2 py-1.5">
                                        150
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='text-2xl font-bold mr-auto'>売上グラフ</div>
                    <div className='mt-6'>
                        <SimpleBarCharts />
                    </div>
                </div>
            </div>
    )
}

function MoneySalesTrendsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
            <Route path="process-registration" element={<ProcessRegistrationIndex />} />
        </Routes>
    )
}

export default MoneySalesTrendsIndex;
