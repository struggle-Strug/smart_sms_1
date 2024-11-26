import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import CustomSelect from '../../../Components/CustomSelect';
import ListTooltip from '../../../Components/ListTooltip';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Validator from '../../../utils/validator';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const { ipcRenderer } = window.require('electron');

function OrderSlipsAdd() {
  const options = [
    { value: '御中', label: '御中' },
    { value: '貴社', label: '貴社' },
  ];
  const [isVendorIdFocused, setIsVendorIdFocused] = useState(false);
  const [isVendorNameFocused, setIsVendorNameFocused] = useState(false);
  const [isProductIdFocused, setIsProductIdFocused] = useState(-1);
  const [isProductNameFocused, setIsProductNameFocused] = useState(-1);
  const [taxRateList, setTaxRateList] = useState([]);
  const [storageFacilitiesList, setStorageFacilitiesList] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFocus = () => {
    setIsVendorIdFocused(true);
  };

  const handleBlur = () => {
    setIsVendorIdFocused(false);
  };

  const handleVendorNameFocus = () => {
    setIsVendorNameFocused(true);
  };

  const handleVendorNameBlur = () => {
    setIsVendorNameFocused(false);
  };

  const handleProductIdFocus = (index) => {
    setIsProductIdFocused(index)
  }

  const handleeProductIdBlur = () => {
    setIsProductIdFocused(-1);
  };

  const handleProductNameFocus = (index) => {
    setIsProductNameFocused(index)
  }

  const handleeProductNameBlur = () => {
    setIsProductNameFocused(-1);
  };

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

  const [orderSlip, setOrderSlip] = useState({
    code: '',
    order_id: '',
    order_date: '',
    delivery_date: '',
    vender_id: '',
    vender_name: '',
    honorific: '',
    vender_contact_person: '',
    estimation_slip_id: '',
    estimation_id: '',
    remarks: '',
    closing_date: '',
    deposit_due_date: '',
    deposit_method: '',
  });

  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    ipcRenderer.on('search-id-vendors-result', (event, data) => {
      setVendors(data);
    });

    ipcRenderer.on('search-name-vendors-result', (event, data) => {
      setVendors(data);
    });

    ipcRenderer.on('search-id-products-result', (event, data) => {
      setProducts(data);
    });

    ipcRenderer.on('search-name-products-result', (event, data) => {
      setProducts(data);
    });

    ipcRenderer.send('load-sales-tax-settings');
    ipcRenderer.on('sales-tax-settings-data', (event, data) => {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        const taxRateTemplate = {
          value: data[i].tax_rate,
          label: data[i].tax_rate,
        }
        arr.push(taxRateTemplate)
      }
      setTaxRateList(arr);
    });

    ipcRenderer.send('load-storage-facilities');
    ipcRenderer.on('load-storage-facilities', (event, data) => {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        const storageFacilitiesTemplate = {
          value: data[i].name,
          label: data[i].name,
        }
        arr.push(storageFacilitiesTemplate)
      }
      setStorageFacilitiesList(arr);
    });


    return () => {
      ipcRenderer.removeAllListeners('search-id-vendors-result');
      ipcRenderer.removeAllListeners('search-name-vendors-result');
      ipcRenderer.removeAllListeners('search-id-products-result');
      ipcRenderer.removeAllListeners('search-name-products-result');
    };
  }, []);

  const [orderSlipDetails, setOrderSlipDetails] = useState([
    {
      id: '',
      order_slip_id: '',
      product_id: '',
      product_name: '',
      number: '',
      unit: '',
      unit_price: '',
      tax_rate: '',
      lot_number: '',
      storage_facility: '',
      stock: '',
      gross_profit: '',
      gross_margin_rate: '',
      threshold: '',
      created: '',
      updated: '',
    }
  ]);

  const addOrderSlipDetail = () => {
    setOrderSlipDetails([...orderSlipDetails, {
      id: '',
      order_slip_id: '',
      product_id: '',
      product_name: '',
      number: '',
      unit: '',
      unit_price: '',
      tax_rate: '',
      lot_number: '',
      storage_facility: '',
      stock: '',
      gross_profit: '',
      gross_margin_rate: '',
      created: '',
      updated: '',
    }]);
  }

  const removeOrderSlipDetail = (index) => {
    if (orderSlipDetails.length === 1) return;
    setOrderSlipDetails(orderSlipDetails.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    if (name === "product_id") {
      ipcRenderer.send('search-id-products', value);
    }

    if (name === "product_name") {
      ipcRenderer.send('search-name-products', value);
    }
    const updatedDetails = orderSlipDetails.map((detail, i) =>
      i === index ? { ...detail, [name]: value } : detail
    );
    setOrderSlipDetails(updatedDetails);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vender_id") {
      ipcRenderer.send('search-id-vendors', value);
    }

    if (name === "vender_name") {
      ipcRenderer.send('search-name-vendors', value);
    }
    setOrderSlip({ ...orderSlip, [name]: value });
  };

  const handleOnClick = (name, value) => {
    setOrderSlip({ ...orderSlip, [name]: value });
  };

  const handleOnDetailClick = (name, value, index) => {
    const updatedDetails = orderSlipDetails.map((detail, i) =>
      i === index ? { ...detail, [name]: value } : detail
    );
    setOrderSlipDetails(updatedDetails);
  };

  const validator = new Validator();

  const handleSubmit = () => {
    setErrors(null);
    validator.required(orderSlip.code, 'code', '伝票番号');
    validator.required(orderSlip.order_date, 'order_date', '受注日付');
    validator.required(orderSlip.vender_id, 'vender_id', '得意先コード');
    validator.required(orderSlip.vender_name, 'vender_name', '得意先名');
    for (let i = 0; i < orderSlipDetails.length; i++) {
      validator.required(orderSlipDetails[i].product_id, 'product_id' + i, '商品コード');
      validator.required(orderSlipDetails[i].product_name, 'product_name' + i, '商品名');
      validator.required(orderSlipDetails[i].number, 'number' + i, '数量');
      validator.required(orderSlipDetails[i].unit_price, 'unit_price' + i, '単価');
      validator.required(orderSlipDetails[i].tax_rate, 'tax_rate' + i, '税率');
      validator.required(orderSlipDetails[i].storage_facility, 'storage_facility' + i, '倉庫');
    }
    setErrors(validator.getErrors());

    if (!validator.hasErrors()) {

      ipcRenderer.send('save-order-slip', orderSlip);

      ipcRenderer.on('save-order-slip-result', (event, data) => {

        for (let i = 0; i < orderSlipDetails.length; i++) {
          const orderSlipDetailData = orderSlipDetails[i];
          orderSlipDetailData.order_slip_id = data.id;
          console.log(orderSlipDetailData);
          ipcRenderer.send('save-order-slip-detail', orderSlipDetailData);
          const inventoryData = {
            product_id: orderSlipDetailData.product_id,
            product_name: orderSlipDetailData.product_name,
            lot_number: orderSlipDetailData.lot_number,
            inventory: orderSlipDetailData.number,
            estimated_inventory: orderSlipDetailData.number,
            warning_value: orderSlipDetailData.threshold,
          }
          ipcRenderer.send('order-slips-inventory', inventoryData);
          const inventoryLogData = {
            product_id: orderSlipDetailData.product_id,
            product_name: orderSlipDetailData.product_name,
            lot_number: orderSlipDetailData.lot_number,
            number: orderSlipDetailData.number * (-1),
            action: "order slips",
            storage_facility_id: orderSlipDetailData.storage_facility,
          }
          ipcRenderer.send('save-inventory-log', inventoryLogData);
        }
      });
      setOrderSlip({
        code: '',
        order_id: '',
        order_date: '',
        delivery_date: '',
        vender_id: '',
        vender_name: '',
        honorific: '',
        vender_contact_person: '',
        estimation_slip_id: '',
        estimation_id: '',
        remarks: '',
        closing_date: '',
        deposit_due_date: '',
        deposit_method: '',
      });
      alert('新規登録が完了しました。');
    }
  };

  const handleSumPrice = () => {
    let SumPrice = 0
    let consumptionTaxEight = 0
    let consumptionTaxTen = 0

    for (let i = 0; i < orderSlipDetails.length; i++) {
      SumPrice += orderSlipDetails[i].unit_price * orderSlipDetails[i].number;
      if (orderSlipDetails[i].tax_rate === 8) {
        consumptionTaxEight += orderSlipDetails[i].unit_price * orderSlipDetails[i].number * 0.08;
      } else if (orderSlipDetails[i].tax_rate === 10) {
        consumptionTaxTen += orderSlipDetails[i].unit_price * orderSlipDetails[i].number * 0.1;
      }
    }

    return { "subtotal": SumPrice, "consumptionTaxEight": consumptionTaxEight, "consumptionTaxTen": consumptionTaxTen, "totalConsumptionTax": consumptionTaxEight + consumptionTaxTen, "Total": SumPrice + consumptionTaxEight + consumptionTaxTen }
  }


  const [isOpen, setIsOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (name) => {
    if (isOpen === name) return setIsOpen(null)
    setIsOpen(name);
  };

  const selectOption = (option, name, index) => {
    setSelectedOption(option);
    const updatedDetails = orderSlipDetails.map((detail, i) =>
      i === index ? { ...detail, [name]: option.value } : detail
    );
    setOrderSlipDetails(updatedDetails);
    setIsOpen(name);
  };

  const selectOrderSlipOption = (option, name) => {
    setSelectedOption(option);
    setOrderSlip({ ...orderSlip, [name]: option.value });
    setIsOpen(name);
  };

  const handleClickOutside = (event) => {
    // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //     setIsOpen(null);
    // }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateChange = (date, name) => {
    // 日付をフォーマットしてorderSlipにセット
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setOrderSlip({ ...orderSlip, [name]: formattedDate });
  };

  const handleProductClick = (product, index) => {
    const updatedDetails = orderSlipDetails.map((detail, i) =>
      i === index ? { ...detail, ["product_name"]: product.name, ["product_id"]: product.id, ["tax_rate"]: product.tax_rate, ["unit"]: product.unit, ["price"]: product.procurement_cost, ["threshold"]: product.threshold } : detail
    );
    setOrderSlipDetails(updatedDetails);
  }

  return (
    <div className='w-full'>
      <div className=''>
        <div className='pt-8 pb-6 flex border-b px-8 items-center'>
          <div className='text-2xl font-bold'>{'受注伝票の新規作成'}</div>
          <div className='flex ml-auto'>
            <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
              <div className='pr-1.5 pl-1 flex items-center'>
                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                  <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                </svg>
              </div>
              伝票設定
            </Link>
          </div>
        </div>
        <div className='px-8 py-6'>
          <div className='pb-2.5 font-bold text-xl'>伝票情報</div>
          <div className='pb-2'>
            <div className='w-40 text-sm pb-1.5'>伝票番号 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-[480px]' placeholder='' name="code" value={orderSlip.code} onChange={handleChange} />
            {errors.code && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.code}</div>}
          </div>
          <div className='pb-2'>
            <div className='flex items-center text-sm pb-1.5'>受注番号
              <a data-tooltip-id="my-tooltip" data-tooltip-content="先方からの発注書番号等を入力" className='flex ml-3'>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                </svg>
              </a>
              <Tooltip id="my-tooltip" />
            </div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-[480px]' placeholder='' name="order_id" value={orderSlip.order_id} onChange={handleChange} />
          </div>
          <div className='pb-2'>
            <div className='w-40 text-sm pb-1.5'>受注日付 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
            <input
              type='date'
              className='border rounded px-4 py-2.5 bg-white w-2/3'
              placeholder='適用開始日を入力'
              name="order_date"
              value={orderSlip["order_date"]}
              onChange={handleChange}
            />
            {errors.order_date && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.order_date}</div>}
          </div>
          <div className='pb-2'>
            <div className='flex items-center text-sm pb-1.5'>納品日付
              <a data-tooltip-id="my-tooltip" data-tooltip-content="納品日付ツールチップ 納品日付までの期間、在庫予定数が減り、在庫マスタ警告値に在庫予定数が到達すると在庫補充アラートが出る。" className='flex ml-3'>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                </svg>
              </a>
              <Tooltip id="my-tooltip" />
            </div>
            <input
              type='date'
              className='border rounded px-4 py-2.5 bg-white w-2/3'
              placeholder='適用開始日を入力'
              name="delivery_date"
              value={orderSlip["delivery_date"]}
              onChange={handleChange}
            />
            {/* <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="delivery_date" value={orderSlip.delivery_date} onChange={handleChange}/> */}
          </div>
          <div className='py-3'>
            <hr className='' />
          </div>
          <div className='py-2.5 font-bold text-xl'>取引先情報</div>
          <div className='pb-2'>
            <div className='flex'>
              <div className='relative'>
                <div className='w-40 text-sm pb-1.5'>得意先コード <span className='text-sm font-bold text-red-600'>必須</span></div>
                <input type='text' className='border rounded px-4 py-2.5 bg-white w-28' placeholder='' name="vender_id" value={orderSlip.vender_id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                {
                  isVendorIdFocused &&
                  <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                    <div className="relative inline-block">
                      <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                      <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                        <div className="flex flex-col space-y-2">
                          {
                            vendors.map((value, index) => (
                              <div className="p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={(e) => handleOnClick("vender_id", value.id)}>{value.name_primary}</div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

              </div>
              <div className='relative'>
                <div className='w-40 text-sm pb-1.5'>得意先名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                <input type='text' className='border rounded px-4 py-2.5 bg-white w-80' placeholder='' name="vender_name" value={orderSlip.vender_name} onChange={handleChange} onFocus={handleVendorNameFocus} onBlur={handleVendorNameBlur} />
                {
                  isVendorNameFocused &&
                  <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                    <div className="relative inline-block">
                      <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                      <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                        <div className="flex flex-col space-y-2">
                          {
                            vendors.map((value, index) => (
                              <div className="p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={(e) => handleOnClick("vender_name", value.name_primary)}>{value.name_primary}</div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className='ml-12'>
                <div className='text-sm pb-1.5 w-40'>宛名</div>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDropdown("honorific")}
                  >
                    <span>{orderSlip.honorific ? orderSlip.honorific : "宛名"}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${isOpen === "honorific" ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isOpen === "honorific" && (
                    <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                      {[{ label: "御中", value: "御中" }, { label: "貴社", value: "貴社" }].map((option) => (
                        <div
                          key={option.value}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={() => selectOrderSlipOption(option, "honorific")}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>                    {errors.vender_id && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.vender_id}</div>}
          {errors.vender_name && <div className="text-red-600 bg-red-100 py-1 px-4">{errors.vender_name}</div>}
          <div className='pb-2'>
            <div className='text-sm pb-1.5'>先方担当者</div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="vender_contact_person" value={orderSlip.vender_contact_person} onChange={handleChange} />
          </div>
          <div className='py-3'>
            <hr className='' />
          </div>
          <div className='py-2.5 font-bold text-xl'>見積伝票</div>
          <div className='pb-2'>
            <div className='text-sm pb-1.5'>見積伝票番号</div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="estimation_slip_id" value={orderSlip.estimation_slip_id} onChange={handleChange} />
          </div>
          <div className='pb-2'>
            <div className='text-sm pb-1.5'>見積番号</div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/3' placeholder='' name="estimation_id" value={orderSlip.estimation_id} onChange={handleChange} />
          </div>
          <div className='py-3'>
            <hr className='' />
          </div>
          <div className='py-2.5 font-bold text-xl'>明細</div>
          {
            orderSlipDetails.map((orderSlipDetail, index) => (
              <div>
                <div className='flex items-center'>
                  <div>
                    <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex' onClick={addOrderSlipDetail}>＋</div>
                  </div>
                  <div className=''>
                    <div className='flex items-center'>
                      <div className='relative'>
                        <div className='text-sm pb-1.5'>商品コード <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='number'
                          className='border rounded px-4 py-2.5 bg-white'
                          placeholder=''
                          name="product_id"
                          value={orderSlipDetail.product_id}
                          onChange={(e) => handleInputChange(index, e)}
                          style={{ width: "120px" }}
                          onFocus={(e) => handleProductIdFocus(index)}
                          onBlur={handleeProductIdBlur}
                        />
                        {
                          isProductIdFocused === index &&
                          <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                            <div className="relative inline-block">
                              <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                              <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                <div className="flex flex-col space-y-2">
                                  {
                                    products.map((product, idx) => (
                                      <div key={idx}
                                        className="p-2 hover:bg-gray-100 hover:cursor-pointer"
                                        onClick={(e) => handleProductClick(product, index)}
                                      >
                                        {product.name}
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className='ml-4 relative'>
                        <div className='text-sm pb-1.5'>商品名 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='text'
                          className='border rounded px-4 py-2.5 bg-white'
                          placeholder=''
                          name="product_name"
                          value={orderSlipDetail.product_name}
                          onChange={(e) => handleInputChange(index, e)}
                          style={{ width: "440px" }}
                          onFocus={(e) => handleProductNameFocus(index)}
                          onBlur={handleeProductNameBlur}
                        />
                        {
                          isProductNameFocused === index &&
                          <div className='absolute top-20 left-0 z-10' onMouseDown={(e) => e.preventDefault()}>
                            <div className="relative inline-block">
                              <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
                              <div className="bg-white shadow-lg rounded-lg p-4 w-60">
                                <div className="flex flex-col space-y-2">
                                  {
                                    products.map((product, idx) => (
                                      <div key={idx}
                                        className="p-2 hover:bg-gray-100 hover:cursor-pointer"
                                        onClick={(e) => handleProductClick(product, index)}
                                      >
                                        {product.name}
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>数量 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="number" value={orderSlipDetail.number} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>単位</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="unit" value={orderSlipDetail.unit} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>単価 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <input type='number' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="unit_price" value={orderSlipDetail.unit_price} onChange={(e) => handleInputChange(index, e)} style={{ width: "180px" }} />
                      </div>
                    </div>
                    {errors["product_id" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["product_id" + index]}</div>}
                    {errors["product_name" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["product_name" + index]}</div>}
                    {errors["number" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["number" + index]}</div>}
                    {errors["unit_price" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["unit_price" + index]}</div>}
                    <div className='flex items-center mt-4'>
                      <div className=''>
                        <div className='text-sm pb-1.5 w-40'>税率 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <div className="relative" ref={dropdownRef}>
                          <div
                            className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleDropdown("tax_rate" + index)}
                          >
                            <span>{orderSlipDetail.tax_rate ? orderSlipDetail.tax_rate + "%" : "税率"}</span>
                            <svg
                              className={`w-4 h-4 transform transition-transform ${isOpen === "tax_rate" + index ? 'rotate-180' : ''}`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {isOpen === "tax_rate" + index && (
                            <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                              {taxRateList.map((option) => (
                                <div
                                  key={option.value}
                                  className="cursor-pointer p-2 hover:bg-gray-100"
                                  onClick={() => selectOption(option, "tax_rate", index)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>ロット番号</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="lot_number" value={orderSlipDetail.lot_number} onChange={(e) => handleInputChange(index, e)} style={{ width: "120px" }} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5 w-40'>倉庫 <span className='text-sm font-bold text-red-600'>必須</span></div>
                        <div className="relative" ref={dropdownRef}>
                          <div
                            className="bg-white border rounded px-4 py-2.5 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleDropdown("storage_facility" + index)}
                          >
                            <span>{orderSlipDetail.storage_facility ? orderSlipDetail.storage_facility : "倉庫"}</span>
                            <svg
                              className={`w-4 h-4 transform transition-transform ${isOpen === "storage_facility" + index ? 'rotate-180' : ''}`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {isOpen === "storage_facility" + index && (
                            <div className="absolute z-10 mt-1 w-full bg-white border  rounded-md shadow-lg max-h-60 overflow-auto">
                              {storageFacilitiesList.map((option) => (
                                <div
                                  key={option.value}
                                  className="cursor-pointer p-2 hover:bg-gray-100"
                                  onClick={() => selectOption(option, "storage_facility", index)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>在庫数</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="stock" value={orderSlipDetail.stock} style={{ width: "180px" }} onChange={(e) => handleInputChange(index, e)} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>粗利益</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="gross_profit" value={orderSlipDetail.gross_profit} style={{ width: "180px" }} onChange={(e) => handleInputChange(index, e)} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm pb-1.5'>粗利率</div>
                        <input type='text' className='border rounded px-4 py-2.5 bg-white' placeholder='' name="gross_margin_rate" value={orderSlipDetail.gross_margin_rate} style={{ width: "180px" }} onChange={(e) => handleInputChange(index, e)} />
                      </div>
                    </div>
                    {errors["tax_rate" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["tax_rate" + index]}</div>}
                    {errors["storage_facility" + index] && <div className="text-red-600 bg-red-100 py-1 px-4">{errors["storage_facility" + index]}</div>}
                  </div>
                  <div className='ml-4'>
                    <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={(e) => removeOrderSlipDetail(index)}>
                      <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-end'>
                  <div className='flex items-center'>
                    <div className='mr-4'>消費税額</div>
                    <div className='mr-4'>{(orderSlipDetails[index].unit_price * orderSlipDetails[index].number * orderSlipDetail.tax_rate * 0.01).toFixed(0)}円</div>
                    <div className='mr-4'>金額</div>
                    <div className='text-lg font-bold'>{(orderSlipDetails[index].unit_price * orderSlipDetails[index].number * (1 + orderSlipDetail.tax_rate * 0.01)).toFixed(0)}円</div>
                  </div>
                </div>
                <hr className='py-3' />
              </div>
            ))
          }
          <div className='py-6 flex'>
            <div className='ml-auto rounded px-10 py-8 bg-gray-100'>
              <div className='flex pb-2'>
                <div className='w-40'>税抜合計</div>
                <div>{handleSumPrice().subtotal.toFixed(0).toLocaleString()}円</div>
              </div>
              <div className='flex pb-2'>
                <div className='w-40'>消費税(8%)</div>
                <div>{handleSumPrice().consumptionTaxEight.toFixed(0).toLocaleString()}円</div>
              </div>
              <div className='flex pb-2'>
                <div className='w-40'>消費税(10%)</div>
                <div>{handleSumPrice().consumptionTaxTen.toFixed(0).toLocaleString()}円</div>
              </div>
              <div className='flex pb-2'>
                <div className='w-40'>消費税合計</div>
                <div>{handleSumPrice().totalConsumptionTax.toFixed(0).toLocaleString()}円</div>
              </div>
              <div className='flex'>
                <div className='w-40'>税込合計</div>
                <div>{handleSumPrice().Total.toFixed(0).toLocaleString()}円</div>
              </div>
            </div>
          </div>

          <div className='py-3'>
            <hr className='' />
          </div>
          <div className='py-2.5 font-bold text-xl'>備考</div>
          <div className='pb-2'>
            <textarea className='border rounded px-4 py-2.5 bg-white w-full resize-none' placeholder='' rows={5} name="remarks" value={orderSlip.remarks} onChange={handleChange}></textarea>
          </div>
          <div className='py-3'>
            <hr className='' />
          </div>
          <div className='py-2.5 font-bold text-xl'>請求情報</div>
          <div className='pb-2'>
            <div className='w-40 text-sm pb-1.5'>締日</div>
            <input
              type='date'
              className='border rounded px-4 py-2.5 bg-white w-2/3'
              placeholder='適用開始日を入力'
              name="closing_date"
              value={orderSlip["closing_date"]}
              onChange={handleChange}
            />
          </div>
          <div className='pb-2'>
            <div className='w-40 text-sm pb-1.5'>入金期日</div>
            <input
              type='date'
              className='border rounded px-4 py-2.5 bg-white w-2/3'
              placeholder='適用開始日を入力'
              name="deposit_due_date"
              value={orderSlip["deposit_due_date"]}
              onChange={handleChange}
            />
          </div>
          <div className='pb-2 mb-24'>
            <div className='w-40 text-sm pb-1.5'>入金方法</div>
            <input type='text' className='border rounded px-4 py-2.5 bg-white w-[480px]' placeholder='' name="deposit_method" value={orderSlip.deposit_method} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
        <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>新規登録</div>
        <Link to={`/sales-management/voucher-entries/order-slips`} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</Link>
      </div>
    </div>
  );
}

export default OrderSlipsAdd;

