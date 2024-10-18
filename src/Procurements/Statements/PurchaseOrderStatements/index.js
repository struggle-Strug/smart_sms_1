import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import SettingsDialog from '../../../Components/Statements/SettingsDialog';

const { ipcRenderer } = window.require('electron');


function Index() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
    const [purchaseOrderDetail, setPurchaseOrderDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({
        "v.name_primary": "",
        "p.classification_primary": "",
        "p.classification_secondary": "",
        "pod.product_name": "",
        "pod.contact_person": "",
        "pod.storage_facility": "",
        "pod.status": "",
        "pod.lot_number": "",
        "v.classification1": "",
        "v.classification2": "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        ipcRenderer.send('load-purchase-order-details');
        
        const handleLoadDetails = (event, data) => setPurchaseOrderDetails(data);
        const handleSearchResult = (event, data) => {
            
            setPurchaseOrderDetails(data);
        };
    
        ipcRenderer.on('load-purchase-order-details', handleLoadDetails);
        ipcRenderer.on('search-purchase-order-details-result', handleSearchResult);
    
        return () => {
            ipcRenderer.removeListener('load-purchase-order-details', handleLoadDetails);
            ipcRenderer.removeListener('search-purchase-order-details-result', handleSearchResult);
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
        const searchColums = {}
        setPurchaseOrderDetails([])
        console.log(searchQueryList)
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-purchase-order-details', searchColums);
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
                    <div className='text-2xl font-bold'>発注明細表</div>
                    <div className='flex ml-auto'>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => setIsDialogOpen(true)}>
                            明細表設定
                        </div>
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
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="v.name_primary"
                                value={searchQueryList["v.name_primary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品名</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pod.product_name"
                                value={searchQueryList["pod.product_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pod.contact_person"
                                value={searchQueryList["pod.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pod.storage_facility"
                                value={searchQueryList["pod.storage_facility"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ステータス</div>
                            <CustomSelect
                                options={options}
                                name="pod.status"
                                data={searchQueryList["pod.status"]}
                                onChange={(value) => handleInputChange({ target: { name: "pod.status", value } })}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ロット番号</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pod.lot_number"
                                value={searchQueryList["pod.lot_number"]}
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
                <div className='px-8 pb-8 overflow-x-scroll'>
                    <table className="w-full mt-8 table-auto" style={{ width: "2000px" }}>
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left pb-2.5'>支払日付</th>
                                <th className='text-left pb-2.5'>伝票番号</th>
                                <th className='text-left pb-2.5'>発注先</th>
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
                            {purchaseOrderDetails.map((purchaseOrderDetail) => (
                                <tr className='border-b' key={purchaseOrderDetail.id}>
                                    <td className='py-4'>{purchaseOrderDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.product_id || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.product_name || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.classification_primary || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.classification_secondary || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.price || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{parseInt(purchaseOrderDetail.number) * parseInt(purchaseOrderDetail.price) || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.lot_number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.storage_facility || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.contact_person || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.classification1 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.classification2 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseOrderDetail.status || <div className='border w-4'></div>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <SettingsDialog
                isOpen={isDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    )
}

function PurchaseOrderStatementsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PurchaseOrderStatementsIndex;
