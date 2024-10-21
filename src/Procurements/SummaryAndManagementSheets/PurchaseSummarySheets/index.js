import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [customers, setCustomers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const [company, setCompany] = useState({
        id: '',
        name: '',
        address: '',
        phone_number: '',
        fax_number: '',
        email: '',
        representive_name: '',
        bank_name: '',
        bank_account_number: '',
        bank_branch_name: '',
        bank_branch_code: '',
        account_type: '',
        remarks: '',
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

    const options = [
        { value: '普通', label: '普通' },
        { value: '当座', label: '当座' },
    ];

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
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>仕入集計表</div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-3 gap-8'>
                        <div>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>期間指定 <span className='text-sm font-bold text-red-600'>必須</span></div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                                <div>
                                    <div className='w-1'>&nbsp;</div>
                                    <div className='flex items-center'>〜</div>
                                </div>
                                <div>
                                    <div className='text-sm pb-1.5'>&nbsp;</div>
                                    <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>カテゴリー <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>サブカテゴリー <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ステータス <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <CustomSelect options={options} name={"account_type"} data={company} setData={setCompany} placeholder='' />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ロット番号 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分１ <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分２ <span className='text-sm font-bold text-red-600'>必須</span></div>
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
            <div className='px-8 pb-8 overflow-x-scroll'>
            <table className="w-full mt-8 table-auto" style={{ width: "2000px" }}>
                    <thead className=''>
                        <tr className='border-b '>
                            <th className='text-left pb-2.5'>日付</th>
                            <th className='text-left pb-2.5'>仕入先</th>
                            <th className='text-left pb-2.5'>商品名</th>
                            <th className='text-left pb-2.5'>カテゴリー</th>
                            <th className='text-left pb-2.5'>サブカテゴリー</th>
                            <th className='text-left pb-2.5'>担当者</th>
                            <th className='text-left pb-2.5'>区分１</th>
                            <th className='text-left pb-2.5'>区分２</th>
                            <th className='text-left pb-2.5'>倉庫</th>
                            <th className='text-left pb-2.5'>ステータス</th>
                            <th className='text-left pb-2.5'>ロット番号</th>
                            <th className='text-left pb-2.5'>仕入数量</th>
                            <th className='text-left pb-2.5'>単価</th>
                            <th className='text-left pb-2.5'>仕入金額</th>
                            <th className='text-left pb-2.5'>構成比</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {customers.map((customer) => (
                            <tr className='border-b' key={customer.id}>
                                <td className='py-4'>2024-01-23</td>
                                <td className='py-4'>PO001</td>
                                <td>商品A</td>
                                <td><div className='border w-4'></div></td>
                                <td>サブカテゴリーA</td>
                                <td>山田太郎</td>
                                <td>区分１</td>
                                <td>区分２</td>
                                <td>倉庫</td>
                                <td>ステータス１</td>
                                <td>ロット番号１</td>
                                <td>100</td>
                                <td>10</td>
                                <td>1000</td>
                                <td>100^</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>仕入数量</div>
                    <div className='py-1 font-bold'>200個</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div  className='font-bold py-1 pr-4'>仕入金額（税別）</div>
                    <div className='py-1 font-bold'>100,000円</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='font-bold py-1 pr-4'>構成比</div>
                    <div className='py-1 font-bold'>100%</div>
                </div>
            </div>
        </div>
    )
}

function PurchaseSummarySheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PurchaseSummarySheetsIndex;
