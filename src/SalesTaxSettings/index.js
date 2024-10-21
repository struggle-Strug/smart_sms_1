import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SalesTaxSettingsAdd from './add';
import SalesTaxSettingsEdit from './edit';
import SalesTaxSettingsDetail from './detail';


const { ipcRenderer } = window.require('electron');


function Index() {
    const [salesTaxSettings, setSalesTaxSettings] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ipcRenderer.send('load-sales-tax-settings');
        ipcRenderer.on('sales-tax-settings-data', (event, data) => {
            setSalesTaxSettings(data);
        });

        ipcRenderer.on('sales-tax-setting-deleted', (event, id) => {
            setSalesTaxSettings((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
        });

        // ipcRenderer.on('search-customers-result', (event, data) => {
        //     setCustomers(data);
        // });

        return () => {
            ipcRenderer.removeAllListeners('sales-tax-settings-data');
            // ipcRenderer.removeAllListeners('search-customers-result');
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
            ipcRenderer.send('delete-sales-tax-setting', id);
        }
    };

    // const handleSearch = () => {
    //     ipcRenderer.send('search-customers', searchQuery);
    // };

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         handleSearch();
    //     }
    // };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                {/* <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div> */}
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    return (
        <div className='mx-40'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>消費税設定</div>
                <div className='flex'>
                <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>新規追加</Link></div>
                </div>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b'>
                            <th className='text-left pb-2.5'>消費税率</th>
                            <th className='text-left pb-2.5'>適用開始日</th>
                            <th className='text-left pb-2.5'>適用終了日</th>
                            <th className='text-center pb-2.5'>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesTaxSettings.map((customer) => (
                            <tr className='border-b' key={customer.id}>
                                <td>{customer.tax_rate || <div className='border w-4'></div>} %</td>
                                <td>{customer.start_date || <div className='border w-4'></div>}</td>
                                <td>{customer.end_date || <div className='border w-4'></div>}</td>
                                <td className='flex justify-center relative'>
                                    <div className='border rounded px-4 py-3 relative hover:cursor-pointer' onClick={(e) => toggleDropdown(customer.id)}>
                                        {isOpen === customer.id && <DropDown id={customer.id} />}
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.30664 10.968C5.20664 10.968 4.30664 11.868 4.30664 12.968C4.30664 14.068 5.20664 14.968 6.30664 14.968C7.40664 14.968 8.30664 14.068 8.30664 12.968C8.30664 11.868 7.40664 10.968 6.30664 10.968ZM18.3066 10.968C17.2066 10.968 16.3066 11.868 16.3066 12.968C16.3066 14.068 17.2066 14.968 18.3066 14.968C19.4066 14.968 20.3066 14.068 20.3066 12.968C20.3066 11.868 19.4066 10.968 18.3066 10.968ZM12.3066 10.968C11.2066 10.968 10.3066 11.868 10.3066 12.968C10.3066 14.068 11.2066 14.968 12.3066 14.968C13.4066 14.968 14.3066 14.068 14.3066 12.968C14.3066 11.868 13.4066 10.968 12.3066 10.968Z" fill="#1A1A1A" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function SalesTaxSettingsIndex() {
    return (
        <>
        <Routes>
            <Route path="" element={<Index />} />
            <Route path="add" element={<SalesTaxSettingsAdd />} />
            <Route path="edit/:id" element={<SalesTaxSettingsEdit />} />
            <Route path="detail/:id" element={<SalesTaxSettingsDetail />} />
        </Routes>
        </>
    )
}

export default SalesTaxSettingsIndex;
