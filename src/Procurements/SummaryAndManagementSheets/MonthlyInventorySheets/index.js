import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [inventories, setInventories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQueryList, setSearchQueryList] = useState({
        "created": dayjs().format('YYYY-MM'),
        "p.name": "",
        "p.classification_primary": "",
        "p.classification_secondary": "",
        "invl.storage_facility_id": "",
        "invl.lot_number": "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [monthlyInventory, setMonthlyInventory] = useState([]);
    console.log(monthlyInventory);

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
    };

    const [updatedDateTime, setUpdatedDateTime] = useState('');

    useEffect(() => {
        ipcRenderer.send('get-inventory-log-filtered', searchQueryList);
        ipcRenderer.on('get-inventory-log-filtered-result', (event, result) => {
            setMonthlyInventory(result);
        })

        return () => {
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
        ipcRenderer.send('get-inventory-log-filtered', searchQueryList);
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

    function calculateTotals(dataArray) {
        const totals = {
            previous_stock: 0,
            monthly_in: 0,
            monthly_out: 0,
            end_stock: 0,
        };
    
        dataArray.forEach((item) => {
            totals.previous_stock += item.previous_stock || 0;
            totals.monthly_in += item.monthly_in || 0;
            totals.monthly_out += item.monthly_out || 0;
            totals.end_stock += item.end_stock || 0;
        });
    
        return totals;
    }
    


    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='pb-6 text-2xl font-bold'>月次在庫表</div>
                    <div className='flex ml-auto'>
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
                    <div className='grid grid-cols-4 gap-6'>
                        <div>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>年月指定</div>
                                    <DatePicker
                                        selected={searchQueryList["created"] ? new Date(searchQueryList["created"]) : null}
                                        onChange={(date) => handleDateChange(date, "created")}
                                        dateFormat="yyyy-MM"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="p.name"
                                value={searchQueryList["p.name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>カテゴリー</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="p.classification_primary"
                                value={searchQueryList["p.classification_primary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>サブカテゴリー</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="p.classification_secondary"
                                value={searchQueryList["p.classification_secondary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-6 pt-6'>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="invl.storage_facility_id"
                                value={searchQueryList["invl.storage_facility_id"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ロット番号</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="invl.lot_number"
                                value={searchQueryList["invl.lot_number"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>アラート</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder='これ必要ないかも'
                                name="p.classification_primary"
                                value={searchQueryList["p.classification_primary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex mt-4'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
                    </div>
                </div>
            </div>
            <div className='px-8 pb-8'>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b '>
                            <th className='text-left pb-2.5'>商品コード</th>
                            <th className='text-left pb-2.5'>商品名</th>
                            <th className='text-left pb-2.5'>前月末在庫数</th>
                            <th className='text-left pb-2.5'>当月入荷数</th>
                            <th className='text-left pb-2.5'>当月出荷数</th>
                            <th className='text-left pb-2.5'>当月末在庫数</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {monthlyInventory.map((monthlyInventory) => (
                            <tr className='border-b' key={monthlyInventory}>
                                <td className='py-4'>{monthlyInventory.product_code || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{monthlyInventory.product_name || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{monthlyInventory.previous_stock || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{monthlyInventory.monthly_in || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{monthlyInventory.monthly_out || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{monthlyInventory.end_stock || <div className='border w-4'></div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='flex'>
                    <div className='py-1 pr-8'>前月末在庫数</div>
                    <div className='py-1 font-bold pr-8'>{calculateTotals(monthlyInventory).previous_stock} 個</div>
                    <div className='py-1 pr-8'>当月入荷数</div>
                    <div className='py-1 font-bold pr-8'>{calculateTotals(monthlyInventory).monthly_in} 個</div>
                    <div className='py-1 pr-8'>当月出荷数</div>
                    <div className='py-1 font-bold pr-8'>{calculateTotals(monthlyInventory).monthly_out} 個</div>
                    <div className='py-1 pr-8'>当月末在庫数</div>
                    <div className='py-1 font-bold pr-8'>{calculateTotals(monthlyInventory).end_stock} 個</div>
                </div>
            </div>
        </div>
    )
}

function MonthlyInventorySheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default MonthlyInventorySheetsIndex;
