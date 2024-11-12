import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProcessRegistrationIndex from '../ProcessRegistration';

const { ipcRenderer } = window.require('electron');


function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [invoiceData, setInvoiceData] = useState([]);
    const [monthSales, setMonthSales] = useState();
    const [depositSumData, setDepositSumData] = useState([]);
    const [salesSumData, setSalesSumData] = useState([]);
    const [salesSumInTaxData, seSalesSumInTaxData] = useState([]);


    const toggleDropdown = (id) => {
        console.log(id)
        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    useEffect(() => {
        ipcRenderer.send('load-invoices');
        ipcRenderer.on('load-invoices', (event, data) => {
            setInvoiceData(data);
        });

        ipcRenderer.on('invoice-deleted', (event, id) => {
            setInvoiceData((prevInvoices) => prevInvoices.filter(invoice => invoice.invoice_id !== id));
        });

        ipcRenderer.on('get-deposit-slip-sum-by-vender-id-result', (event, data) => {
            setDepositSumData(data);
        });
        
        ipcRenderer.on('get-monthly-sales-by-vender-id-result', (event, data) => {
            setSalesSumData(data)
        });

        ipcRenderer.on('get-monthly-sales-in-tax-by-vender-id-result', (event, data) => {
            seSalesSumInTaxData(data)
        });

        ipcRenderer.on('search-invoices-result', (event, data) => {
            setInvoiceData(data)
        });

        return () => {
            ipcRenderer.removeAllListeners('load-invoices');
            ipcRenderer.removeAllListeners('invoice-deleted');
            ipcRenderer.removeAllListeners('search-customers-result');
            ipcRenderer.removeAllListeners('get-deposit-slip-sum-by-vender-id-result');
            ipcRenderer.removeAllListeners('get-monthly-sales-by-vender-id-result');
            ipcRenderer.removeAllListeners('get-monthly-sales-in-tax-by-vender-id-result');
            ipcRenderer.removeAllListeners('search-invoices-result');
        };
    }, []);


    useEffect(() => {
        let venderIds = [];
        for (let i = 0; i < invoiceData.length; i++) {
            venderIds.push(invoiceData[i].customer_id);
        }
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        ipcRenderer.send('get-deposit-slip-sum-by-vender-id', { venderIds, formattedDate });
        ipcRenderer.send('get-monthly-sales-by-vender-id', { venderIds, formattedDate });
        ipcRenderer.send('get-monthly-sales-in-tax-by-vender-id', { venderIds, formattedDate });
    }, [invoiceData])

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('本当にこの請求データを削除しますか？')) {
            ipcRenderer.send('delete-invoice', id);
        }
    };

    const handleSearch = () => {
        console.log("search")
        ipcRenderer.send('search-invoices', searchQuery);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const monthSalesData = (customer_id) => {
        ipcRenderer.send('get-monthly-sales-slip-detail-data', customer_id);
        ipcRenderer.on('monthly-sales-slip-detail-data-result', (event, data) => {
            setMonthSales(data);
        });

        return "DATA"
    }

    function getDepositByVendorId(vendorId) {
        const data =  depositSumData?.find(item => item.vender_id === vendorId.toString());
        return data?.total_deposits
    }

    function getSalesByVendorId(vendorId) {
        const data =  salesSumData?.find(item => item.vender_id === vendorId.toString());
        return data?.total_sales
    }

    function getSalesInTaxByVendorId(vendorId) {
        const data =  salesSumInTaxData?.find(item => item.vender_id === vendorId.toString());
        return data?.total_sales
    }
    

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-3xl font-bold'>請求処理</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/customers/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            <div className='flex items-center'>
                            </div>
                            明細表設定
                        </Link>
                    </div>
                </div>
                <div className='flex'>
                    <Link to={`process-registration/`}>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white'>請求計算</div>
                    </Link>
                </div>
                <div className='bg-gray-100 rounded-lg p-6 mt-8'>
                    <div className='pb-6 text-lg font-bold'>
                        検索する
                    </div>
                    <div className='flex'>
                        <div className='border rounded flex p-3 bg-white'>
                            <div className='pr-4 flex items-center justify-center'>
                                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.0615 11.223H12.2715L11.9915 10.953C12.9715 9.81302 13.5615 8.33302 13.5615 6.72302C13.5615 3.13302 10.6515 0.223022 7.06152 0.223022C3.47152 0.223022 0.561523 3.13302 0.561523 6.72302C0.561523 10.313 3.47152 13.223 7.06152 13.223C8.67152 13.223 10.1515 12.633 11.2915 11.653L11.5615 11.933V12.723L16.5615 17.713L18.0515 16.223L13.0615 11.223ZM7.06152 11.223C4.57152 11.223 2.56152 9.21302 2.56152 6.72302C2.56152 4.23302 4.57152 2.22302 7.06152 2.22302C9.55152 2.22302 11.5615 4.23302 11.5615 6.72302C11.5615 9.21302 9.55152 11.223 7.06152 11.223Z" fill="#9CA3AF" />
                                </svg>
                            </div>
                            <input
                                className='outline-none'
                                placeholder='検索'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>
                <div className='pt-10 pb-6 text-2xl font-bold'>
                    請求一覧表
                </div>
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b'>
                            <th className='text-left pb-2.5'>得意先</th>
                            <th className='text-left pb-2.5'>請求日</th>
                            <th className='text-left pb-2.5'>当月入金額</th>
                            <th className='text-left pb-2.5'>税別売上高</th>
                            <th className='text-left pb-2.5'>税込売上高</th>
                            <th className='text-left pb-2.5'>消費税</th>
                            <th className='text-left pb-2.5 text-center'>操作</th>
                            <th className='text-right'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.map((invoice) => (
                            <tr className='border-b' key={invoice.invoice_id}>
                                <td className='py-4'>{invoice.name_primary || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{invoice.billing_date || <div className='border w-4'></div>}</td>
                                <td className='py-4'>{getDepositByVendorId(invoice.customer_id)?.toFixed(0).toLocaleString() || 0}</td>
                                <td className='py-4'>{getSalesByVendorId(invoice.customer_id)?.toFixed(0).toLocaleString() || 0}</td>
                                <td className='py-4'>{getSalesInTaxByVendorId(invoice.customer_id)?.toFixed(0).toLocaleString() || 0}</td>
                                <td className='py-4'>{(getSalesInTaxByVendorId(invoice.customer_id) - getSalesByVendorId(invoice.customer_id))?.toFixed(0).toLocaleString() || 0 }</td>
                                <td className='flex justify-center relative items-center'>
                                    <div className='border rounded px-4 py-3 relative hover:cursor-pointer' onClick={(e) => toggleDropdown(invoice.invoice_id)}>
                                    {isOpen === invoice.invoice_id && <DropDown id={invoice.invoice_id } />}
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.30664 10.968C5.20664 10.968 4.30664 11.868 4.30664 12.968C4.30664 14.068 5.20664 14.968 6.30664 14.968C7.40664 14.968 8.30664 14.068 8.30664 12.968C8.30664 11.868 7.40664 10.968 6.30664 10.968ZM18.3066 10.968C17.2066 10.968 16.3066 11.868 16.3066 12.968C16.3066 14.068 17.2066 14.968 18.3066 14.968C19.4066 14.968 20.3066 14.068 20.3066 12.968C20.3066 11.868 19.4066 10.968 18.3066 10.968ZM12.3066 10.968C11.2066 10.968 10.3066 11.868 10.3066 12.968C10.3066 14.068 11.2066 14.968 12.3066 14.968C13.4066 14.968 14.3066 14.068 14.3066 12.968C14.3066 11.868 13.4066 10.968 12.3066 10.968Z" fill="#1A1A1A" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function InvoiceProcessingsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
            <Route path="process-registration" element={<ProcessRegistrationIndex />} />
        </Routes>
    )
}

export default InvoiceProcessingsIndex;
