import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');
const iconv = require('iconv-lite');

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
    "支払日付",
    "伝票番号",
    "発注先",
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
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const fileName = `発注明細表_${year}${month}${day}_${hours}${minutes}${seconds}`;

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
        "pod.created_start": formatDate(firstDayOfMonth), // 今月の1日
        "pod.created_end": formatDate(lastDayOfMonth),   // 今月の末日
    }));
}, []);


  useEffect(() => {
    ipcRenderer.send('load-purchase-order-details');

    const handleLoadDetails = (event, data) => {
      setPurchaseOrderDetails(data);
      const arr = [];
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].order_date,
          data[i].purchase_order_id,
          data[i].vender_name,
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
    }
    const handleSearchResult = (event, data) => {
      setPurchaseOrderDetails(data);
      const arr = [];
      for (let i = 0; i < data.length; i++) {
        const value = [
          data[i].order_date,
          data[i].purchase_order_id,
          data[i].vender_name,
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

    ipcRenderer.on('load-purchase-order-details', handleLoadDetails);
    ipcRenderer.on('search-purchase-order-details-result', handleSearchResult);

    return () => {
      ipcRenderer.removeListener('load-purchase-order-details', handleLoadDetails);
      ipcRenderer.removeListener('search-purchase-order-details-result', handleSearchResult);
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

  const [selectedOption, setSelectedOption] = useState(null);

  const selectOption = (option, name) => {
    setSelectedOption(option);
    setSearchQueryList({ ...searchQueryList, [name]: option.value });
    setIsOpen(name);
  };



  return (
    <div className='w-5/6'>
      <div className='p-8'>
        <div className='pb-6 flex items-center'>
          <div className='text-2xl font-bold'>発注明細表</div>
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
                <div style={{ width: "130px" }}>
                  <div className='text-sm pb-1.5'>期間指定 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
                  {/* <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} /> */}
                  <input
                    type='date'
                    className='border rounded px-4 py-2.5 bg-white w-2/3 ml-[-10px]'
                    placeholder='適用開始日を入力'
                    name="pod.created_start"
                    value={searchQueryList["pod.created_start"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <div className='w-1'>&nbsp;</div>
                  <div className=' px-2'>〜</div>
                </div>

                <div className='flex items-center'>
                  <div>
                    <div className='text-sm pb-1.5 text-gray-100'>期間指定</div>
                    <input
                      type='date'
                      className='border rounded px-4 py-2.5 bg-white w-2/3 ml-[-10px]'
                      placeholder='適用開始日を入力'
                      name="pod.created_end"
                      value={searchQueryList["pod.created_end"]}
                      onChange={handleInputChange}
                    />
                  </div>
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
                  <td className='py-4'>{purchaseOrderDetail.code || <div className='border w-4'></div>}</td>
                  <td className='py-4'>{purchaseOrderDetail.vender_name || <div className='border w-4'></div>}</td>
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

function PurchaseOrderStatementsIndex() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  )
}

export default PurchaseOrderStatementsIndex;
