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
    "delivery_customer": "",
  });


  const handleDateChange = (date, name) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setSearchQueryList({ ...searchQueryList, [name]: formattedDate });
  };


  const generatePDF = async () => {

    const html_content = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>請求書</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .header, .client-info, .summary, .footer {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .address {
            font-size: 14px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th, .table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 14px;
        }
        .right-align {
            text-align: right;
        }
        .total-section {
            text-align: right;
            margin-top: 20px;
            font-size: 16px;
        }
    </style>
</head>
<body>

    <h1>請求書</h1>

    <!-- Header Section -->
    <div class="header">
        <div>
            <div class="section-title">請求先</div>
            <div>株式会社A</div>
            <div class="address">
                〒100-0001<br>
                東京都千代田区千代田1-1 サンプルビル1F
            </div>
            <p>下記の通り、ご請求申し上げます。</p>
        </div>
        <div>
            <div>請求番号　INV-2023001</div>
            <div>発行日　2023年5月31日</div>
            <div>お支払期限　2023年6月30日</div>
            <br>
            <div>株式会社Smart_SmS</div>
            <div class="address">
                〒150-0002<br>
                東京都渋谷区渋谷2-2スマートビル3F<br>
                TEL 03-1234-5678
            </div>
        </div>
    </div>

    <!-- Detail Section -->
    <div class="section-title">納品先A</div>
    <table class="table">
        <thead>
            <tr>
                <th>日付</th>
                <th>伝票番号</th>
                <th>商品名</th>
                <th>数量</th>
                <th>単価</th>
                <th>金額</th>
                <th>税率</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2023/05/01</td>
                <td>INV-001</td>
                <td>商品A</td>
                <td>2</td>
                <td>¥5,000</td>
                <td>¥10,000</td>
                <td>8%</td>
            </tr>
            <tr>
                <td>2023/05/01</td>
                <td>INV-002</td>
                <td>商品B</td>
                <td>2</td>
                <td>¥5,000</td>
                <td>¥10,000</td>
                <td>10%</td>
            </tr>
        </tbody>
    </table>
    <div class="total-section">小計 ¥25,000</div>

    <div class="section-title">納品先B</div>
    <table class="table">
        <thead>
            <tr>
                <th>日付</th>
                <th>伝票番号</th>
                <th>商品名</th>
                <th>数量</th>
                <th>単価</th>
                <th>金額</th>
                <th>税率</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2023/05/01</td>
                <td>INV-001</td>
                <td>商品A</td>
                <td>2</td>
                <td>¥5,000</td>
                <td>¥10,000</td>
                <td>8%</td>
            </tr>
            <tr>
                <td>2023/05/01</td>
                <td>INV-002</td>
                <td>商品B</td>
                <td>2</td>
                <td>¥5,000</td>
                <td>¥10,000</td>
                <td>10%</td>
            </tr>
        </tbody>
    </table>
    <div class="total-section">小計 ¥149,000</div>

    <!-- Summary Section -->
    <div class="summary">
        <div class="right-align">
            <p>税抜合計　¥5,000</p>
            <p>消費税(8%)　¥500</p>
            <p>消費税(10%)　¥500</p>
            <p>消費税合計　¥1,000</p>
            <p>税込合計　¥5,500</p>
        </div>
    </div>

    <!-- Final Total Section -->
    <div class="total-section">
        <strong>合計金額(税込)　¥190,700</strong>
    </div>

</body>
</html>
`;


    try {
      const filePath = await ipcRenderer.invoke('generate-pdf', html_content);
      alert(`PDFが作成されました: ${filePath}`);
    } catch (error) {
      console.error('PDF生成エラー:', error);
    }
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
              <div className='w-40 text-sm pb-1.5'>得意先 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
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
              <div className='w-40 text-sm pb-1.5'>締日 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
              <DatePicker
                selected={searchQueryList["os.closing_date"] ? new Date(searchQueryList["os.closing_date"]) : null}
                onChange={(date) => handleDateChange(date, "os.closing_date")}
                dateFormat="yyyy-MM-dd"
                className='border rounded px-4 py-2.5 bg-white  w-full'
                placeholderText='締日'
              />
            </div>
          </div>
          <div className='flex'>
            <div className='pb-2'>
              <div className='w-40 text-sm pb-1.5'>納品先 <span className='text-xs ml-2.5 font-bold text-red-600'>必須</span></div>
              <input
                type='text'
                className='border rounded px-4 py-2.5 bg-white w-full'
                placeholder='納品先'
                name="delivery_customer"
                value={searchQueryList["delivery_customer"]}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
        <Link
          to={{
            pathname: "/invoice-export",
            search: `?closing_date=${searchQueryList["os.closing_date"]}&vender_name=${searchQueryList["os.vender_name"]}&delivery_customer=${searchQueryList["delivery_customer"]}`
          }}
          className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' >請求計算</Link>
        <div onClick={() => navigate(-1)} className='border rounded px-4 py-3 font-bold cursor-pointer'>キャンセル</div>
      </div>
    </div>
  );
}

export default ProcessRegistrationIndex;