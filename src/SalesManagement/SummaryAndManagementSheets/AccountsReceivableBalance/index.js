import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';
import { BarChart } from '@mui/x-charts/BarChart';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

// export function SimpleBarCharts({customers, data}) {
//     return (
//       <BarChart
//         xAxis={[
//           {
//             id: 'barCategories',
//             data: ['株式会社A', '株式会社B', '株式会社C', '株式会社D', '株式会社E', '株式会社F', '株式会社G', '株式会社H', '株式会社I', '株式会社J', '株式会社K', '株式会社L'],
//             scaleType: 'band',
//           },
//         ]}
//         yAxis={[
//             {
//               id: 'yAxisId',
//               label: '円',
//               min: 0,
//               max: 10,
//               tickCount: 10,
//             },
//           ]}
//         series={[
//           {
//             data: [2, 5, 3, 4, 7, 8, 5, 2, 3, 9, 5, 6],
//             color: '#2563EB'
//           },
//         ]}
//         width={1216}
//         height={644}
//         barWidth={5}
//       />
//     );
//   }

export function SimpleBarCharts({ dataSet }) {
  const maxBarWidth = 50;
  const valueFormatter = (value) => {
    return `${value}円`;
  }
  const maxTotalSales = Math.max(...dataSet.map(item => item.accountPaymentBalance));
  return (
    <BarChart
      dataset={dataSet}
      xAxis={[{ scaleType: 'band', dataKey: 'customerName' }]}
      yAxis={[
        {
          label: '円',
          min: 0,
          max: maxTotalSales,
        },
      ]}
      series={[
        { dataKey: 'accountPaymentBalance', color: '#2563EB', label: '金額', valueFormatter },
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
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [depositSumDataInitial, setDepositSumDataInitial] = useState([]);
  const [salesSumDataInitial, setSalesSumDataInitial] = useState([]);
  const [salesSumInTaxDataInitial, seSalesSumInTaxDataInitial] = useState([]);
  const [depositSumData, setDepositSumData] = useState([]);
  const [salesSumData, setSalesSumData] = useState([]);
  const [salesSumInTaxData, seSalesSumInTaxData] = useState([]);
  const today = new Date();
  const dateFormatted = today.toISOString().split('T')[0];
  const [formattedDate, setFormattedDate] = useState(dateFormatted);

  const [chartData, setChartData] = useState([]);


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

    ipcRenderer.on('get-deposit-slip-sum-by-vender-id-result', (event, data) => {
      setDepositSumData(data);
      if (depositSumDataInitial.length === 0) setDepositSumDataInitial(data)
    });

    ipcRenderer.on('get-monthly-sales-by-vender-id-result', (event, data) => {
      setSalesSumData(data)
      if (salesSumDataInitial.length === 0) setSalesSumDataInitial(data)

    });

    ipcRenderer.on('get-monthly-sales-in-tax-by-vender-id-result', (event, data) => {
      seSalesSumInTaxData(data)
      if (salesSumInTaxDataInitial.length === 0) seSalesSumInTaxDataInitial(data)
    });


    return () => {
      ipcRenderer.removeAllListeners('customers-data');
      ipcRenderer.removeAllListeners('search-customers-result');
      ipcRenderer.removeAllListeners('get-deposit-slip-sum-by-vender-id-result');
      ipcRenderer.removeAllListeners('get-monthly-sales-by-vender-id-result');
      ipcRenderer.removeAllListeners('get-monthly-sales-in-tax-by-vender-id-result');
    };
  }, []);


  useEffect(() => {
    let venderIds = [];
    for (let i = 0; i < customers.length; i++) {
      venderIds.push(customers[i].id);
    }

    ipcRenderer.send('get-deposit-slip-sum-by-vender-id', { venderIds, formattedDate });
    ipcRenderer.send('get-monthly-sales-by-vender-id', { venderIds, formattedDate });
    ipcRenderer.send('get-monthly-sales-in-tax-by-vender-id', { venderIds, formattedDate });
  }, [customers]);

  useEffect(() => {
    const data = []
    for (let i = 0; i < customers.length; i++) {
      let obj = {}
      obj['customerName'] = customers[i].name_primary
      obj['accountPaymentBalance'] = getSalesByVendorIdInitial(customers[i].id) - (getDepositByVendorIdInitial(customers[i].id) + getCommissionFeeByVendorIdInitial(customers[i].id)) || 0
      data.push(obj)
    }
    setChartData(data)
  }, [depositSumDataInitial, salesSumDataInitial, salesSumInTaxDataInitial]);

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
    let venderIds = [];
    for (let i = 0; i < customers.length; i++) {
      venderIds.push(customers[i].id);
    }

    ipcRenderer.send('search-customers', searchQuery);
    ipcRenderer.send('get-deposit-slip-sum-by-vender-id', { venderIds, formattedDate });
    ipcRenderer.send('get-monthly-sales-by-vender-id', { venderIds, formattedDate });
    ipcRenderer.send('get-monthly-sales-in-tax-by-vender-id', { venderIds, formattedDate });
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

  function getDepositByVendorId(vendorId) {
    const data = depositSumData?.find(item => item.vender_id === vendorId.toString());
    return data?.total_deposits
  }

  function getCommissionFeeByVendorId(vendorId) {
    const data = depositSumData?.find(item => item.vender_id === vendorId.toString());
    return data?.total_commission_fee
  }

  function getSalesByVendorId(vendorId) {
    const data = salesSumData?.find(item => item.vender_id === vendorId.toString());
    return data?.total_sales
  }

  function getDepositByVendorIdInitial(vendorId) {
    const data = depositSumDataInitial?.find(item => item.vender_id === vendorId.toString());
    return data?.total_deposits
  }

  function getCommissionFeeByVendorIdInitial(vendorId) {
    const data = depositSumDataInitial?.find(item => item.vender_id === vendorId.toString());
    return data?.total_commission_fee
  }

  function getSalesByVendorIdInitial(vendorId) {
    const data = salesSumDataInitial?.find(item => item.vender_id === vendorId.toString());
    return data?.total_sales
  }

  function getSalesInTaxByVendorId(vendorId) {
    const data = salesSumInTaxData?.find(item => item.vender_id === vendorId.toString());
    return data?.total_sales
  }

  return (
    <div className='w-full'>
      <div className='p-8'>
        <div className='pb-6 flex items-center'>
          <div className='text-3xl font-bold'>売掛金残高</div>
          <div className='flex ml-auto'>
            <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
              <div className='flex items-center'>
              </div>
              出力設定

            </Link>
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
                    name="date"
                    value={searchQuery["date"]}
                    onChange={setSearchQuery}
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
                    name="date"
                    value={searchQuery["date"]}
                    onChange={setSearchQuery}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='text-sm pb-1.5'>得意先</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='検索'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='flex mt-6'>
            <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={() => handleSearch()}>適用して表示</div>
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
        <table className="w-full mt-8 table-auto">
          <thead className=''>
            <tr className='border-b'>
              <th className='text-left pb-2.5'>得意先</th>
              <th className='text-left pb-2.5'>締越残高</th>
              <th className='text-left pb-2.5'>入金額</th>
              <th className='text-left pb-2.5'>手数料等</th>
              <th className='text-left pb-2.5'>税別合計</th>
              <th className='text-left pb-2.5'>消費税</th>
              <th className='text-left pb-2.5'>税込額</th>
              <th className='text-left pb-2.5'>売掛金残高</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr className='border-b' key={customer.id}>
                <td className='py-2.5'>{customer.name_primary || <div className='border w-4'></div>}</td>
                <td>￥{(getSalesByVendorId(customer.id) - (getDepositByVendorId(customer.id) + getCommissionFeeByVendorId(customer.id))) ? (getSalesByVendorId(customer.id) - (getDepositByVendorId(customer.id) + getCommissionFeeByVendorId(customer.id))).toLocaleString() : 0}</td>
                <td>￥{getDepositByVendorId(customer.id) ? getDepositByVendorId(customer.id).toLocaleString() : 0}</td>
                <td>￥{getCommissionFeeByVendorId(customer.id) ? getCommissionFeeByVendorId(customer.id).toLocaleString() : 0}</td>
                <td>{customer.email}</td>
                <td>{customer.email}</td>
                <td>{customer.email}</td>
                <td>￥{(getSalesByVendorIdInitial(customer.id) - (getDepositByVendorIdInitial(customer.id) + getCommissionFeeByVendorIdInitial(customer.id))) ? (getSalesByVendorIdInitial(customer.id) - (getDepositByVendorIdInitial(customer.id) + getCommissionFeeByVendorIdInitial(customer.id))).toLocaleString() : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pt-8 pb-6 text-2xl font-bold'>
          得意先別売掛金残高グラフ
        </div>
        <div className='mt-6'>
          <SimpleBarCharts dataSet={chartData} />
        </div>
      </div>
    </div>
  )
}

function AccountsReceivableBalanceIndex() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
    </Routes>
  )
}

export default AccountsReceivableBalanceIndex;