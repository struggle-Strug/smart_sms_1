import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');


function Index() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const [paymentVoucherDetails, setPaymentVoucherDetails] = useState([]);
    const [paymentVoucherDetail, setPaymentVoucherDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({
        "detail_payment_method": "",
        "pv.primary_name": "",
        "pv.vender_name": "",
        "pvd.order_date": "",
        "pvd.created_start": "",
        "pvd.created_end": "",
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

    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    // ソート処理
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        // 古いデータを上書きする
        const sorted = [...paymentVoucherDetails].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setPaymentVoucherDetails(sorted);
        setSortConfig({ key, direction });
    };

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `支払集計表_${year}${month}${day}_${hours}${minutes}${seconds}`;

    const [dataForExport, setDataForExport] = useState({
        header: header,
        data: [],
        fileName: fileName
    });

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
          "pvd.created_start": formatDate(firstDayOfMonth), // 今月の1日
          "pvd.created_end": formatDate(lastDayOfMonth),   // 今月の末日
      }));
  }, []);


    useEffect(() => {
        ipcRenderer.send('load-payment-voucher-details');

        const handleLoadDetails = (event, data) => {
            setPaymentVoucherDetails(data);

            const arr = [];
            let totalPaymentPrice = 0;

            // データを整形
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].vender_name,
                    `¥${data[i].payment_price?.toLocaleString()}`,
                    data[i].detail_payment_method,
                    data[i].closing_date
                ];
                arr.push(value);
                totalPaymentPrice += parseInt(data[i].payment_price);
            }

            // 集計データを追加
            arr.push([
                '合計',
                `¥${totalPaymentPrice.toLocaleString()}`,
                '', ''
            ]);

            const dataForSet = {
                header: [
                    "仕入先名", "支払金額(税別)", "支払方法", "支払日"
                ],
                data: arr,
                fileName: `支払集計表_${new Date().toLocaleString().replace(/[\/:\s]/g, '_')}`
            };

            setDataForExport(dataForSet);
        };

        const handleSearchResult = (event, data) => {
            setPaymentVoucherDetails(data);
            const arr = [];
            let totalPaymentPrice = 0;

            // データを整形
            for (let i = 0; i < data.length; i++) {
                const value = [
                    data[i].vender_name,
                    `¥${data[i].payment_price?.toLocaleString()}`,
                    data[i].detail_payment_method,
                    data[i].closing_date
                ];
                arr.push(value);
                totalPaymentPrice += parseInt(data[i].payment_price);
            }

            // 集計データを追加
            arr.push([
                '合計',
                `¥${totalPaymentPrice.toLocaleString()}`,
                '', ''
            ]);

            const dataForSet = {
                header: [
                    "仕入先名", "支払金額(税別)", "支払方法", "支払日"
                ],
                data: arr,
                fileName: `支払集計表_${new Date().toLocaleString().replace(/[\/:\s]/g, '_')}`
            };

            setDataForExport(dataForSet);
        };

        ipcRenderer.on('load-payment-voucher-details', handleLoadDetails);
        ipcRenderer.on('search-payment-voucher-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-payment-voucher-details', handleLoadDetails);
            ipcRenderer.removeListener('search-payment-voucher-details-result', handleSearchResult);
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
        setPaymentVoucherDetails([])
        console.log(searchQueryList)
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-payment-voucher-details', searchColums);
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
        );
    }

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-customer', customerIdToDelete);
        setIsDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    const handlePurchaseOrderNumberSum = (purchaseOrderDetails) => {
        let sum = 0;
        for (let i = 0; i < purchaseOrderDetails.length; i++) {
            sum += parseInt(purchaseOrderDetails[i].number);
        }
        return sum.toLocaleString();
    };

    const handlePaymentVoucherNumberPrice = (purchaseOrderDetails) => {
        let paymentVoucherSumPrice = 0;
        for (let i = 0; i < purchaseOrderDetails.length; i++) {
            paymentVoucherSumPrice += parseInt(purchaseOrderDetails[i].payment_price);
        }
        return paymentVoucherSumPrice.toLocaleString();
    };

    const exportToCSV = () => {
        ipcRenderer.send('export-to-csv', dataForExport);
    };

    const exportToExcel = () => {
        ipcRenderer.send('export-to-excel', dataForExport);
    };

    const exportToPDF = () => {
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

    const handleDateChange = (date, name) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
    };

    const exportPDF = () => {
        ipcRenderer.send('export-to-pdf', dataForExport);
    };



    return (
        <div className='w-full'>
            <div className='p-8'>
            <div className='pb-6 flex items-center'>
                    <div className='text-2xl font-bold'>支払集計表</div>
                    <div className='flex ml-auto'>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={() => setIsDialogOpen(true)}>
                            エクスポート
                        </div>
                    </div>
                </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-2 gap-8'>
                        <div className='pl-0'>
                            <div className='flex items-center'>
                                <div>
                                    <div className='text-sm pb-1.5'>期間指定</div>
                                    <DatePicker
                                        selected={searchQueryList["pvd.created_start"] ? new Date(searchQueryList["pvd.created_start"]) : null}
                                        onChange={(date) => handleDateChange(date, "pvd.created_start")}
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
                                        selected={searchQueryList["pvd.created_end"] ? new Date(searchQueryList["pvd.created_end"]) : null}
                                        onChange={(date) => handleDateChange(date, "pvd.created_end")}
                                        dateFormat="yyyy-MM-dd"
                                        className='border rounded px-4 py-2.5 bg-white  w-full'
                                        placeholderText='期間を選択'
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払方法</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="detail_payment_method"
                                value={searchQueryList["detail_payment_method"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pv.vender_name"
                                value={searchQueryList["pv.vender_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払日</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>
                    <div className='flex mt-4'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>集計する</div>
                    </div>
                </div>
            </div>
            <div className='px-8 pb-8'>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b '>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>仕入先名</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('vender_name')}>
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>支払金額(税別）</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('payment_price')}>
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>支払方法</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('detail_payment_method')}>
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                            <th className='text-left pb-2.5'>
                                <div className='flex items-center'>
                                    <div>支払日</div>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('closing_date')}>
                                        <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {paymentVoucherDetails.map((paymentVoucherDetail) => (
                            <tr className='border-b' key={paymentVoucherDetail.id}>
                                <td className='py-4'>{paymentVoucherDetail.vender_name}</td>
                                <td className='py-4'>¥{paymentVoucherDetail.payment_price?.toLocaleString()}</td>
                                <td>{paymentVoucherDetail.detail_payment_method}</td>
                                <td>{paymentVoucherDetail.closing_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-end items-center mb-16 text-lg'>
                <div className='grid grid-cols-2'>
                    <div className='font-bold py-1 pr-4'>支払金額(税別)</div>
                    <div className='py-1 font-bold'>{handlePaymentVoucherNumberPrice(paymentVoucherDetails)}円</div>
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
                            <button onClick={handleSave} className="px-11 py-3 font-semibold text-base bg-blue-600 text-white border-0 rounded-xl">書き出し</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

function PaymentSummarySheetsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PaymentSummarySheetsIndex;
