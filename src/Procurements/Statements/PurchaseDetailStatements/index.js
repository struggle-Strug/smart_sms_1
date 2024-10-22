import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');


function Index() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [purchaseInvoiceDetails, setPurchaseInvoiceDetails] = useState([]);
    const [purchaseInvoiceDetail, setPurchaseInvoiceDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({
        "v.name_primary": "",
        "p.classification_primary": "",
        "p.classification_secondary": "",
        "pid.product_name": "",
        "pid.contact_person": "",
        "pid.created_start": "",
        "pid.created_end": "",
        "pid.storage_facility": "",
        "pid.status": "",
        "pid.lot_number": "",
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

    const header = [
        "仕入日",
        "仕入番号",
        "仕入先",
        "商品コード",
        "商品名",
        "カテゴリー",
        "サブカテゴリー",
        "数量",
        "単価",
        "金額",
        "ロット番号",
        "倉庫",
        "担当者",
        "区分１",
        "区分２",
        "ステータス"
    ];

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `仕入明細表_${year}${month}${day}_${hours}${minutes}${seconds}`;
    const [dataForExport, setDataForExport] = useState({
        header: header,
        data: [],
        fileName: fileName
    });

    useEffect(() => {
        ipcRenderer.send('load-purchase-invoice-details');

        const handleLoadDetails = (event, data) => {
            setPurchaseInvoiceDetails(data)
            const arr = []
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].order_date,
                    data[i].purchase_order_id,
                    data[i].vendor_name,
                    data[i].product_id,
                    data[i].product_name,
                    data[i].classification_primary,
                    data[i].classification_secondary,
                    data[i].number,
                    data[i].price,
                    parseInt(data[i].number) * parseInt(data[i].price), // 金額は数量 × 単価
                    data[i].lot_number,
                    data[i].storage_facility,
                    data[i].contact_person,
                    data[i].classification1,
                    data[i].classification2,
                    data[i].status
                ];
                arr.push(value);
            }
            const dataForSet = {
                header: header,
                data: arr,
                fileName: fileName
            };
            setDataForExport(dataForSet);
        };

        ipcRenderer.on('load-purchase-invoice-details', handleLoadDetails);

        const handleSearchResult = (event, data) => {

            setPurchaseInvoiceDetails(data);
            const arr = []
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].order_date,
                    data[i].purchase_order_id,
                    data[i].vendor_name,
                    data[i].product_id,
                    data[i].product_name,
                    data[i].classification_primary,
                    data[i].classification_secondary,
                    data[i].number,
                    data[i].price,
                    parseInt(data[i].number) * parseInt(data[i].price), // 金額は数量 × 単価
                    data[i].lot_number,
                    data[i].storage_facility,
                    data[i].contact_person,
                    data[i].classification1,
                    data[i].classification2,
                    data[i].status
                ];
                arr.push(value);
            }
            const dataForSet = {
                header: header,
                data: arr,
                fileName: fileName
            };
            setDataForExport(dataForSet);
        };

        ipcRenderer.on('load-purchase-invoice-details', handleLoadDetails);
        ipcRenderer.on('search-purchase-invoice-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-purchase-invoice-details', handleLoadDetails);
            ipcRenderer.removeListener('search-purchase-invoice-details-result', handleSearchResult);
        };
    }, []);

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
        setPurchaseInvoiceDetails([])
        console.log(searchQueryList)
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-purchase-invoice-details', searchColums);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
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

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-customer', customerIdToDelete);
        setIsDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    const exportToCSV = () => {
        ipcRenderer.send('export-to-csv', dataForExport);
    };

    const exportToExcel = () => {
        ipcRenderer.send('export-to-excel', dataForExport);
    };

    const exportPDF = () => {
        ipcRenderer.send('export-to-pdf', dataForExport);
    };

    const [message, setMessage] = useState('');

    useEffect(() => {
        ipcRenderer.on('export-success', (event, successMessage) => {
            setMessage(successMessage);
            alert(successMessage);
        });

        ipcRenderer.on('export-failure', (event, errorMessage) => {
            setMessage(errorMessage);
            alert(errorMessage);
        });

        return () => {
            ipcRenderer.removeAllListeners('export-success');
            ipcRenderer.removeAllListeners('export-failure');
        };
    }, []);

    return (
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-2xl font-bold'>仕入明細表</div>
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
                                    {/* <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} /> */}
                                    <DatePicker
                                        selected={searchQueryList["pid.created_start"] ? new Date(searchQueryList["pid.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "pid.created_start")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                                <div>
                                    <div className='w-1'>&nbsp;</div>
                                    <div className='flex items-center px-2'>〜</div>
                                </div>

                                <div>
                                    <div className='text-sm pb-1.5 text-gray-100'>期間指定</div>
                                    {/* <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} /> */}
                                    <DatePicker
                                        selected={searchQueryList["pid.created_end"] ? new Date(searchQueryList["pid.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "pid.created_end")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
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
                                name="pid.product_name"
                                value={searchQueryList["pid.product_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pid.contact_person"
                                value={searchQueryList["pid.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pid.storage_facility"
                                value={searchQueryList["pid.storage_facility"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ステータス</div>
                            <CustomSelect
                                options={options}
                                name="pid.status"
                                data={searchQueryList["pid.status"]}
                                onChange={(value) => handleInputChange({ target: { name: "pid.status", value } })}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ロット番号</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pid.lot_number"
                                value={searchQueryList["pid.lot_number"]}
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
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={() => exportToCSV()}>
                            エクスポート
                        </div>
                    </div>
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
                            {purchaseInvoiceDetails.map((purchaseInvoiceDetail) => (
                                <tr className='border-b' key={purchaseInvoiceDetail.id}>
                                    <td className='py-4'>{purchaseInvoiceDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.order_date || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.product_id || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.product_name || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.classification_primary || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.classification_secondary || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.price || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{parseInt(purchaseInvoiceDetail.number) * parseInt(purchaseInvoiceDetail.price) || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.lot_number || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.storage_facility || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.contact_person || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.classification1 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.classification2 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{purchaseInvoiceDetail.status || <div className='border w-4'></div>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

function PurchaseDetailStatementsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PurchaseDetailStatementsIndex;
