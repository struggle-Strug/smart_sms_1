import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ConfirmDialog from '../../../Components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function StockInOutSlipsDetail() {
    const { id } = useParams();
    const [stockInOutSlip, setStockInOutSlip] = useState({
        id: '',
        stock_in_out_date: '',
        processType: '',
        warehouse_from: '',
        warehouse_to: '',
        contact_person: '',
        remarks: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState('');

    const navigate = useNavigate();

    const [stockInOutSlipDetails, setStockInOutSlipDetails] = useState([
        {
            id: '',
            stock_in_out_slip_id: '',
            product_id: '',
            product_name: '',
            number: '',
            unit: '',
            price: '',
            lot_number: '',
        }
    ]);

    useEffect(() => {
        ipcRenderer.send('get-stock-in-out-slip-data', id);
        ipcRenderer.on('stock-in-out-slip-data-result', (event, data) => {
            setStockInOutSlip(data);
        });

        ipcRenderer.send('search-stock-in-out-slip-details-by-slip-id', id);

        ipcRenderer.on('search-stock-in-out-slip-details-by-slip-id-result', (event, data) => {
            setStockInOutSlipDetails(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('get-stock-in-out-slip-data');
            ipcRenderer.removeAllListeners('search-stock-in-out-slip-details-by-slip-id');
        };
    }, [id]);

    const handleDelete = (id, name) => {
        setCustomerIdToDelete(id);
        setMessageToDelete(name);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-stock-in-out-slip', customerIdToDelete);

        setIsDialogOpen(false);
        navigate("/procurement/voucher-entries/stock-in-out-slips");
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'>{stockInOutSlip.vender_name || ''}</div>
                    <div className='flex ml-auto'>
                        <Link to={`/procurement/voucher-entries/stock-in-out-slips/edit/` + id}  className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.391357 18.7308H4.14136L15.2014 7.67077L11.4514 3.92077L0.391357 14.9808V18.7308ZM2.39136 15.8108L11.4514 6.75077L12.3714 7.67077L3.31136 16.7308H2.39136V15.8108Z" fill="#1F2937" />
                                    <path d="M15.7614 1.02077C15.3714 0.630771 14.7414 0.630771 14.3514 1.02077L12.5214 2.85077L16.2714 6.60077L18.1014 4.77077C18.4914 4.38077 18.4914 3.75077 18.1014 3.36077L15.7614 1.02077Z" fill="#1F2937" />
                                </svg>
                            </div>
                            編集
                        </Link>
                        <Link to={`/invoice-settings`} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3926 5.72949H16.3926V0.729492H4.39258V5.72949H3.39258C1.73258 5.72949 0.392578 7.06949 0.392578 8.72949V14.7295H4.39258V18.7295H16.3926V14.7295H20.3926V8.72949C20.3926 7.06949 19.0526 5.72949 17.3926 5.72949ZM6.39258 2.72949H14.3926V5.72949H6.39258V2.72949ZM14.3926 16.7295H6.39258V12.7295H14.3926V16.7295ZM16.3926 12.7295V10.7295H4.39258V12.7295H2.39258V8.72949C2.39258 8.17949 2.84258 7.72949 3.39258 7.72949H17.3926C17.9426 7.72949 18.3926 8.17949 18.3926 8.72949V12.7295H16.3926Z" fill="#1F2937" />
                                    <path d="M16.3926 10.2295C16.9449 10.2295 17.3926 9.78178 17.3926 9.22949C17.3926 8.67721 16.9449 8.22949 16.3926 8.22949C15.8403 8.22949 15.3926 8.67721 15.3926 9.22949C15.3926 9.78178 15.8403 10.2295 16.3926 10.2295Z" fill="#1F2937" />
                                </svg>
                            </div>
                            印刷
                        </Link>
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={() => handleDelete(stockInOutSlip.id, stockInOutSlip.code)}>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3926 6.72949V16.7295H3.39258V6.72949H11.3926ZM9.89258 0.729492H4.89258L3.89258 1.72949H0.392578V3.72949H14.3926V1.72949H10.8926L9.89258 0.729492ZM13.3926 4.72949H1.39258V16.7295C1.39258 17.8295 2.29258 18.7295 3.39258 18.7295H11.3926C12.4926 18.7295 13.3926 17.8295 13.3926 16.7295V4.72949Z" fill="#1F2937" />
                                </svg>
                            </div>
                            削除
                        </div>
                    </div>
                </div>
                <div className='px-8 py-6'>
                    <div className='py-2.5 font-bold text-xl'>伝票番号</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>伝票番号</div>
                        <div>{stockInOutSlip.code }</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>入出庫日付</div>
                        <div>{stockInOutSlip.stock_in_out_date }</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>処理種別</div>
                        <div>{stockInOutSlip.processType }</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>出庫元倉庫</div>
                        <div>{stockInOutSlip.warehouse_from }</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>入庫先倉庫</div>
                        <div>{stockInOutSlip.warehouse_to }</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>担当者</div>
                        <div>{stockInOutSlip.contact_person }</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    <table className="w-full mt-8 table-auto">
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left py-2'>商品コード</th>
                                <th className='text-left py-2 w-72'>商品名</th>
                                <th className='text-left py-2'>数量</th>
                                <th className='text-left py-2'>単位</th>
                                <th className='text-left py-2'>ロット番号</th>
                                <th className='text-left py-2'>単価</th>
                                <th className='text-left py-2'>金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockInOutSlipDetails.map((detail, index) => (
                                <tr className='border-b' key={index}>
                                    <td className='py-2'>{detail.product_id }</td>
                                    <td className='py-2'>{detail.product_name }</td>
                                    <td className='py-2'>{detail.number || 0}</td>
                                    <td className='py-2'>{detail.unit }</td>
                                    <td className='py-2'>{detail.lot_number }</td>
                                    <td className='py-2'>{detail.price || 0}円</td>
                                    <td className='py-2'>{parseInt(detail.price) * parseInt(detail.number) || 0}円</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='flex items-center pb-2'>
                        {stockInOutSlip.remarks || "N/A"}
                    </div>
                </div>
            </div>
            <ConfirmDialog
                isOpen={isDialogOpen}
                message={messageToDelete + "を削除しますか？"}
                additionalMessage={
                    <>
                       この操作は取り消しできません。<br />
                       確認し、問題ない場合は削除ボタンを押してください。
                    </>
                }
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}

export default StockInOutSlipsDetail;
