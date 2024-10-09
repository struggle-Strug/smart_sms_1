// src/Components/InvoiceSettings.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import { Tooltip } from 'react-tooltip'

function InvoiceSettings() {
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
    return (
      <div className='w-full'>
        <div className='flex ml-40 mt-10 flex-col'>
        <div className='flex mr-auto'>
                        <Link to="/document-settings" className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                                    <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                                </svg>
                            </div>
                            戻る
                        </Link>
                    </div>
        <div className='mt-6'>
          <div className='text-3xl font-bold text-black'>伝票設定</div>
        </div>
        <div>
        <div className='mt-12'>
        <div className='text-sm pb-1.5'>プリンター設定</div>
          <CustomSelect options={options} name={"honorific"} data={customer} setData={setCustomer} />
        </div>
        <div className='py-4'>
          <hr className='' />
        </div>
        <div className='flex-col'>
                        <div className='text-sm pb-1.5'>印刷の余白調整</div>
                        <div className='my-2.5 flex'>
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
        <div>
          <div className='text-base text-black'>伝票を新規作成時に印刷する</div>
        </div>
        <div className='py-4'>
          <hr className='' />
        </div>
        </div>
        </div>
      </div>
    );
}

export default InvoiceSettings;
