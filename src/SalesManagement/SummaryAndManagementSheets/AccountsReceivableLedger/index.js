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

  const [customer, setCustomer] = useState({
    id: '',
    name_primary: '',
    name_secondary: '',
    name_kana: '',
    honorific: '',
    phone_number: '',
    fax_number: '',
    zip_code: '',
    address: '',
    email: '',
    remarks: '',
    billing_code: '',
    billing_information: '',
    monthly_sales_target: ''
  });

  const [displayData, setDisplayData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [searchQueryList, setSearchQueryList] = useState({
    "esd.created_start": "",
    "esd.created_end": "",
    "p.category": "",
    "p.subcategory": "",
    "esd.code": "",
    "esd.vender_name": "",
    "esd.product_name": "",
    "esd.contact_person": "",
    "esd.storage_facility": "",
    "esd.status": "",
    "esd.lot_number": "",
    "esd.classification_primary": "",
    "esd.classification_secondary": ""
  });

  const header = [
    "得意先",
    "取引日",
    "取引区分",
    "伝票番号",
    "金額",
    "消費税額",
    "合計金額",
    "入金予定日",
    "残高",
    "入金ステータス"
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const fileName = `得意先元帳_${year}${month}${day}_${hours}${minutes}${seconds}`;
  const [dataForExport, setDataForExport] = useState({
    header: header,
    data: [],
    fileName: fileName
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQueryList((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    ipcRenderer.send('load-deposit-slip-details');

    const handleLoadDetails = (event, data) => {
      setDisplayData(data)
      const arr = []
      const header = [
        "得意先",
        "取引日",
        "取引区分",
        "伝票番号",
        "金額",
        "消費税額",
        "合計金額",
        "入金予定日",
        "残高",
        "入金ステータス"
      ];
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].vender_name,       // 入金日付
          data[i].payment_date,               // 伝票番号
          data[i].data_category,        // 得意先
          data[i].code,     // 入金方法
          data[i].price,           // 入金額
          data[i].consumption_tax_amount,     // 手数料等
          data[i].price,           // 請求番号
          data[i].payment_date,      // データ区分
          data[i].status              // ステータス
        ];
        arr.push(value);
      }
      const dataForSet = {
        header: header,
        data: arr,
        fileName: fileName
      }
      setDataForExport(dataForSet);
    };
    const handleSalesSearchResult = (event, data) => {
      setDisplayData(data);
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
    ipcRenderer.on('search-sales-slip-details-result', handleSalesSearchResult);

    return () => {
      ipcRenderer.removeListener('load-deposit-slip-details', handleLoadDetails);
      ipcRenderer.removeListener('search-deposit-slip-details-result', handleSalesSearchResult);
      ipcRenderer.removeListener('load-payment-voucher-details', handleLoadDetails);
      ipcRenderer.removeListener('search-payment-voucher-details-result', handleSalesSearchResult);
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

  const handleSearch = () => {
    const searchColums = {}
    setDisplayData([])
    for (let key in searchQueryList) {
      if (searchQueryList[key] !== "") {
        searchColums[key] = searchQueryList[key]
      }
    }
    ipcRenderer.send('search-estimation-slip-details', searchColums);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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


  // if (slipsData[data[i].deposit_slip_id]) {
  //     slipsData[data[i].deposit_slip_id].arr.push({deposits: data[i].deposits, deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date,});
  // } else {
  //     slipsData[data[i].deposit_slip_id] = { deposit_slip_id: data[i].deposit_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, arr: [{deposits: data[i].deposits, deposit_method: data[i].deposit_method}] };    
  // }
  // displayData.push({ id:  data[i].ds_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].deposits, consumption_tax_amount: data[i].deposits * 1.1,  deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date, payment_method: data[i].deposit_method, slip: '入金伝票', status: data[i].status });
  // setDisplayData((prevItems) => [...prevItems, { id: data[i].ds_id, payment_date: data[i].deposit_date, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].deposits, consumption_tax_amount: data[i].deposits * 1.1, deposit_method: data[i].deposit_method, deposit_date: data[i].deposit_date, payment_method: data[i].deposit_method, slip: '入金伝票', status: data[i].status }]);

// setDepositSlipDetails(data)
// const arr = [];
// for (let i = 0; i < data.length; i++) {
//     const value = [
//         data[i].deposit_date,       // 入金日付
//         data[i].code,               // 伝票番号
//         data[i].vender_name,        // 得意先
//         data[i].deposit_method,     // 入金方法
//         data[i].deposits,           // 入金額
//         data[i].commission_fee,     // 手数料等
//         data[i].claim_id,           // 請求番号
//         data[i].data_category,      // データ区分
//         data[i].status              // ステータス
//     ];

// ipcRenderer.on('load-deposit-slip-details', handleLoadDetails);
// ipcRenderer.on('search-deposit-slip-details-result', handleSearchResult);

// ipcRenderer.send('load-sales-slip-details');

// const handleSalesLoadDetails = (event, data) => {
//   for (let i = 0; i < data.length; i++) {
//     // displayData.push({ id: data[i].sales_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].price, consumption_tax_amount: data[i].price * 1.1,  deposit_method: data[i].payment_method, deposit_date: data[i].payment_date, payment_method: data[i].payment_method, slip: '売上伝票', status: data[i].status });
//     setDisplayData((prevItems) => [...prevItems, { id: data[i].sales_slip_id, code: data[i].code, vendor_name: data[i].vender_name, data_category: data[i].data_category, price: data[i].price, consumption_tax_amount: data[i].price * 1.1, deposit_method: data[i].payment_method, deposit_date: data[i].payment_date, payment_date: data[i].payment_date, payment_method: data[i].payment_method, slip: '売上伝票', status: data[i].status }]);
//   }


// setSalesSlipDetails(data)
// const arr = []
// for (let i = 0; i < data.length; i++) {
//     const value = [
//         data[i].order_date,               // 売上日付
//         data[i].code,                     // 伝票番号
//         data[i].order_slip_code,          // 受注伝票番号
//         data[i].order_slip_code,          // 受注番号
//         data[i].vender_name,              // 得意先
//         data[i].product_id,               // 商品コード
//         data[i].product_name,             // 商品名
//         data[i].category,                 // カテゴリー
//         data[i].subcategory,              // サブカテゴリー
//         data[i].number,                   // 数量
//         data[i].price,                    // 単価
//         parseInt(data[i].number) * parseInt(data[i].price), // 金額
//         data[i].gross_margin_rate,        // 粗利率
//         data[i].gross_profit,             // 粗利益
//         data[i].lot_number,               // ロット番号
//         data[i].storage_facility,         // 倉庫
//         data[i].contact_person,           // 担当者
//         data[i].classification_primary,   // 区分1
//         data[i].classification_secondary, // 区分2
//         data[i].status         // 区分2
//     ];
//     arr.push(value)
// }
// const dataForSet = {
//     header: header,
//     data: arr,
//     fileName: fileName
// }
// setDataForExport(dataForSet)





useEffect(() => {
  ipcRenderer.send('get-customers');
  ipcRenderer.on('customers-data', (event, data) => {
    setCustomers(data);
  });

  ipcRenderer.on('customer-deleted', (event, id) => {
    setCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
  });

  ipcRenderer.on('search-customers-result', (event, data) => {
    setCustomers(data);
  });

  return () => {
    ipcRenderer.removeAllListeners('customers-data');
    ipcRenderer.removeAllListeners('search-customers-result');
  };
}, []);








const handleDelete = (id) => {
  if (window.confirm('本当にこの顧客を削除しますか？')) {
    ipcRenderer.send('delete-customer', id);
  }
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

const [showFilters, setShowFilters] = useState(false);

const toggleFilters = () => {
  setShowFilters(prev => !prev);
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

const handleDateChange = (date, name) => {
  const formattedDate = date ? date.toISOString().split('T')[0] : '';
  setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
};

return (
  <div className='w-full'>
    <div className='p-8'>
      <div className='pb-6 flex items-center'>
        <div className='text-3xl font-bold'>得意先元帳</div>
        <div className='flex ml-auto'>
          <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => setIsDialogOpen(true)}>
            エクスポート
          </div>
        </div>
      </div>
      <div className='bg-gray-100 rounded p-6'>
        <div className='grid grid-cols-3 gap-6'>
          <div>
            <div className='flex items-center'>
              <div>
                <div className='text-sm pb-1.5'>期間 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                <input
                  type='date'
                  className='border rounded px-4 py-2.5 bg-white w-2/3'
                  placeholder='適用開始日を入力'
                  name="esd.created_start"
                  value={searchQueryList["esd.created_start"]}
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
                  name="esd.created_start"
                  value={searchQueryList["esd.created_start"]}
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
              name="esd.vender_name"
              value={searchQueryList["esd.vender_name"]}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <div className='text-sm pb-1.5'>取引区分</div>
            <CustomSelect className="w-full" options={options} name={"honorific"} data={customer} setData={setCustomer} />
          </div>
        </div>
        <div className='flex mt-6'>
          <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white'>適用して表示</div>
        </div>
      </div>
      <table className="w-full mt-8 table-auto">
        <thead className=''>
          <tr className='border-b'>
            <th className='text-left pb-2.5'>得意先</th>
            <th className='text-left pb-2.5'>取引日</th>
            <th className='text-left pb-2.5'>取引区分</th>
            <th className='text-left pb-2.5'>伝票番号</th>
            <th className='text-left pb-2.5'>金額</th>
            <th className='text-left pb-2.5'>消費税額</th>
            <th className='text-left pb-2.5'>合計金額</th>
            <th className='text-left pb-2.5'>入金予定日</th>
            <th className='text-left pb-2.5'>残高</th>
            <th className='text-left pb-2.5'>入金ステータス</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((data, index) => (
            <tr className='border-b' key={index}>
              <td className='py-4'>{data.vender_name || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.payment_date || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.data_category || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.code || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.price || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.consumption_tax_amount || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.price || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.payment_date || <div className='border w-4'></div>}</td>
              <td className='py-4'>{"残高" || <div className='border w-4'></div>}</td>
              <td className='py-4'>{data.status || <div className='border w-4'></div>}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

function AccountsReceivableLedgerIndex() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  )
}

export default AccountsReceivableLedgerIndex;