// src/Components/InvoiceSettings.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from '../CustomSelect';
import { Tooltip } from 'react-tooltip'
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';

function InvoiceSettings() {
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
                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                  <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
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
            <div className='pt-4 pb-2'>
              <hr className='' />
            </div>
            <div className='flex items-center'>
              <div className='text-sm text-black'>伝票を新規作成時に印刷する</div>
              <div className='ml-auto'>
                <Switch {...label} />
              </div>
            </div>
            <div className='pt-2 pb-4'>
              <hr className='' />
            </div>
            <div className=''>
              <div className='flex items-center text-sm pb-1.5'>倉庫選択
                <a data-tooltip-id="my-tooltip" data-tooltip-content="得意先名の続き、支店名、部署名等" className='flex ml-3'>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.47315 4.57084H10.1398V6.23751H8.47315V4.57084ZM8.47315 7.90418H10.1398V12.9042H8.47315V7.90418ZM9.30648 0.404175C4.70648 0.404175 0.973145 4.13751 0.973145 8.73751C0.973145 13.3375 4.70648 17.0708 9.30648 17.0708C13.9065 17.0708 17.6398 13.3375 17.6398 8.73751C17.6398 4.13751 13.9065 0.404175 9.30648 0.404175ZM9.30648 15.4042C5.63148 15.4042 2.63981 12.4125 2.63981 8.73751C2.63981 5.06251 5.63148 2.07084 9.30648 2.07084C12.9815 2.07084 15.9731 5.06251 15.9731 8.73751C15.9731 12.4125 12.9815 15.4042 9.30648 15.4042Z" fill="#1F2937" />
                  </svg>
                </a>
                <Tooltip id="my-tooltip" />
              </div>
              <div className="w-full">
                <CustomSelect placeholder={"倉庫を選んでください"} options={options} name={"honorific"} data={customer} setData={setCustomer} />
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

export default InvoiceSettings;
