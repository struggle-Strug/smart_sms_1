import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Validator from '../../../utils/validator';
import CustomSelect from '../../../Components/CustomSelect';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

function Index() {
  const options = [
    { value: '御中', label: '御中' },
    { value: '貴社', label: '貴社' },
  ];

  const [orderSlipDetails, setOrderSlipDetails] = useState([]);
  // const [paymentVoucherDetail, setPaymentVoucherDetail] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [searchQueryList, setSearchQueryList] = useState({
    "pvd.created_start": "",
    "pvd.created_end": "",
    "p.category": "",
    "p.subcategory": "",
    "osd.code": "",
    "osd.created_start": "",
    "osd.created_end": "",
    "osd.code": "",
    "osd.payment_method": "",
    "osd.vender_name": "",
    "osd.product_name": "",
    "v.contact_person": "",
    "osd.storage_facility": "",
    "osd.lot_number": "",
    "p.classification_primary": "",
    "p.classification_secondary": ""
  });


  const header = [
    "見積日付",
    "伝票番号",
    "見積番号",
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
    "区分2"
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
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    // 古いデータを上書きする
    const sorted = [...orderSlipDetails].sort((a, b) => {
      const aValue = key === 'composition_ratio'
        ? (parseInt(a.number) * parseInt(a.unit_price)) * 100 / handlePurchaseOrderNumberPrice(orderSlipDetails)
        : key === 'price'
          ? parseInt(a.number) * parseInt(a.unit_price)
          : a[key];

      const bValue = key === 'composition_ratio'
        ? (parseInt(b.number) * parseInt(b.unit_price)) * 100 / handlePurchaseOrderNumberPrice(orderSlipDetails)
        : key === 'price'
          ? parseInt(b.number) * parseInt(b.unit_price)
          : b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setOrderSlipDetails(sorted);
    setSortConfig({ key, direction });
  };
  console.log(orderSlipDetails);

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
    ipcRenderer.send('load-order-slip-details');

    const handleLoadDetails = (event, data) => {
      setOrderSlipDetails(data)
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].order_date,               // 見積日付
          data[i].code,                     // 伝票番号
          data[i].estimateNumber,           // 見積番号
          data[i].vender_name,              // 得意先
          data[i].product_code,             // 商品コード
          data[i].product_name,             // 商品名
          data[i].category,                 // カテゴリー
          data[i].subcategory,              // サブカテゴリー
          data[i].number,                   // 数量
          data[i].price,                    // 単価
          parseInt(data[i].number) * parseInt(data[i].price),  // 金額
          data[i].gross_margin_rate,        // 粗利率
          data[i].gross_profit,             // 粗利益
          data[i].lot_number,               // ロット番号
          data[i].storage_facility,         // 倉庫
          data[i].contact_person,           // 担当者
          data[i].classification_primary,   // 区分1
          data[i].classification_secondary  // 区分2
        ];
        arr.push(value)
        // arr.push([
        //   '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        //   `受注数量: ${handlePurchaseOrderNumberSum(orderSlipDetails).toLocaleString()}個`,
        //   '',
        //   `受注金額: ${handlePurchaseOrderNumberPrice(orderSlipDetails).toLocaleString()}円`,
        //   "構成比: 100%"
        // ]);
      }
      const dataForSet = {
        header: header,
        data: arr,
        fileName: fileName
      }
      setDataForExport(dataForSet)
    };
    const handleSearchResult = (event, data) => {
      setOrderSlipDetails(data);
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

    ipcRenderer.on('load-order-slip-details', handleLoadDetails);
    ipcRenderer.on('search-order-slip-details-result', handleSearchResult);

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
  const validator = new Validator();

  const handleSearch = () => {
    validator.required(orderSlipDetails.code, 'code', '伝票番号');
    const searchColums = {}
    setOrderSlipDetails([])
    for (let key in searchQueryList) {
      if (searchQueryList[key] !== "") {
        searchColums[key] = searchQueryList[key]
      }
    }
    ipcRenderer.send('search-order-slip-details', searchColums);
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
          <div className='text-3xl font-bold'>受注集計表</div>
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
                    name="osd.created_start"
                    value={searchQueryList["osd.created_start"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <div className='w-1'>&nbsp;</div>
                  <div className='flex items-center px-2'>〜</div>
                </div>

                <div>
                  <div className='text-sm pb-1.5 text-gray-100'>期間指定</div>
                  <input
                    type='date'
                    className='border rounded px-4 py-2.5 bg-white w-2/3'
                    placeholder='適用開始日を入力'
                    name="osd.end"
                    value={searchQueryList["osd.end"]}
                    onChange={handleInputChange}
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
              <div className='text-sm pb-1.5'>受注番号</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder=''
                name="code"
                value={searchQueryList["code"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>得意先</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='得意先'
                name="osd.vender_name"
                value={searchQueryList["osd.vender_name"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>商品</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder=''
                name="osd.product_name"
                value={searchQueryList["osd.product_name"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>担当者</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='担当者'
                name="v.contact_person"
                value={searchQueryList["v.contact_person"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>倉庫</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='倉庫'
                name="osd.storage_facility"
                value={searchQueryList["osd.storage_facility"]}
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
                placeholder='ロット番号'
                name="osd.lot_number"
                value={searchQueryList["osd.lot_number"]}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className='text-sm pb-1.5'>区分１</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='区分１'
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
                placeholder='区分2'
                name="p.classification_secondary"
                value={searchQueryList["p.classification_secondary"]}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='flex mt-6'>
            <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
          </div>
        </div>
        <div className='pb-8'>
          <table className="w-full mt-8 table-auto">
            <thead className="border-b">
              <tr>
                {/* <th className="text-left pb-2.5">順位</th> */}
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
                    <div>数量</div>
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('number')}>
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
                    <div>金額</div>
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleSort('price')}>
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
              </tr>
            </thead>
            <tbody>
              {orderSlipDetails.map((orderSlipDetail, index) => (
                <tr className="border-b" key={index}>
                  <td className="py-4">1</td>
                  <td className="py-4">{orderSlipDetail.vender_name || '-'}</td>
                  <td className="py-4">{orderSlipDetail.product_id || '-'}</td>
                  <td className="py-4">{orderSlipDetail.product_name || '-'}</td>
                  <td className="py-4">{orderSlipDetail.number || '-'}</td>
                  <td className="py-4">{orderSlipDetail.unit_price || '-'}</td>
                  <td className="py-4">{parseInt(orderSlipDetail.number) * parseInt(orderSlipDetail.unit_price) || '-'}</td>
                  <td className="py-4">{(parseInt(orderSlipDetail.number) * parseInt(orderSlipDetail.unit_price) * 100 / handlePurchaseOrderNumberPrice(orderSlipDetails)) || <div className='border w-4'></div>}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex items-end justify-end py-4'>
          <div className=''>
            <div className='flex items-center'>
              <div className='mr-4'>受注数量</div>
              <div className='mr-12 font-bold text-lg'>{handlePurchaseOrderNumberSum(orderSlipDetails).toLocaleString()}</div>
              <div className='mr-4'>受注金額</div>
              <div className='mr-12 font-bold text-lg'>{handlePurchaseOrderNumberPrice(orderSlipDetails).toLocaleString()}円</div>
              <div className='mr-4'>構成比</div>
              <div className='font-bold text-lg'>100％</div>
            </div>
          </div>
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

function OrderSummarySheetsIndex() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  )
}

export default OrderSummarySheetsIndex;
