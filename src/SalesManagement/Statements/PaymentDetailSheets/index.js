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

    const fileName = `入金明細表_${year}${month}${day}_${hours}${minutes}${seconds}`;
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
      // 現在の日付を取得
      const now = new Date();
      
      // 今月の1日を計算
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      // 日付を 'YYYY-MM-DD' フォーマットに変換する関数
      const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      };
  
      // 検索条件の初期化
      setSearchQueryList((prev) => ({
          ...prev,
          "dsd.created_start": formatDate(firstDayOfMonth), // 今月の1日
          "dsd.created_end": formatDate(lastDayOfMonth),   // 今月の末日
      }));
  }, []);
  

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

    return (
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-2xl font-bold'>入金明細表</div>
                    <div className='flex ml-auto'>
                    <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => setIsDialogOpen(true)}>
                          エクスポート
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
                                    <div className='text-sm pb-1.5 text-gray-100'>期間指定</div>
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
                            <div className='text-sm pb-1.5'>カテゴリー</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="p.category"
                                value={searchQueryList["p.category"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>サブカテゴリー</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="p.subcategory"
                                value={searchQueryList["p.subcategory"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>見積番号</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.code"
                                value={searchQueryList["dsd.code"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>得意先</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.vender_name"
                                value={searchQueryList["dsd.vender_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>商品</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.product_name"
                                value={searchQueryList["dsd.product_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.contact_person"
                                value={searchQueryList["dsd.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>倉庫</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.storage_facility"
                                value={searchQueryList["dsd.storage_facility"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ステータス</div>
                            {/* <CustomSelect options={options} name={"honorific"} data={customer} setData={setCustomer} /> */}
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>ロット番号</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.lot_number"
                                value={searchQueryList["dsd.lot_number"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分１</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.classification_primary"
                                value={searchQueryList["dsd.classification_primary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分２</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="dsd.classification_secondary"
                                value={searchQueryList["dsd.classification_secondary"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
                    </div>
                </div>
                <div className='py-8 overflow-x-scroll'>
                    <table className="w-full mt-8 table-auto">
                        <thead className="border-b">
                            <tr>
                                <th className='text-left pb-2.5'>入金日付</th>
                                <th className='text-left pb-2.5'>伝票番号</th>
                                <th className='text-left pb-2.5'>得意先</th>
                                <th className='text-left pb-2.5'>入金方法</th>
                                <th className='text-left pb-2.5'>入金額</th>
                                <th className='text-left pb-2.5'>手数料等</th>
                                <th className='text-left pb-2.5'>請求番号</th>
                                <th className='text-left pb-2.5'>データ区分</th>
                                <th className='text-left pb-2.5'>ステータス</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depositSlipDetails.map((depositSlipDetail, index) => (
                                <tr className="border-b" key={index}>
                                    <td className="py-4">{depositSlipDetail.deposit_date || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.code || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.vender_name || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.deposit_method || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.deposits || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.product_name || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.commission_fee || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.claim_id || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.data_category || '-'}</td>
                                    <td className="py-4">{depositSlipDetail.status || '-'}</td>
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
                        <p className='text-2xl font-bold px-6 py-4'>エクスポート設定</p>
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

function PaymentDetailSheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PaymentDetailSheetsIndex;
