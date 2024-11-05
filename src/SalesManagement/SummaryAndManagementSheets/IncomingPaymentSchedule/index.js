import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import { BarChart } from '@mui/x-charts/BarChart';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

export function SimpleBarCharts() {
    return (
        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: ['株式会社A', '株式会社B', '株式会社C', '株式会社D', '株式会社E', '株式会社F', '株式会社G', '株式会社H', '株式会社I', '株式会社J', '株式会社K', '株式会社L'],
                    scaleType: 'band',
                },
            ]}
            yAxis={[
                {
                    id: 'yAxisId',
                    label: '円',
                    min: 0,
                    max: 10,
                    tickCount: 10,
                },
            ]}
            series={[
                {
                    data: [2, 5, 3, 4, 7, 8, 5, 2, 3, 9, 5, 6],
                    color: '#2563EB'
                },
            ]}
            width={1216}
            height={644}
            barWidth={5}
        />
    );
}


function Index() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [depositSlipDetails, setDepositSlipDetails] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({
        "dsd.created_start": "",
        "dsd.created_end": "",
        "p.category": "",
        "p.subcategory": "",
        "dsd.code": "",
        "dsd.vender_name": "",
        "dsd.product_name": "",
        "dsd.contact_person": "",
        "dsd.storage_facility": "",
        "dsd.status": "",
        "dsd.lot_number": "",
        "dsd.classification_primary": "",
        "dsd.classification_secondary": ""
    });

    const header = [
        "入金日付",
        "伝票番号",
        "得意先",
        "入金方法",
        "入金額",
        "手数料等",
        "請求番号",
        "データ区分",
        "ステータス"
    ];





    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `支払明細表_${year}${month}${day}_${hours}${minutes}${seconds}`;
    const [dataForExport, setDataForExport] = useState({
        header: header,
        data: [],
        fileName: fileName
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
    };

    useEffect(() => {
        ipcRenderer.send('load-deposit-slip-details');

        const handleLoadDetails = (event, data) => {
            setDepositSlipDetails(data)
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].deposit_date,       // 入金日付
                    data[i].code,               // 伝票番号
                    data[i].vender_name,        // 得意先
                    data[i].deposit_method,     // 入金方法
                    data[i].deposits,           // 入金額
                    data[i].commission_fee,     // 手数料等
                    data[i].claim_id,           // 請求番号
                    data[i].data_category,      // データ区分
                    data[i].status              // ステータス
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
        const handleSearchResult = (event, data) => {
            setDepositSlipDetails(data)
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].deposit_date,       // 入金日付
                    data[i].code,               // 伝票番号
                    data[i].vender_name,        // 得意先
                    data[i].deposit_method,     // 入金方法
                    data[i].deposits,           // 入金額
                    data[i].commission_fee,     // 手数料等
                    data[i].claim_id,           // 請求番号
                    data[i].data_category,      // データ区分
                    data[i].status              // ステータス
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

        ipcRenderer.on('load-deposit-slip-details', handleLoadDetails);
        ipcRenderer.on('search-deposit-slip-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-deposit-slip-details', handleLoadDetails);
            ipcRenderer.removeListener('search-deposit-slip-details-result', handleSearchResult);
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

    const handleSave = () => {
        if (outputFormat === 'print') {

        } else if (outputFormat === 'csv') {
            exportToCSV();
        } else if (outputFormat === 'Excel') {
            exportToExcel();
        } else if (outputFormat === 'PDF') {
            exportPDF();
        }
        setIsDialogOpen(false);
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
        setDepositSlipDetails([])
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-deposit-slip-details', searchColums);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handlePurchaseOrderNumberSum = (orderSlipDetails) => {
        let sum = 0;
        for (let i = 0; i < orderSlipDetails.length; i++) {
            sum += parseInt(orderSlipDetails[i].number);
        }
        return sum;
    };

    const handlePurchaseOrderNumberPrice = (orderSlipDetails) => {
        let purchaseOrderSumPrice = 0;
        for (let i = 0; i < orderSlipDetails.length; i++) {
            purchaseOrderSumPrice += parseInt(orderSlipDetails[i].number) * parseInt(orderSlipDetails[i].unit_price);
        }
        return purchaseOrderSumPrice;
    };

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-3xl font-bold'>入金予定表</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            出力設定
                        </Link>
                    </div>
                </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='grid grid-cols-5 gap-6'>
                        <div>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>期間 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                                    <DatePicker
                                        selected={searchQueryList["dsd.created_start"] ? new Date(searchQueryList["dsd.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "dsd.created_start")}
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
                                    <div className='text-sm pb-1.5 text-gray-100'>期間</div>
                                    <DatePicker
                                        selected={searchQueryList["dsd.created_end"] ? new Date(searchQueryList["dsd.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "dsd.created_end")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>締日</div>
                            <DatePicker
                                selected={searchQueryList["dsd.closing_date"] ? new Date(searchQueryList["dsd.closing_date"]) : null}
                                onChange={(date) => handleDateChange(date, "dsd.closing_date")}
                                dateFormat="yyyy-MM-dd"
                                className='border rounded px-4 py-2.5 bg-white  w-full'
                                placeholderText='期間を選択'
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>入金ステータス</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.status"
                                value={searchQueryList["dsd.status"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>入金方法</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.deposit_method"
                                value={searchQueryList["dsd.deposit_method"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="ds.contact_person"
                                value={searchQueryList["ds.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex mt-6'>
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
                <div className='pb-8 px-8 overflow-x-scroll'>
                    <div className='pb-8 overflow-x-scroll'>
                        <table className="w-full mt-8 table-auto">
                            <thead className="border-b">
                                <tr>
                                    <th className='text-left pb-2.5'>得意先</th>
                                    <th className='text-left pb-2.5'>入金ステータス</th>
                                    <th className='text-left pb-2.5'>入金予定日</th>
                                    <th className='text-left pb-2.5'>入金予定金額</th>
                                    <th className='text-left pb-2.5'>入金方法</th>
                                    <th className='text-left pb-2.5'>担当者</th>
                                </tr>
                            </thead>
                            <tbody>
                                {depositSlipDetails.map((depositSlipDetail, index) => (
                                    <tr className="border-b" key={index}>
                                        <td className="py-4">{depositSlipDetail.vender_name || '-'}</td>
                                        <td className="py-4">{depositSlipDetail.status || '-'}</td>
                                        <td className="py-4">{depositSlipDetail.deposit_date || '-'}</td>
                                        <td className="py-4">{depositSlipDetail.deposits || '-'}</td>
                                        <td className="py-4">{depositSlipDetail.deposit_method || '-'}</td>
                                        <td className="py-4">{depositSlipDetail.product_name || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function IncomingPaymentScheduleIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default IncomingPaymentScheduleIndex;