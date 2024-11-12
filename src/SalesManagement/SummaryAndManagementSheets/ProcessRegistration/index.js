import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import CustomSelect from '../../../Components/CustomSelect';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';

const { ipcRenderer } = window.require('electron');

function ProcessRegistrationIndex() {
  const options = [
    { value: '御中', label: '御中' },
    { value: '貴社', label: '貴社' },
  ];

  const navigate = useNavigate();

  const [searchQueryList, setSearchQueryList] = useState({
    "os.vender_name": "",
    "os.closing_date": "",
  });


  const handleDateChange = (date, name) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQueryList((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='w-full'>
      <div className=''>
        <div className='pt-8 pb-6 flex border-b px-8 items-center'>
          <div className='text-3xl font-bold'>{'請求処理'}</div>
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
          <div className='flex items-center pb-2'>
            <div>
              <div className='text-sm pb-1.5'>請求期間 <span className='text-xs font-bold ml-1 text-red-600'>必須</span></div>
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
              <div className='text-sm pb-1.5 text-white'>期間指定</div>
              <DatePicker
                selected={searchQueryList["osd.created_end"] ? new Date(searchQueryList["osd.created_end"]) : null}
                onChange={(date) => handleDateChange(date, "osd.created_end")}
                dateFormat="yyyy-MM-dd"
                className='border rounded px-4 py-2.5 bg-white  w-full'
                placeholderText='期間を選択'
              />
            </div>
          </div>
          <div className='flex'>
            <div className='pb-2 mr-8'>
              <div className='w-40 text-sm pb-1.5'>得意先</div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='得意先'
                name="os.vender_name"
                value={searchQueryList["os.vender_name"]}
                onChange={handleInputChange}
              />
            </div>
            <div className='pb-2'>
              <div className='w-40 text-sm pb-1.5'>締日</div>
              <DatePicker
                selected={searchQueryList["os.closing_date"] ? new Date(searchQueryList["os.closing_date"]) : null}
                onChange={(date) => handleDateChange(date, "os.closing_date")}
                dateFormat="yyyy-MM-dd"
                className='border rounded px-4 py-2.5 bg-white  w-full'
                placeholderText='締日'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
        <Link
          to={{
            pathname: "/invoice-export",
            search: `?closing_date=${searchQueryList["os.closing_date"]}&vender_name=${searchQueryList["os.vender_name"]}`
          }}
          className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' >請求計算</Link>
        <div onClick={() => navigate(-1)} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</div>
      </div>
    </div>
  );
}

export default ProcessRegistrationIndex;