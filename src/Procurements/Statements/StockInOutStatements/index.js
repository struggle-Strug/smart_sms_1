import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');


function Index() {
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
            <div className='pb-6 flex items-center'>
                <div className='text-2xl font-bold'>入出庫明細表</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            明細表設定
                        </Link>
                        </div>
                    </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-6 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-3 gap-6'>
                    <div>
                        <div className='flex items-center'>
                            <div>
                            <div className='text-sm pb-1.5'>期間指定 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                            </div>
                            <div>
                            <div className='w-1'>&nbsp;</div>
                            <div className='flex items-center px-2'>〜</div>
                            </div>
                            
                            <div>
                            <div className='text-sm pb-1.5 text-gray-100'>期間指定</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                            </div>
                        </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>出庫元倉庫</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>入庫先倉庫</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div className='flex-col'>
                        <div className='text-sm pb-1.5'>処理種別 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                        <div className='my-2.5 flex'>
                        <label className='text-base'>
                            <input type="radio" name="processType" value="type1" className='mr-2' />出庫
                        </label>
                        <label className='text-base ml-10'>
                            <input type="radio" name="processType" value="type2" className='mr-2' />入庫
                        </label>
                        <label className='text-base ml-10'>
                            <input type="radio" name="processType" value="type3" className='mr-2' />振替
                        </label>
                    </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-6 py-6'>
                        <div>
                        <div className='text-sm pb-1.5'>ステータス</div>
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
                    </div>
                    <div className='flex'>
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
            </div>
            <div className='px-8 pb-8 overflow-x-scroll'>
                    <table className="w-full mt-8 table-auto" style={{ width: "2000px" }}>
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left pb-2.5'>日付</th>
                                <th className='text-left pb-2.5'>伝票番号</th>
                                <th className='text-left pb-2.5'>処理種別</th>
                                <th className='text-left pb-2.5'>商品コード</th>
                                <th className='text-left pb-2.5'>商品名</th>
                                <th className='text-left pb-2.5'>数量</th>
                                <th className='text-left pb-2.5'>入出元倉庫</th>
                                <th className='text-left pb-2.5'>出庫元倉庫</th>
                                <th className='text-left pb-2.5'>ロット番号</th>
                                <th className='text-left pb-2.5'>担当者</th>
                                <th className='text-left pb-2.5'>区分１</th>
                                <th className='text-left pb-2.5'>区分２</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr className='border-b' key={customer.id}>
                                    <td className='py-4'>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                    <td>テスト</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}

function StockInOutStatementsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default StockInOutStatementsIndex;
