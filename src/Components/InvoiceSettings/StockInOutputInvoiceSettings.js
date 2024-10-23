// src/Components/InvoiceSettings.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from '../CustomSelect';
import { Tooltip } from 'react-tooltip'
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';

function StockInOutputInvoiceSettings() {
  const options = [
    { value: '御中', label: '御中' },
    { value: '貴社', label: '貴社' },
  ];

  const navigate = useNavigate();

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

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <div className='w-full'>
      <div className='flex mx-40 mt-10 mb-12'>
        <div className='flex-col max-w-[420px]'>
          <div className='flex mr-auto'>
            <div className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex' onClick={() => navigate(-1)}>
              <div className='pr-1.5 pl-1 flex items-center'>
              <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
              </div>
              戻る
            </div>
          </div>
          <div className='mt-6'>
            <div className='text-3xl font-bold text-black'>伝票設定</div>
          </div>
          <div>
            <div className='mt-12'>
              <div className='text-sm pb-1.5'>プリンター設定</div>
              <CustomSelect placeholder={""} options={options} name={"honorific"} data={customer} setData={setCustomer} />
            </div>
            <div className='py-4'>
              <hr className='' />
            </div>
            <div className='flex-col'>
              <div className='text-sm pb-1.5'>印刷の余白調整</div>
              <div className='mt-2.5 flex'>
                <label className='text-base'>
                  <input type="radio" name="processType" value="type1" className='mr-2' />標準
                </label>
                <label className='text-base ml-10'>
                  <input type="radio" name="processType" value="type2" className='mr-2' />狭い
                </label>
                <label className='text-base ml-10'>
                  <input type="radio" name="processType" value="type3" className='mr-2' />広い
                </label>
              </div>
            </div>
            <div className='py-4'>
              <hr className='' />
            </div>
            <div className='flex items-center'>
              <div className='text-sm text-black'>伝票を新規作成時に印刷する</div>
              <div className='ml-auto'>
                <Switch {...label} />
              </div>
            </div>
            <div className='flex mr-auto mt-12 '>
              <div className='mr-6'>
                <Link to="/document-settings" className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                  PDF出力
                </Link>
              </div>
              <div className='ml-12'>
                <Link to="/document-settings" className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                  プレビュー生成
                </Link>
              </div>
              <div className='ml-6'>
                <Link to="/document-settings" className='py-3 px-4 border rounded-lg text-base font-bold text-white bg-blue-600 flex'>
                  印刷
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='ml-auto mb-12 w-[548px] h-[754px]'>
          <div className='bg-white border border-black w-full h-full pl-4 pr-9 py-5'>
            <div className='text-base font-bold text-black ml-1'>仕入名</div>
            <div className='py-3.5'>
              <hr className='border-black' />
            </div>
            <div className='h-[216px]' />
            <div className='text-base font-bold text-black ml-1'>明細</div>
            <div className='py-3.5'>
              <hr className='border-black' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockInOutputInvoiceSettings;