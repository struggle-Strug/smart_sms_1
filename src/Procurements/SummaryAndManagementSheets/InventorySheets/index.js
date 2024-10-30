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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                <div className='pb-6 text-2xl font-bold'>在庫表</div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-3 gap-8'>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>
                    <div className='flex mt-4'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'>適用して表示</div>
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
                            <th className='text-left pb-2.5'>支払日付</th>
                            <th className='text-left pb-2.5'>伝票番号</th>
                            <th className='text-left pb-2.5'>仕入先名</th>
                            <th className='text-left pb-2.5'>仕入先コード</th>
                            <th className='text-left pb-2.5'>備考</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {customers.map((customer) => (
                            <tr className='border-b' key={customer.id}>
                                <td className='py-4'>{customer.name_primary || <div className='border w-4'></div>}</td>
                                <td>{customer.name_primary || <div className='border w-4'></div>}</td>
                                <td>{customer.billing_code || <div className='border w-4'></div>}</td>
                                <td>{customer.phone_number || <div className='border w-4'></div>}</td>
                                <td>{customer.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function InventorySheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default InventorySheetsIndex;
