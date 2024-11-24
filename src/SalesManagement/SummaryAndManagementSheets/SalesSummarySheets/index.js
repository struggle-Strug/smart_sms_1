import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import { BarChart } from '@mui/x-charts/BarChart';
import { toHaveFormValues } from '@testing-library/jest-dom/matchers';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

export function SimpleBarCharts({ companyData, values, dataSet }) {
  const maxBarWidth = 50;
  const calculatedBarWidth = Math.min(maxBarWidth, 1216 / companyData.length);
  console.log(dataSet)
  const valueFormatter = (value) => {
    return `${value.toLocaleString()}円`;
  }
  return (
    <BarChart
      dataset={dataSet}
      xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
      yAxis={[
        {
          label: '円',
          min: 0,
          max: Math.max(...values),
        },
      ]}
      series={[
        { dataKey: 'value', color: '#2563EB', label: '金額', valueFormatter },
      ]}
      height={644}
    />
  );
}


function Index() {
  const options = [
    { value: '御中', label: '御中' },
    { value: '貴社', label: '貴社' },
  ];

  const [SalesSlipDetails, setSalesSlipDetails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [searchQueryList, setSearchQueryList] = useState({
    "ssd.created_start": "",          // Start Date for Date Range
    "ssd.created_end": "",            // End Date for Date Range
    "p.category": "",                 // Category
    "p.subcategory": "",              // Subcategory
    "ss.code": "",                    // Order Code
    "ss.vender_name": "",            // Customer
    "ssd.product_name": "",           // Product
    "ss.contact_person": "",          // Contact Person
    "ssd.storage_facility": "",       // Storage Facility
    "ss.status": "",                  // Status
    "ssd.lot_number": "",             // Lot Number
    "p.classification_primary": "",   // Classification 1
    "p.classification_secondary": ""  // Classification 2
  });



  const header = [
    "売上日付",
    "伝票番号",
    "受注伝票番号",
    "受注番号",
    "得意先",
    "商品コード",
    "商品名",
    "カテゴリー",
    "サブカテゴリー",
    "数量",
    "単価",
    "金額",
    "粗利率",
    "粗利益",
    "ロット番号",
    "倉庫",
    "担当者",
    "区分1",
    "区分2",
    "ステータス"
  ];


  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const fileName = `売上集計表_${year}${month}${day}_${hours}${minutes}${seconds}`;
  const [dataForExport, setDataForExport] = useState({
    header: header,
    data: [],
    fileName: fileName
  })

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    // 古いデータを上書きする
    const sorted = [...SalesSlipDetails].sort((a, b) => {
      const aValue = key === 'composition_ratio'
        ? (parseInt(a.number) * parseInt(a.unit_price)) * 100 / handlePurchaseOrderNumberPrice(SalesSlipDetails)
        : key === 'price'
          ? parseInt(a.number) * parseInt(a.unit_price)
          : a[key];

      const bValue = key === 'composition_ratio'
        ? (parseInt(b.number) * parseInt(b.unit_price)) * 100 / handlePurchaseOrderNumberPrice(SalesSlipDetails)
        : key === 'price'
          ? parseInt(b.number) * parseInt(b.unit_price)
          : b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSalesSlipDetails(sorted);
    setSortConfig({ key, direction });
  };
  console.log(SalesSlipDetails);



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

  const createGraphData = (data) => {
    const accumulatedData = {};

    for (let i = 0; i < data.length; i++) {
      const name = data[i].vender_name;
      const value = parseInt(data[i].number) * parseInt(data[i].unit_price);
      if (accumulatedData[name]) {
        accumulatedData[name] += value;
      } else {
        accumulatedData[name] = value;
      }
    }
    const graphData = Object.keys(accumulatedData).map((name) => ({
      name: name,
      value: accumulatedData[name]
    }));

    let companyNames = Object.keys(accumulatedData);
    let values = Object.values(accumulatedData);


    return { graphData: graphData, companyNames: companyNames, values: values }
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
          "ssd.created_start": formatDate(firstDayOfMonth), // 今月の1日
          "ssd.created_end": formatDate(lastDayOfMonth),   // 今月の末日
      }));
  }, []);
  


  useEffect(() => {
    ipcRenderer.send('load-sales-slip-details');

    const handleLoadDetails = (event, data) => {
      setSalesSlipDetails(data)
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].order_date,               // 売上日付
          data[i].code,                     // 伝票番号
          data[i].order_slip_code,          // 受注伝票番号
          data[i].order_slip_code,          // 受注番号
          data[i].vender_name,              // 得意先
          data[i].product_id,               // 商品コード
          data[i].product_name,             // 商品名
          data[i].category,                 // カテゴリー
          data[i].subcategory,              // サブカテゴリー
          data[i].number,                   // 数量
          data[i].price,                    // 単価
          parseInt(data[i].number) * parseInt(data[i].price), // 金額
          data[i].gross_margin_rate,        // 粗利率
          data[i].gross_profit,             // 粗利益
          data[i].lot_number,               // ロット番号
          data[i].storage_facility,         // 倉庫
          data[i].contact_person,           // 担当者
          data[i].classification_primary,   // 区分1
          data[i].classification_secondary, // 区分2
          data[i].status         // 区分2
        ];
        arr.push(value)
      }
      const dataForSet = {
        header: header,
        data: arr,
        fileName: fileName
      }
      setDataForExport(dataForSet)
    };
    const handleSearchResult = (event, data) => {
      setSalesSlipDetails(data);
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].payment_voucher_id,
          data[i].vender_name,
          data[i].payment_method,
          data[i].payment_price,
          data[i].payment_price, // 支払金額税込と同じ値
          data[i].contact_person,
          data[i].classification1,
          data[i].classification2,
          data[i].status
        ];
        arr.push(value)
      }
      const dataForSet = {
        header: header,
        data: arr,
        fileName: fileName
      }
      setDataForExport(dataForSet)
    };

    ipcRenderer.on('load-sales-slip-details', handleLoadDetails);
    ipcRenderer.on('search-sales-slip-details-result', handleSearchResult);

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
    setSalesSlipDetails([])
    for (let key in searchQueryList) {
      if (searchQueryList[key] !== "") {
        searchColums[key] = searchQueryList[key]
      }
    }
    ipcRenderer.send('search-sales-slip-details', searchColums);
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

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handlePurchaseOrderNumberSum = (SalesSlipDetails) => {
    let sum = 0;
    for (let i = 0; i < SalesSlipDetails.length; i++) {
      sum += parseInt(SalesSlipDetails[i].number);
    }
    return sum;
  };

  const handlePurchaseOrderNumberPrice = (SalesSlipDetails) => {
    let purchaseOrderSumPrice = 0;
    for (let i = 0; i < SalesSlipDetails.length; i++) {
      purchaseOrderSumPrice += parseInt(SalesSlipDetails[i].number) * parseInt(SalesSlipDetails[i].unit_price);
    }
    return purchaseOrderSumPrice;
  };

  return (
    <div className='w-full'>
      <div className='p-8'>
        <div className='pb-6 flex items-center'>
          <div className='text-3xl font-bold'>売上集計表</div>
          <div className='flex ml-auto'>
            <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => setIsDialogOpen(true)}>
              エクスポート
            </div>
          </div>
        </div>
        <div className='bg-gray-100 rounded p-6'>
          <div className='pb-6 text-2xl font-bold'>
            表示条件指定
          </div>
          <div className='grid grid-cols-3 gap-6'>
            <div>
              <div className='flex items-center'>
                <div>
                  <div className='text-sm pb-1.5'>期間指定 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                  <input
                    type='date'
                    className='border rounded px-4 py-2.5 bg-white w-2/3'
                    placeholder='適用開始日を入力'
                    name="ssd.created_start"
                    value={searchQueryList["ssd.created_start"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <div className='w-1'>&nbsp;</div>
                  <div className='flex items-center px-2'>〜</div>
                </div>

                <div>
                  <div className='text-sm pb-1.5 text-gray-100'>期間</div>
                  <input
                    type='date'
                    className='border rounded px-4 py-2.5 bg-white w-2/3'
                    placeholder='適用開始日を入力'
                    name="ssd.created_end"
                    value={searchQueryList["ssd.created_end"]}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='text-sm pb-1.5'>得意先</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder=''
                name="ss.vender_name"
                value={searchQueryList["ss.vender_name"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>商品</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder=''
                name="ssd.product_name"
                value={searchQueryList["ssd.product_name"]}
              />
            </div>
          </div>
          <div>
            <Link to="#" onClick={toggleFilters} className='pt-3 text-sm flex underline'>
              {showFilters ? '' : 'フィルターを表示'}
            </Link>
          </div>

          {showFilters && (
            <div className='flex-col'>
              <div className='grid grid-cols-3 gap-6 mt-4'>
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
                  <div className='text-sm pb-1.5'>担当者</div>
                  <input
                    type='text'
                    className='border rounded px-4 py-2.5 bg-white w-full'
                    placeholder=''
                    name="ss.contact_person"
                    value={searchQueryList["ss.contact_persony"]}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-6 mt-6'>
                <div>
                  <div className='text-sm pb-1.5'>倉庫</div>
                  <input
                    type='text'
                    className='border rounded px-4 py-2.5 bg-white w-full'
                    placeholder=''
                    name="ssd.storage_facility"
                    value={searchQueryList["ssd.storage_facility"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <div className='text-sm pb-1.5'>ロット番号</div>
                  <input
                    type='text'
                    className='border rounded px-4 py-2.5 bg-white w-full'
                    placeholder=''
                    name="ssd.lot_number"
                    value={searchQueryList["ssd.lot_number"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <div className='text-sm pb-1.5'>区分１</div>
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
                  <div className='text-sm pb-1.5'>区分２</div>
                  <input
                    type='text'
                    className='border rounded px-4 py-2.5 bg-white w-full'
                    placeholder=''
                    name="p.classification_secondary"
                    value={searchQueryList["p.classification_secondary"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='text-sm cursor-pointer' onClick={toggleFilters}>
                  フィルターを閉じる
                </div>
              </div>
            </div>
          )}
          <div className='flex mt-6'>
            <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
          </div>
        </div>
        <table className="w-full mt-8 table-auto">
          <thead>
            <tr className="border-b">
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>順位</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('vender_name')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>得意先</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('vender_name')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>

              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>商品コード</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('product_id')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>

              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>商品名</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('product_name')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>単価</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('unit_price')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>数量</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('number')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>金額</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('price')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>粗利率</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('gross_margin_rate')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>粗利益</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('gross_profit')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>
              <th className='text-left pb-2.5'>
                <div className='flex items-center'>
                  <div>構成比</div>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('composition_ratio')}>
                    <path d="M12.1117 6.27343C12.2289 6.39048 12.3877 6.45622 12.5534 6.45622C12.719 6.45622 12.8778 6.39048 12.995 6.27343L13.595 5.67343V14.1651C13.595 14.3309 13.6609 14.4898 13.7781 14.607C13.8953 14.7243 14.0543 14.7901 14.22 14.7901C14.3858 14.7901 14.5447 14.7243 14.662 14.607C14.7792 14.4898 14.845 14.3309 14.845 14.1651V5.67343L15.445 6.27343C15.5022 6.33484 15.5712 6.38409 15.6479 6.41825C15.7246 6.45241 15.8073 6.47078 15.8912 6.47226C15.9752 6.47374 16.0585 6.4583 16.1363 6.42687C16.2142 6.39543 16.2849 6.34865 16.3442 6.2893C16.4036 6.22995 16.4504 6.15925 16.4818 6.08143C16.5132 6.00361 16.5287 5.92025 16.5272 5.83633C16.5257 5.75241 16.5073 5.66965 16.4732 5.59298C16.439 5.51632 16.3898 5.44732 16.3284 5.3901L14.6617 3.72343C14.5445 3.60639 14.3856 3.54065 14.22 3.54065C14.0544 3.54065 13.8955 3.60639 13.7784 3.72343L12.1117 5.3901C11.9946 5.50729 11.9289 5.66614 11.9289 5.83177C11.9289 5.99739 11.9946 6.15624 12.1117 6.27343ZM8.17835 14.3234L8.77835 13.7234C8.83557 13.662 8.90457 13.6128 8.98124 13.5786C9.0579 13.5445 9.14066 13.5261 9.22458 13.5246C9.3085 13.5231 9.39186 13.5386 9.46968 13.57C9.54751 13.6014 9.6182 13.6482 9.67755 13.7076C9.7369 13.7669 9.78369 13.8376 9.81512 13.9154C9.84655 13.9933 9.86199 14.0766 9.86051 14.1605C9.85903 14.2445 9.84066 14.3272 9.8065 14.4039C9.77234 14.4805 9.72309 14.5495 9.66168 14.6068L7.99502 16.2734C7.87783 16.3905 7.71898 16.4562 7.55335 16.4562C7.38773 16.4562 7.22887 16.3905 7.11168 16.2734L5.44502 14.6068C5.38361 14.5495 5.33436 14.4805 5.3002 14.4039C5.26604 14.3272 5.24767 14.2445 5.24619 14.1605C5.24471 14.0766 5.26015 13.9933 5.29158 13.9154C5.32302 13.8376 5.3698 13.7669 5.42915 13.7076C5.4885 13.6482 5.5592 13.6014 5.63702 13.57C5.71484 13.5386 5.7982 13.5231 5.88212 13.5246C5.96604 13.5261 6.0488 13.5445 6.12547 13.5786C6.20213 13.6128 6.27113 13.662 6.32835 13.7234L6.92835 14.3234V5.83177C6.92835 5.66601 6.9942 5.50703 7.11141 5.38982C7.22862 5.27261 7.38759 5.20677 7.55335 5.20677C7.71911 5.20677 7.87808 5.27261 7.99529 5.38982C8.1125 5.50703 8.17835 5.66601 8.17835 5.83177V14.3234Z" fill="#1A1A1A" />
                  </svg>
                </div>
              </th>

              {/* <th className="text-left pb-2.5">順位</th>
                            <th className="text-left pb-2.5">得意先</th>
                            <th className="text-left pb-2.5">商品コード</th>
                            <th className="text-left pb-2.5">商品名</th>
                            <th className="text-left pb-2.5">単価</th>
                            <th className="text-left pb-2.5">数量</th>
                            <th className="text-left pb-2.5">金額</th>
                            <th className="text-left pb-2.5">粗利率</th>
                            <th className="text-left pb-2.5">粗利益</th>
                            <th className="text-left pb-2.5">構成比</th> */}
            </tr>
          </thead>
          <tbody>
            {SalesSlipDetails.map((SalesSlipDetail, index) => (
              <tr className="border-b" key={index}>
                <td className="py-4">1</td>
                <td className="py-4">{SalesSlipDetail.vender_name || '-'}</td>
                <td className="py-4">{SalesSlipDetail.product_id || '-'}</td>
                <td className="py-4">{SalesSlipDetail.product_name || '-'}</td>
                <td className="py-4">{SalesSlipDetail.unit_price || '-'}</td>
                <td className="py-4">{SalesSlipDetail.number || '-'}</td>
                <td className="py-4">{parseInt(SalesSlipDetail.number) * parseInt(SalesSlipDetail.unit_price) || '-'}</td>
                <td className="py-4">{SalesSlipDetail.gross_margin_rate || '-'}</td>
                <td className="py-4">{SalesSlipDetail.gross_profit || '-'}</td>
                <td className="py-4">{(parseInt(SalesSlipDetail.number) * parseInt(SalesSlipDetail.unit_price) * 100 / handlePurchaseOrderNumberPrice(SalesSlipDetails)) || <div className='border w-4'></div>}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex items-end justify-end py-4'>
          <div className=''>
            <div className='flex items-center'>
              <div className='mr-4'>数量</div>
              <div className='mr-12 font-bold text-lg'>{handlePurchaseOrderNumberSum(SalesSlipDetails).toLocaleString()}</div>
              <div className='mr-4'>金額</div>
              <div className='mr-12 font-bold text-lg'>{handlePurchaseOrderNumberPrice(SalesSlipDetails).toLocaleString()}円</div>
              <div className='mr-4'>構成比</div>
              <div className='font-bold text-lg'>100％</div>
            </div>
          </div>
        </div>
        <div className='text-2xl font-bold mr-auto'>売上グラフ</div>
        <div className='mt-6'>
          <SimpleBarCharts companyData={createGraphData(SalesSlipDetails).companyNames} values={createGraphData(SalesSlipDetails).values} dataSet={createGraphData(SalesSlipDetails).graphData} />
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

function SalesSummarySheetsIndex() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  )
}

export default SalesSummarySheetsIndex;
