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

  const [orderSlipDetails, setOrderSlipDetails] = useState([]);
  // const [paymentVoucherDetail, setPaymentVoucherDetail] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [searchQueryList, setSearchQueryList] = useState({
    "osd.created_start": "",
    "osd.created_end": "",
    "p.category": "",
    "p.subcategory": "",
    "osd.code": "",
    "osd.created_start": "",
    "osd.created_end": "",
    "osd.code": "",
    "osd.payment_method": "",
    "os.vender_name": "",
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

  const fileName = `受注集計表_${year}${month}${day}_${hours}${minutes}${seconds}`;
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
      "osd.created_start": formatDate(firstDayOfMonth), // 今月の1日
      "osd.created_end": formatDate(lastDayOfMonth),   // 今月の末日
    }));
  }, []);


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
        arr.push([
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
          `受注数量: ${handlePurchaseOrderNumberSum(orderSlipDetails).toLocaleString()}個`,
          '',
          `受注金額: ${handlePurchaseOrderNumberPrice(orderSlipDetails).toLocaleString()}円`,
          "構成比: 100%"
        ]);
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

  const handleSearch = () => {
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
                  <DatePicker
                    selected={searchQueryList["osd.created_start"] ? new Date(searchQueryList["osd.created_start"]) : null}
                    onChange={(date) => handleDateChange(date, "osd.created_start")}
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
                    selected={searchQueryList["osd.created_end"] ? new Date(searchQueryList["osd.created_end"]) : null}
                    onChange={(date) => handleDateChange(date, "osd.created_end")}
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
                placeholder=''
                name="os.vender_name"
                value={searchQueryList["os.vender_name"]}
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
                placeholder=''
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
                placeholder=''
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
                placeholder=''
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
          </div>
          <div className='flex mt-6'>
            <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
          </div>
        </div>
        <div className='py-8'>
          <table className="w-full table-auto">
            <thead className="border-b">
              <tr>
                <th className="text-left pb-2.5">順位</th>
                <th className="text-left pb-2.5">得意先</th>
                <th className="text-left pb-2.5">商品コード</th>
                <th className="text-left pb-2.5">商品名</th>
                <th className="text-left pb-2.5">数量</th>
                <th className="text-left pb-2.5">単価</th>
                <th className="text-left pb-2.5">金額</th>
                <th className="text-left pb-2.5">構成比</th>
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
