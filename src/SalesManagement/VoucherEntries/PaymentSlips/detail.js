import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../Components/ConfirmDialog';
const { ipcRenderer } = window.require('electron');

function PaymentSlipsDetail() {
    const [depositSlip, setDepositSlip] = useState({
        code: '',
        deposit_date: '',
        status: '',
        vender_name: '',
        vender_id: '',
        remarks: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState('');

    const navigate = useNavigate();

    const [company, setCompany] = useState({});

    const [estimationInvoiceDetails, setEstimationInvoiceDetails] = useState([])

    const [vendor, setVendor] = useState({});

    const { id } = useParams();

    useEffect(() => {
        ipcRenderer.send('get-deposit-slip-detail', id);

        ipcRenderer.on('deposit-slip-detail-data', (event, data) => {
            setDepositSlip(data);
            ipcRenderer.send('search-purchase-invoice-details', { "pi.purchase_order_id": data.code });
            ipcRenderer.send('search-id-vendors', data.vender_id);
        });

        ipcRenderer.on('search-id-vendors-result', (event, data) => {
            setVendor(data[0]);
        });

        ipcRenderer.send('search-deposit-slip-details-by-vender-id', id);


        ipcRenderer.on('search-deposit-slip-details-by-vender-id-result', (event, data) => {
            setDepositSlipDetails(data);
        });

        ipcRenderer.send('load-companies');
        ipcRenderer.on('load-companies', (event, data) => {
            if (data.length === 0) return;
            setCompany(data[0]);
        });

        return () => {
            ipcRenderer.removeAllListeners('deposit-slip-data');
            ipcRenderer.removeAllListeners('search-deposit-slip-details-by-vender-id');
        };
    }, [id]);

    const [depositSlipDetails, setDepositSlipDetails] = useState([
        {
            id: '',
            deposit_slip_id: '',
            deposit_date: '',
            vender_id: '',
            vender_name: '',
            claim_id: '',
            deposit_method: '',
            deposits: '',
            commission_fee: '',
            data_category: '',
            remarks: '',
        }
    ]);

    const addDepositSlipDetail = () => {
        setDepositSlipDetails([...depositSlipDetails, {
            id: '',
            deposit_slip_id: '',
            deposit_date: '',
            vender_id: '',
            vender_name: '',
            claim_id: '',
            deposit_method: '',
            deposits: '',
            commission_fee: '',
            data_category: '',
            remarks: '',
        }]);
    }

    const handleSumPrice = () => {
        let SumPrice = 0
        let consumptionTaxEight = 0
        let consumptionTaxTen = 0

        for (let i = 0; i < depositSlipDetails.length; i++) {
            SumPrice += depositSlipDetails[i].unit_price * depositSlipDetails[i].number;
            if (depositSlipDetails[i].tax_rate === 8) {
                consumptionTaxEight += depositSlipDetails[i].unit_price * depositSlipDetails[i].number * 0.08;
            } else if (depositSlipDetails[i].tax_rate === 10) {
                consumptionTaxTen += depositSlipDetails[i].unit_price * depositSlipDetails[i].number * 0.1;
            }
        }

        return { "subtotal": SumPrice, "consumptionTaxEight": consumptionTaxEight, "consumptionTaxTen": consumptionTaxTen, "totalConsumptionTax": consumptionTaxEight + consumptionTaxTen, "Total": SumPrice + consumptionTaxEight + consumptionTaxTen }
    }

    const handleDelete = (id, name) => {
        setCustomerIdToDelete(id);
        setMessageToDelete(name);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-deposit-slip', customerIdToDelete);
        ipcRenderer.send('delete-deposit-slip-details-by-slip-id', customerIdToDelete);

        setIsDialogOpen(false);
        navigate("/sales-management/voucher-entries/payment-slips");
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className='w-full'>
            <div className=''>
                <div className='pt-8 pb-6 flex border-b px-8 items-center'>
                    <div className='text-2xl font-bold'></div>
                    <div className='flex ml-auto'>
                        <Link to={`/sales-management/voucher-entries/payment-slips/edit/` + id} className='py-3 px-4 border rounded-lg text-base font-bold mr-6 flex'>
                            <div className='pr-1.5 pl-1 flex items-center'>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className=''>
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
                        <div className='py-3 px-4 border rounded-lg text-base font-bold flex' onClick={() => handleDelete(depositSlip.id, depositSlip.code)}>
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
                    <div className='py-2.5 font-bold text-xl'>伝票情報</div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>伝票番号</div>
                        <div>{depositSlip.code}</div>
                    </div>
                    <div className='flex items-center pb-2'>
                        <div className='w-40'>入金日付</div>
                        <div>{depositSlip.deposit_date}</div>
                    </div>
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>明細</div>
                    <table className="w-full mt-8 table-auto">
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left py-2'>得意先コード</th>
                                <th className='text-left py-2 w-72'>得意先名</th>
                                <th className='text-left py-2'>入金方法</th>
                                <th className='text-left py-2'>入金額</th>
                                <th className='text-left py-2'>手数料等</th>
                                <th className='text-left py-2'>合計額</th>
                                <th className='text-left py-2'>データ区分</th>
                                <th className='text-left py-2'>請求番号</th>
                                <th className='text-left py-2'>備考</th>
                                {/* <th className='text-left py-2'>金額</th>
                                <th className='text-left py-2'>税額</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                depositSlipDetails.map((depositSlipDetail, index) => (
                                    <tr className='border-b' key={index}>
                                        <td className='py-2'>{depositSlipDetail.vender_id}</td>
                                        <td className='py-2'>{depositSlipDetail.vender_name}</td>
                                        <td className='py-2'>{depositSlipDetail.deposit_method}</td>
                                        <td className='py-2'>{depositSlipDetail.deposits}</td>
                                        <td className='py-2'>{depositSlipDetail.commission_fee}</td>
                                        <td className='py-2'>0</td>
                                        <td className='py-2'>{depositSlipDetail.data_category}%</td>
                                        <td className='py-2'>{depositSlipDetail.claim_id}</td>
                                        <td className='py-2'>{depositSlipDetail.remarks}</td>
                                        {/* <td className='py-2'>金額</td> */}
                                        {/* <td className='py-2'>税額</td> */}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {/* <div className='py-6 flex'>
                        <div className='ml-auto rounded px-10 py-8 bg-gray-100'>
                            <div className='flex pb-2'>
                                <div className='w-40'>税抜合計</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(8%)</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税(10%)</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex pb-2'>
                                <div className='w-40'>消費税合計</div>
                                <div>5,000円</div>
                            </div>
                            <div className='flex'>
                                <div className='w-40'>税込合計</div>
                                <div>5,000円</div>
                            </div>
                        </div>
                    </div> */}
                    <div className='py-3'>
                        <hr className='' />
                    </div>
                    <div className='py-2.5 font-bold text-xl'>備考</div>
                    <div className='flex items-center pb-2'>
                        {depositSlip.remarks}
                    </div>
                    <div className='py-3'>
                        <hr className='' />
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

export default PaymentSlipsDetail;
