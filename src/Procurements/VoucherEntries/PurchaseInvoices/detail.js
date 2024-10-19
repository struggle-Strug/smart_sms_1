import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function PurchaseInvoicesDetail() {

    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        console.log(id)
        ipcRenderer.send('get-purchase-invoice-detail', id);
        ipcRenderer.on('purchase-invoice-detail-data', (event, data) => {
            setInvoice(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('purchase-invoice-detail-data');
        };
    }, [id]);

    if (!invoice) {
        return <div>Loading...</div>;
    }


    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>支払伝票</div>
                    <div className='flex ml-auto'>
                        <Link to={`/purchase-invoices/edit/${id}`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.391357 18.7308H4.14136L15.2014 7.67077L11.4514 3.92077L0.391357 14.9808V18.7308ZM2.39136 15.8108L11.4514 6.75077L12.3714 7.67077L3.31136 16.7308H2.39136V15.8108Z" fill="#1F2937" />
                                    <path d="M15.7614 1.02077C15.3714 0.630771 14.7414 0.630771 14.3514 1.02077L12.5214 2.85077L16.2714 6.60077L18.1014 4.77077C18.4914 4.38077 18.4914 3.75077 18.1014 3.36077L15.7614 1.02077Z" fill="#1F2937" />
                                </svg>
                            </div>
                            編集
                        </Link>
                        <Link to={`/purchase-invoices/print/${id}`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                                    <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                                </svg>
                            </div>
                            印刷
                        </Link>
                        <Link to={`/purchase-invoices/delete/${id}`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
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
                    <div className='py-2.5 font-bold text-xl'>伝票番号</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>伝票番号</div>
                        <div>{invoice.id || "N/A"}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>支払日付</div>
                        <div>{invoice.order_date || "N/A"}</div>
                    </div>
                    <div className='py-3'>
                        <hr />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>取引先情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>宛名</div>
                        <div>{invoice.vender_name || "N/A"}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>仕入先コード</div>
                        <div>{invoice.vender_id || "N/A"}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>郵便番号</div>
                        <div>{invoice.postal_code || "N/A"}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>市区町村・番地</div>
                        <div>{invoice.address || "N/A"}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>担当者</div>
                        <div>{invoice.contact_person || "N/A"}</div>
                    </div>
                    <div className='py-3'>
                        <hr />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>支払方法</div>
                    <table className="w-full mt-8 table-auto">
                        <thead>
                            <tr className='border-b'>
                                <th className='text-left py-2'>支払方法</th>
                                <th className='text-left py-2 w-72'>支払金額</th>
                                <th className='text-left py-2'>手数料等</th>
                                <th className='text-left py-2'>合計金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border-b'>
                                <td className='py-2'>{invoice.payment_method || "N/A"}</td>
                                <td className='py-2'>{invoice.payment_amount || "0円"}</td>
                                <td className='py-2'>{invoice.fees_and_charges || "0円"}</td>
                                <td className='py-2'>{invoice.total_amount || "0円"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='py-3'>
                        <hr />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='flex items-center pb-2'>
                        {invoice.remarks || "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PurchaseInvoicesDetail;
