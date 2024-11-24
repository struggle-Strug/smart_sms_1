import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [inventories, setInventories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQueryList, setSearchQueryList] = useState({
        "storage_facility": "",
        "product": "",
        // "アラート": "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [updatedDateTime, setUpdatedDateTime] = useState('');

    useEffect(() => {
        ipcRenderer.send('load-inventories');
        ipcRenderer.send('get-last-square-log');
        fetchTransactions('2024-11-01T00:00:00Z', '2024-11-15T23:59:59Z');
        ipcRenderer.on('load-inventories', (event, data) => {
            setInventories(data);
        });

        ipcRenderer.on('inventory-deleted', (event, id) => {
            setInventories((prevInventories) => prevInventories.filter(inventory => inventory.id !== id));
        });

        ipcRenderer.on('search-customers-result', (event, data) => {
            setInventories(data);
        });

        ipcRenderer.on('get-transactions', (event, data) => {
            console.log(data);
        });

        ipcRenderer.on('get-last-square-log-result', (event, data) => {
            console.log(data);
            setUpdatedDateTime(data?.request_date_time);
        });

        return () => {
            ipcRenderer.removeAllListeners('customers-data');
            ipcRenderer.removeAllListeners('search-customers-result');
            ipcRenderer.removeAllListeners('get-last-square-log-result');
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
            ipcRenderer.send('delete-inventory', id);
        }
    };

    const handleSearch = () => {
      console.log(searchQueryList);
        ipcRenderer.send('search-inventories', searchQueryList);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const fetchTransactions = async (startDate, endDate) => {
        try {
            console.log('Fetching transactions...');
            ipcRenderer.send('get-transactions', {startDate, endDate});
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    }

    const handleUpdateInventory = () => {
        ipcRenderer.send('load-inventories');
    }
    


    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='pb-6 text-2xl font-bold'>在庫表</div>
                    <div className='flex ml-auto'>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            アラート設定
                        </div>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            出力設定
                        </div>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={() => setIsDialogOpen(true)}>
                            エクスポート
                        </div>
                    </div>
                </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-3 gap-8'>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="倉庫" value={searchQueryList["倉庫"]} onChange={handleInputChange} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="商品" value={searchQueryList["商品"]} onChange={handleInputChange} />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>アラート先の指定</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="アラート" value={searchQueryList["アラート"]} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className='flex mt-4'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
                    </div>
                </div>
            </div>
            <div className='px-8'>
                <div className='mb-4'>
                    最終更新: {updatedDateTime} (内部システム更新: リアルタイム / POS連動: 15分ごと)
                </div>
                <div className='border rounded-lg py-3 px-7 text-base font-bold text-black inline-block' onClick={handleUpdateInventory}>
                    更新
                </div>
            </div>
            <div className='px-8 pb-8'>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b '>
                            <th className='text-left pb-2.5'>アラート</th>
                            <th className='text-left pb-2.5'>商品コード</th>
                            <th className='text-left pb-2.5'>商品名</th>
                            <th className='text-left pb-2.5'>ロット番号</th>
                            <th className='text-left pb-2.5'>在庫数</th>
                            <th className='text-left pb-2.5'>在庫予定数</th>
                            <th className='text-left pb-2.5'>警告値</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {inventories.map((inventory) => (
                            <tr className='border-b' key={inventory.id}>
                                <td className='py-4'>{<div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.product_id || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.product_name || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.lot_number || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.inventory || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.estimated_inventory || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{inventory.warning_value || <div className='border w-4'></div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='grid grid-cols-4'>
                    <div className='py-1 pr-4'>在庫数</div>
                    <div className='py-1 font-bold'>0 個</div>
                    <div className='py-1 pr-4'>在庫予定数</div>
                    <div className='py-1 font-bold'>0 個</div>
                </div>
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
