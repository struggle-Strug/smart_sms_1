import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function SalesOrderSlipsDetail() {
    const [orderSlip, setOrderSlip] = useState({
        id: '',
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

    const { id } = useParams();

    useEffect(() => {
        ipcRenderer.send('get-order-slip-detail', id);
        ipcRenderer.on('order-slip-detail-data', (event, data) => {
            setOrderSlip(data);
        });

        ipcRenderer.send('search-order-slip-details-by-vender-id', id);

        
        ipcRenderer.on('search-order-slip-details-by-vender-id-result', (event, data) => {
            setOrderSlipDetails(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('order-slip-data');
            ipcRenderer.removeAllListeners('search-order-slip-details-by-vender-id');
        };
    }, [id]);

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
            created: '',
            updated: '',
        }
    ]);

    const handleSumPrice = () => {
        let SumPrice = 0

        for (let i = 0; i < orderSlipDetails.length; i++) {
            SumPrice += orderSlipDetails[i].unit_price * orderSlipDetails[i].number;
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": SumPrice * 0.08, "consumptionTaxTen": 0, "totalConsumptionTax": SumPrice * 0.08, "Total": SumPrice * 1.08 }
    }


    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>受注伝票</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className=''>
                                    <path d="M0.391357 18.7308H4.14136L15.2014 7.67077L11.4514 3.92077L0.391357 14.9808V18.7308ZM2.39136 15.8108L11.4514 6.75077L12.3714 7.67077L3.31136 16.7308H2.39136V15.8108Z" fill="#1F2937" />
                                    <path d="M15.7614 1.02077C15.3714 0.630771 14.7414 0.630771 14.3514 1.02077L12.5214 2.85077L16.2714 6.60077L18.1014 4.77077C18.4914 4.38077 18.4914 3.75077 18.1014 3.36077L15.7614 1.02077Z" fill="#1F2937" />
                                </svg>
                            </div>
                            編集
                        </Link>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                                    <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                                </svg>
                            </div>
                            印刷
                        </Link>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                </svg>
                            </div>
                            削除
                        </Link>
                    </div>
                </div>
                <div className='px-8 py-6'>
                    <div className='py-2.5 font-bold text-xl'>伝票情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>伝票番号</div>
                        <div>{orderSlip.code}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>受注日付</div>
                        <div>{orderSlip.order_date}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>納品日付</div>
                        <div>{orderSlip.delivery_date}</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>取引先情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>宛名</div>
                        <div>{orderSlip.vender_name}御中</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>得意先コード</div>
                        <div>{orderSlip.vender_id}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>郵便番号</div>
                        <div>1040031(Temp)</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>市区町村・番地</div>
                        <div>東京都中央区銀座6丁目10-1建物名・部屋番号などGINZA SIX 13階(TEMP)</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>担当者</div>
                        <div>{orderSlip.vender_contact_person}</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>自社情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>自社名</div>
                        <div></div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>担当者名</div>
                        <div></div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>電話番号</div>
                        <div>(Temp)</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>見積伝票</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>見積伝票番号</div>
                        <div>{orderSlip.estimation_slip_id}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>見積番号</div>
                        <div>{orderSlip.estimation_id}</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    <table className="w-full mt-8 table-auto">
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left py-2'>商品コード</th>
                                <th className='text-left py-2'>商品名</th>
                                <th className='text-left py-2 w-72'>数量</th>
                                <th className='text-left py-2 w-72'>単位</th>
                                <th className='text-left py-2 w-72'>ロット番号</th>
                                <th className='text-left py-2 w-72'>受注残数</th>
                                <th className='text-left py-2 w-72'>単価</th>
                                <th className='text-left py-2 w-72'>粗利益</th>
                                <th className='text-left py-2 w-72'>粗利率</th>
                                <th className='text-left py-2 w-72'>税率</th>
                                <th className='text-left py-2 w-72'>倉庫</th>
                                <th className='text-left py-2 w-72'>金額</th>
                                <th className='text-left py-2'>税額</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                        orderSlipDetails.map((orderSlipDetail, index) => (
                            <tr className='border-b' key={index}>
                                <td className='py-2'>{orderSlipDetail.product_id}</td>
                                <td className='py-2'>{orderSlipDetail.product_name}</td>
                                <td className='py-2'>{orderSlipDetail.number}</td>
                                <td className='py-2'>{orderSlipDetail.unit}</td>
                                <td className='py-2'>{orderSlipDetail.lot_number}</td>
                                <td className='py-2'>{"発注残数??"}</td>
                                <td className='py-2'>{orderSlipDetail.unit_price}</td>
                                <td className='py-2'>{orderSlipDetail.gross_profit}%</td>
                                <td className='py-2'>{orderSlipDetail.gross_margin_rate}</td>
                                <td className='py-2'>{orderSlipDetail.tax_rate}</td>
                                <td className='py-2'>{orderSlipDetail.storage_facility}</td>
                                <td className='py-2'>{parseInt(orderSlipDetail.unit_price) * parseInt(orderSlipDetail.number)}円</td>
                                <td className='py-2'>{parseInt(orderSlipDetail.unit_price) * parseInt(orderSlipDetail.number) * parseInt(orderSlipDetail.tax_rate)}円</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                    <div className='flex items-center pb-2'>
                    {orderSlip.remarks}
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>支払い情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>ステータス</div>
                        <div>????????????</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>入金期日</div>
                        <div>{orderSlip.deposit_due_date}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>入金方法</div>
                        <div>{orderSlip.deposit_method}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesOrderSlipsDetail;
