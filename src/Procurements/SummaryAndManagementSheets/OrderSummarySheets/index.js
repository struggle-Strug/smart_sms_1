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

    const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
    const [purchaseOrderDetail, setPurchaseOrderDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQueryList, setSearchQueryList] = useState({
        "v.name_primary": "",
        "p.classification_primary": "",
        "p.classification_secondary": "",
        "pod.product_name": "",
        "pod.contact_person": "",
        "pod.storage_facility": "",
        "pod.status": "",
        "pod.lot_number": "",
        "pod.created_start": "",
        "pod.created_end": "",
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
        "日付",
        "仕入先",
        "商品名",
        "カテゴリー",
        "サブカテゴリー",
        "担当者",
        "区分１",
        "区分２",
        "倉庫",
        "ステータス",
        "ロット番号",
        "発注数量",
        "単価",
        "発注金額",
        "構成比"
    ];

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `発注集計表_${year}${month}${day}_${hours}${minutes}${seconds}`;

    const [dataForExport, setDataForExport] = useState({
        header: header,
        data: [],
        fileName: fileName
    });


    useEffect(() => {
        ipcRenderer.send('load-purchase-order-details');

        const handleLoadDetails = (event, data) => {
            setPurchaseOrderDetails(data);
            const arr = [];
            let totalNumber = 0;
            let totalAmount = 0;
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].order_date,
                    data[i].vender_name,
                    data[i].product_name,
                    data[i].classification_primary,
                    data[i].classification_secondary,
                    data[i].contact_person,
                    data[i].classification1,
                    data[i].classification2,
                    data[i].storage_facility,
                    data[i].status,
                    data[i].lot_number,
                    data[i].number,
                    data[i].price,
                    parseInt(data[i].number) * parseInt(data[i].price),
                    "100%" // 構成比 (仮に固定値としておきますが、実際の構成比計算があればそのロジックを入れてください)
                ];
                arr.push(value);
                totalNumber += parseInt(data[i].number);
                totalAmount += parseInt(data[i].number) * parseInt(data[i].price);
            }

            arr.push([
                '', '', '', '', '', '', '', '', '', '', '',
                `合計数量: ${totalNumber}`,
                '',
                `合計金額: ${totalAmount}円`,
                "構成比: 100%"
            ]);

            const dataForSet = {
                header: header,
                data: arr,
                fileName: fileName
            };
            setDataForExport(dataForSet);
        };
        const handleSearchResult = (event, data) => {
            setPurchaseOrderDetails(data);
            const arr = [];
            let totalNumber = 0;
            let totalAmount = 0;
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].order_date,
                    data[i].vender_name,
                    data[i].product_name,
                    data[i].classification_primary,
                    data[i].classification_secondary,
                    data[i].contact_person,
                    data[i].classification1,
                    data[i].classification2,
                    data[i].storage_facility,
                    data[i].status,
                    data[i].lot_number,
                    data[i].number,
                    data[i].price,
                    parseInt(data[i].number) * parseInt(data[i].price),
                    (parseInt(data[i].number) * parseInt(data[i].price)) / handlePurchaseOrderNumberPrice(data) // 構成比 (仮に固定値としておきますが、実際の構成比計算があればそのロジックを入れてください)
                ];
                arr.push(value);
                totalNumber += parseInt(data[i].number);
                totalAmount += parseInt(data[i].number) * parseInt(data[i].price);
            }

            arr.push([
                '', '', '', '', '', '', '', '', '', '', '',
                `合計数量: ${totalNumber}`,
                '',
                `合計金額: ${totalAmount}円`,
                "構成比: 100%"
            ]);

            const dataForSet = {
                header: header,
                data: arr,
                fileName: fileName
            };
            setDataForExport(dataForSet);
        };

        ipcRenderer.on('load-purchase-order-details', handleLoadDetails);
        ipcRenderer.on('search-purchase-order-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-purchase-order-details', handleLoadDetails);
            ipcRenderer.removeListener('search-purchase-order-details-result', handleSearchResult);
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
        const searchColums = {}
        setPurchaseOrderDetails([])
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-purchase-order-details', searchColums);
    };

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
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

    const handlePurchaseOrderNumberSum = (purchaseOrderDetails) => {
        let sum = 0;
        for (let i = 0; i < purchaseOrderDetails.length; i++) {
            sum += parseInt(purchaseOrderDetails[i].number);
        }
        return sum.toLocaleString();
    };

    const handlePurchaseOrderNumberPrice = (purchaseOrderDetails) => {
        let purchaseOrderSumPrice = 0;
        for (let i = 0; i < purchaseOrderDetails.length; i++) {
            purchaseOrderSumPrice += parseInt(purchaseOrderDetails[i].number) * parseInt(purchaseOrderDetails[i].price);
        }
        return purchaseOrderSumPrice.toLocaleString();
    };

    const exportToCSV = () => {
        console.log("click")
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

    const [selectedOption, setSelectedOption] = useState(null);

    const selectOption = (option, name) => {
        setSelectedOption(option);
        setSearchQueryList({ ...searchQueryList, [name]: option.value });
        setIsOpen(name);
    };



    return (
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>発注集計表</div>
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
                                        selected={searchQueryList["pod.created_start"] ? new Date(searchQueryList["pod.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "pod.created_start")}
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
                                        selected={searchQueryList["pod.created_end"] ? new Date(searchQueryList["pod.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "pod.created_end")}
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
                            <div className='text-sm pb-1.5 w-40'>ステータス</div>
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleDropdown("po.status")}
                                >
                                    <span>{searchQueryList["po.status"] ? searchQueryList["po.status"] : "ステータス"}</span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform ${isOpen === "po.status" ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isOpen === "po.status" && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                                        {[{ value: "未処理", label: "未処理" }, { value: "一部処理", label: "一部処理" }, { value: "仕入済", label: "仕入済" }].map((option) => (
                                            <div
                                                key={option.value}
                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                                onClick={() => selectOption(option, "po.status")}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
            </div>
            <div className='flex px-8 justify-end'>
                <div className='border rounded-lg py-3 px-7 text-base font-bold text-black' onClick={() => exportToCSV()}>
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
                            <th className='text-left pb-2.5'>発注数量</th>
                            <th className='text-left pb-2.5'>単価</th>
                            <th className='text-left pb-2.5'>発注金額</th>
                            <th className='text-left pb-2.5'>構成比</th>
                        </tr>
                    </thead>
                    <tbody className=''>
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
                                <td className='py-4'>{(parseInt(purchaseOrderDetail.number) * parseInt(purchaseOrderDetail.price)) / handlePurchaseOrderNumberPrice(purchaseOrderDetails)*100 || <div className='border w-4'></div>}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='grid grid-cols-2'>
                    <div className='py-1 pr-4'>発注数量</div>
                    <div className='py-1 font-bold'>{handlePurchaseOrderNumberSum(purchaseOrderDetails)}個</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='font-bold py-1 pr-4'>発注金額（税別）</div>
                    <div className='py-1 font-bold'>{handlePurchaseOrderNumberPrice(purchaseOrderDetails)}円</div>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='font-bold py-1 pr-4'>構成比</div>
                    <div className='py-1 font-bold'>100%</div>
                </div>
            </div>
        </div>
    )
}

function OrderSummarySheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default OrderSummarySheetsIndex;
