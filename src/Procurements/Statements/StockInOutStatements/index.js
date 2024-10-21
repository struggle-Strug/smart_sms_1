import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [stockInOutSlipDetails, setStockInOutSlipDetails] = useState([]);
    const [stockInOutSlipDetail, setStockInOutSlipDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({        
        "siod.warehouse_from": "",
        "siod.warehouse_to": "",
        "siod.processType": "",
        "siod.product_name": "",
        "siod.contact_person": "",
        "siod.status": "",
        "siod.lot_number": "",
        "v.classification1": "",
        "v.classification2": "",

    });

    // const [customers, setCustomers] = useState([]);
    // const [isOpen, setIsOpen] = useState(false);
    // const dropdownRef = useRef(null);
    // const location = useLocation();
    // const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        ipcRenderer.send('load-stock-in-out-slip-details');

        const handleLoadDetails = (event, data) => setStockInOutSlipDetails(data);
        const handleSearchResult = (event, data) => {

            setStockInOutSlipDetails(data);
        };

        ipcRenderer.on('load-stock-in-out-slip-details', handleLoadDetails);
        ipcRenderer.on('search-stock-in-out-slip-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-stock-in-out-slip-details', handleLoadDetails);
            ipcRenderer.removeListener('search-stock-in-out-slip-details-result', handleSearchResult);
        };
    }, []);

    // useEffect(() => {
    //     ipcRenderer.send('get-customers');
    //     ipcRenderer.on('customers-data', (event, data) => {
    //         setCustomers(data);
    //     });

    //     ipcRenderer.on('customer-deleted', (event, id) => {
    //         setCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
    //     });

    //     ipcRenderer.on('search-customers-result', (event, data) => {
    //         setCustomers(data);
    //     });

    //     return () => {
    //         ipcRenderer.removeAllListeners('customers-data');
    //         ipcRenderer.removeAllListeners('search-customers-result');
    //     };
    // }, []);

    const [outputFormat, setOutputFormat] = useState('csv');
    const [remarks, setRemarks] = useState('');
    const [settingId, setSettingId] = useState(1)


    useEffect(() => {
        if (settingId) {
            ipcRenderer.send('get-statement-setting-detail', settingId);
            ipcRenderer.once('statement-setting-detail-data', (event, data) => {
                if (data) {
                    setOutputFormat(data.output_format || 'csv');
                    setRemarks(data.remarks || '');
                }
            });
        }
    }, [settingId]);

    const handleSave = () => {
        const settingData = {
            id: settingId,
            output_format: outputFormat,
            remarks: remarks,
        };

        ipcRenderer.send('save-statement-setting', settingData);
        ipcRenderer.once('load-statement-settings', (event, data) => {
            handleConfirmDelete(data); // 更新されたデータを返す
        });
    };

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
        const searchColums = {}
        setStockInOutSlipDetails([])
        console.log(searchQueryList)
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-stock-in-out-slip-details', searchColums);
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
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-customer', customerIdToDelete);
        setIsDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

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
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.warehouse_from"
                                value={searchQueryList["siod.warehouse_from"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>入庫先倉庫</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.warehouse_to"
                                value={searchQueryList["siod.warehouse_to"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex-col'>
                        <div className='text-sm pb-1.5'>処理種別 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                        <div className='my-2.5 flex'>
                        <label className='text-base'>
                            <input type="radio" name="siod.processType" value="type1" className='mr-2' />出庫
                        </label>
                        <label className='text-base ml-10'>
                            <input type="radio" name="siod.processType" value="type2" className='mr-2' />入庫
                        </label>
                        <label className='text-base ml-10'>
                            <input type="radio" name="siod.processType" value="type3" className='mr-2' />振替
                        </label>
                    </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.product_name"
                                value={searchQueryList["siod.product_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.contact_person"
                                value={searchQueryList["siod.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-6 py-6'>
                        <div>
                        <div className='text-sm pb-1.5'>ステータス</div>
                        <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.status"
                                value={searchQueryList["siod.status"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                        <div className='text-sm pb-1.5'>ロット番号</div>
                        <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="siod.lot_number"
                                value={searchQueryList["siod.lot_number"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                        <div className='text-sm pb-1.5'>区分１</div>
                        <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="v.classification1"
                                value={searchQueryList["v.classification1"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                        <div className='text-sm pb-1.5'>区分２</div>
                        <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="v.classification2"
                                value={searchQueryList["v.classification2"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
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
                            {stockInOutSlipDetails.map((stockInOutSlipDetail) => (
                                <tr className='border-b' key={stockInOutSlipDetail.id}>
                                    <td className='py-4'>{stockInOutSlipDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.processType || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.product_id || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.product_name || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.warehouse_from || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.warehouse_to || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.lot_number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.contact_person || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.classification1 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{stockInOutSlipDetail.classification2 || <div className='border w-4'></div>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
            {
                isDialogOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="container mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-md">
                        <p className='text-2xl font-bold px-6 py-4'>明細表設定</p>
                        <hr />
                        <div className='flex-col px-6 pt-4'>
                            <div className=''>出力形式選択</div>
                            <div className='mt-2.5 flex'>
                                <label className='text-base'>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="csv"
                                        checked={outputFormat === 'csv'}
                                        onChange={() => setOutputFormat('csv')}
                                        className='mr-2'
                                    />csv
                                </label>
                                <label className='text-base ml-10'>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="Excel"
                                        checked={outputFormat === 'Excel'}
                                        onChange={() => setOutputFormat('Excel')}
                                        className='mr-2'
                                    />Excel
                                </label>
                                <label className='text-base ml-10'>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="PDF"
                                        checked={outputFormat === 'PDF'}
                                        onChange={() => setOutputFormat('PDF')}
                                        className='mr-2'
                                    />PDF
                                </label>
                                <label className='text-base ml-10'>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="print"
                                        checked={outputFormat === 'print'}
                                        onChange={() => setOutputFormat('print')}
                                        className='mr-2'
                                    />印刷
                                </label>
                            </div>
                        </div>
                        <div className='px-6 pb-4'>
                            <div className='py-2.5 text-xl'>備考</div>
                            <div className='pb-2'>
                                <textarea
                                    className='border rounded px-4 py-2.5 bg-white w-full resize-none'
                                    placeholder=''
                                    rows={5}
                                    name="remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-end py-4 px-6">
                            <button onClick={handleCancelDelete} className="px-5 py-3 font-semibold text-base mr-6 bg-white border border-gray-300 rounded-xl">キャンセル</button>
                            <button onClick={handleSave} className="px-11 py-3 font-semibold text-base bg-blue-600 text-white border-0 rounded-xl">保存</button>
                        </div>
                    </div>
                </div>
            }
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
