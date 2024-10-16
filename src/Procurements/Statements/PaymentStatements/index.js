import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

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

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        );
    }

    return (
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-2xl font-bold'>支払明細表</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/purchase-order-details/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            明細表設定
                        </Link>
                    </div>
                </div>
                <div className='bg-gray-100 rounded-lg p-6'>
                    <div className='pb-6 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-2 gap-6 pb-6'>
                        <div className='pl-0'>
                            <div className='text-sm pb-1.5'>期間指定 <span className='text-xs ml-1 font-bold text-red-600'>必須</span>
                            </div> {/* ボックスと波線の間隔を調整 */}
                            <div className='flex items-center'>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/2' placeholder='' name="" value={""} />
                                <div className='flex items-center px-2'>〜</div> {/* 波線 */}
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/2' placeholder='' name="" value={""} />
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-6'>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払方法</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
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
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white'>適用して表示</div>
                    </div>
                </div>
                <div className='flex justify-end pt-6'>
                    <Link to={`/master/purchase-order-details/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                        エクスポート
                    </Link>
                </div>
                <div className='px-8 pb-8 overflow-x-scroll'>
                    <table className="w-full mt-8 table-auto" style={{ width: "2000px" }}>
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left pb-2.5'>仕入日</th>
                                <th className='text-left pb-2.5'>仕入番号</th>
                                <th className='text-left pb-2.5'>仕入先</th>
                                <th className='text-left pb-2.5'>商品コード</th>
                                <th className='text-left pb-2.5'>商品名</th>
                                <th className='text-left pb-2.5'>カテゴリー</th>
                                <th className='text-left pb-2.5'>サブカテゴリー</th>
                                <th className='text-left pb-2.5'>数量</th>
                                <th className='text-left pb-2.5'>単価</th>
                                <th className='text-left pb-2.5'>金額</th>
                                <th className='text-left pb-2.5'>ロット番号</th>
                                <th className='text-left pb-2.5'>倉庫</th>
                                <th className='text-left pb-2.5'>担当者</th>
                                <th className='text-left pb-2.5'>区分１</th>
                                <th className='text-left pb-2.5'>区分２</th>
                                <th className='text-left pb-2.5'>ステータス</th>
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
        </div>
    )
}

function PaymentStatementsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PaymentStatementsIndex;
