// src/Components/InvoiceSettings.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from '../CustomSelect';
import { Tooltip } from 'react-tooltip'
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { ipcRenderer } = window.require('electron');

function InvoiceExportSettings() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const venderName = params.get('vender_name');
    const closingDate = params.get('closing_date');
    const deliveryCustomer = params.get('delivery_customer');

    const [company, setCompany] = useState({});
    const [orderSlips, setOrderSlips] = useState([]);


    const [htmlContent, setHtmlContent] = useState('');

    const [searchQueryList, setSearchQueryList] = useState({
        "os.vender_name": venderName,
        "os.closing_date": closingDate,
    });

    useEffect(() => {
        const handleSearchResult = (event, data) => {
            setOrderSlips(data);
        };

        ipcRenderer.send('load-companies');
        ipcRenderer.on('load-companies', (event, data) => {
          console.log(data)
          if (data.length === 0) return;
          setCompany(data[0]);
        });

        const searchColums = {}
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }

        ipcRenderer.send('search-order-slip-details', searchColums);
        ipcRenderer.on('search-order-slip-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('search-order-slip-details', handleSearchResult);
            ipcRenderer.removeAllListeners('load-companies');
        }
    }, []);

    useEffect(() => {
        setHtmlContent(createHtmlContent());
      }, [orderSlips, company]);

    const handleSumPrice = (data) => {
        let SumPrice = 0
        let consumptionTaxEight = 0
        let consumptionTaxTen = 0

        for (let i = 0; i < data.length; i++) {
            SumPrice += data[i].unit_price * data[i].number;
            if (data[i].tax_rate === 8) {
                consumptionTaxEight += data[i].price * data[i].number * 0.08;
            } else if (data[i].tax_rate === 10) {
                consumptionTaxTen += data[i].price * data[i].number * 0.1;
            }
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": consumptionTaxEight, "consumptionTaxTen": consumptionTaxTen, "totalConsumptionTax": consumptionTaxTen, "Total": SumPrice + consumptionTaxEight + consumptionTaxTen}
    }

    function getTodayDateTimeCode() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 月を2桁にゼロ埋め
        const day = String(today.getDate()).padStart(2, '0'); // 日を2桁にゼロ埋め
        const hours = String(today.getHours()).padStart(2, '0'); // 時間を2桁にゼロ埋め
        const minutes = String(today.getMinutes()).padStart(2, '0'); // 分を2桁にゼロ埋め
        const seconds = String(today.getSeconds()).padStart(2, '0'); // 秒を2桁にゼロ埋め
    
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }    


    const createHtmlContent = () => {
        let html_content = ``
        const html_content_header = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <title>請求書</title>
        <style>
            .invoice {
                font-family: Arial, sans-serif;
                padding: 40px;
                width: 793px;
                height: 1123px;
            }
            h1 {
                font-size: 28px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .header, .client-info, .footer {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
             .summary {
                display: flex;
                justify-content: end;
                margin-bottom: 20px;
                font-size: 16px;
             }
            .header {
                font-size: 22px;
                font-weight: bold;
            }
            .section-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .address {
                font-size: 16px;
                font-weight: normal;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 16px;
                font-wight: normal;
                border: 1px solid #000;
            }
            .table th, .table td {
                border-bottom: 1px solid #000;
                padding: 8px;
                text-align: center;
                font-size: 16px;
                font-wight: normal;
            }
            .right-align {
                text-align: right;
            }
            .total-section {
                text-align: right;
                margin-top: 20px;
                font-size: 20px;
            }

            .section-header {
                font-size: 18px;
                font-weight: bold;
            }

            .section-content {
                font-size: 18px;
                font-weight: normal;
            }
        </style>
    </head>
    <body class="invoice">
    
        <h1>請求書</h1>
    
        <!-- Header Section -->
        <div class="header">
            <div>
                <div class="section-title">請求先</div>
                <div class="section-header">株式会社A</div>
                <div class="address">
                    〒100-0001<br>
                    東京都千代田区千代田1-1 サンプルビル1F
                </div>
            </div>
            <div>
                <div class="section-content">請求番号　INV-2023001</div>
                <div class="section-content">発行日　2023年5月31日</div>
                <div class="section-content">お支払期限　2023年6月30日</div>
                <br>
                <div class="section-content">${company?.name}</div>
                <div class="address">
                    〒${company?.zip_code}<br>
                    ${company?.address}<br>
                    TEL ${company?.phone_number}
                </div>
            </div>
        </div>
         <p class="section-content">下記の通り、ご請求申し上げます。</p>
    `

        html_content += html_content_header;

        html_content += `
    <div class="section-title">納品先A</div>
        <table class="table">
            <thead>
                <tr style="background-color: #F3F4F6">
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
    `

        for (let i = 0; i < orderSlips.length; i++) {
            const html_content_table = `
      <tr>
                    <td>${dayjs(orderSlips[i].delivery_date).format("YYYY/MM/DD")}</td>
                    <td>INV-001</td>
                    <td>${orderSlips[i].product_name}</td>
                    <td>${orderSlips[i].number}</td>
                    <td>¥${orderSlips[i].unit_price.toLocaleString()}</td>
                    <td>¥${(parseInt(orderSlips[i].unit_price)*parseInt(orderSlips[i].number)).toLocaleString()}</td>
                    <td>${orderSlips[i].tax_rate}%</td>
                </tr>
    `
            html_content += html_content_table;
        }

        const html_content_footer = `
            </tbody>
        </table>
        <div class="total-section">小計 ¥${handleSumPrice(orderSlips).Total.toFixed(0).toLocaleString()}</div>
    
        <!-- Summary Section -->
        <div class="summary">
            <div class="right-align">
                <p>税抜合計　¥${handleSumPrice(orderSlips).subtotal.toFixed(0).toLocaleString()}</p>
                <p>消費税(8%)　¥${handleSumPrice(orderSlips).consumptionTaxEight.toFixed(0).toLocaleString()}</p>
                <p>消費税(10%)　¥${handleSumPrice(orderSlips).consumptionTaxTen.toFixed(0).toLocaleString()}</p>
                <p>消費税合計　¥${handleSumPrice(orderSlips).totalConsumptionTax.toFixed(0).toLocaleString()}</p>
                <p>税込合計　¥${handleSumPrice(orderSlips).Total.toFixed(0).toLocaleString()}</p>
            </div>
        </div>
    
        <!-- Final Total Section -->
        <div class="total-section">
            <strong>合計金額(税込)　¥${handleSumPrice(orderSlips).Total.toFixed(0).toLocaleString()}</strong>
        </div>
    
    </body>
    </html>
    `;
        html_content += html_content_footer;


        return html_content
    }

    const navigate = useNavigate();

    const componentRef = useRef();
    const reactToPrintFn = useReactToPrint({ componentRef });

    const generatePDF = async () => {

        try {
            const filePath = await ipcRenderer.invoke('generate-pdf', htmlContent);
            alert(`PDFが作成されました: ${filePath}`);
        } catch (error) {
            console.error('PDF生成エラー:', error);
        }
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
                        <div className='text-3xl font-bold text-black'>請求書設定</div>
                    </div>
                    <div>
                        <div className='mt-12'>
                            <div className='text-sm pb-1.5'>プリンター設定</div>
                            <CustomSelect placeholder={""} options={options} name={"honorific"} data={customer} setData={setCustomer} />
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
                        <div className='flex mr-auto mt-12 '>
                            <div className='mr-6'>
                                <div className='py-3 px-4 border rounded-lg text-base font-bold flex hover:cursor-pointer hover:bg-gray-100' onClick={() => generatePDF()}>
                                    PDF出力
                                </div>
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
                <div className='ml-auto mb-12 border p-5 rounded w-[640px] h-[960px]'>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
            </div>
        </div>
    );
}

export default InvoiceExportSettings;


