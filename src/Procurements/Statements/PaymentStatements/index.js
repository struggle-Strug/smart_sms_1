import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../../Components/CustomSelect';

const { ipcRenderer } = window.require('electron');

function Index() {
    const options = [
        { value: '御中', label: '御中' },
        { value: '貴社', label: '貴社' },
    ];

    // const [customer, setCustomer] = useState({
    //     id: '',
    //     name_primary: '',
    //     name_secondary: '',
    //     name_kana: '',
    //     honorific: '',
    //     phone_number: '',
    //     fax_number: '',
    //     zip_code: '',
    //     address: '',
    //     email: '',
    //     remarks: '',
    //     billing_code: '',
    //     billing_information: '',
    //     monthly_sales_target: ''
    // });
    // const [customers, setCustomers] = useState([]);
    // const [isOpen, setIsOpen] = useState(false);
    // const dropdownRef = useRef(null);
    // const location = useLocation();
    // const [searchQuery, setSearchQuery] = useState('');

    const [paymentVoucherDetails, setPaymentVoucherDetails] = useState([]);
    const [paymentVoucherDetail, setPaymentVoucherDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [searchQueryList, setSearchQueryList] = useState({
        "pvd.payment_method": "",
        "pvd.vender_name": "",
        "pvd.contact_person": "",
        "v.classification1": "",
        "v.classification2": "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQueryList((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        ipcRenderer.send('load-payment-voucher-details');

        const handleLoadDetails = (event, data) => setPaymentVoucherDetails(data);
        const handleSearchResult = (event, data) => {

            setPaymentVoucherDetails(data);
        };

        ipcRenderer.on('load-payment-voucher-details', handleLoadDetails);
        ipcRenderer.on('search-payment-voucher-details-result', handleSearchResult);

        return () => {
            ipcRenderer.removeListener('load-payment-voucher-details', handleLoadDetails);
            ipcRenderer.removeListener('search-payment-voucher-details-result', handleSearchResult);
        };
    }, []);

    // useEffect(() => {
    //     ipcRenderer.send('get-customers');
    //     ipcRenderer.on('customers-data', (event, data) => {
    //         setCustomers(data);
    //     });

    //     ipcRenderer.on('customer-deleted', (event, id) => {
    //         setCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
    //     });

    //     ipcRenderer.on('search-customers-result', (event, data) => {
    //         setCustomers(data);
    //     });

    //     return () => {
    //         ipcRenderer.removeAllListeners('customers-data');
    //         ipcRenderer.removeAllListeners('search-customers-result');
    //     };
    // }, []);

    const [outputFormat, setOutputFormat] = useState('csv');
    const [remarks, setRemarks] = useState('');
    const [settingId, setSettingId] = useState(1)

    useEffect(() => {
        if (settingId) {
            ipcRenderer.send('get-statement-setting-detail', settingId);
            ipcRenderer.once('statement-setting-detail-data', (event, data) => {
                if (data) {
                    setOutputFormat(data.output_format || 'csv');
                    setRemarks(data.remarks || '');
                }
            });
        }
    }, [settingId]);

    const handleSave = () => {
        const settingData = {
            id: settingId,
            output_format: outputFormat,
            remarks: remarks,
        };

        ipcRenderer.send('save-statement-setting', settingData);
        ipcRenderer.once('load-statement-settings', (event, data) => {
            handleConfirmDelete(data); // 更新されたデータを返す
        });
    };


    const toggleDropdown = (id) => {
        console.log(id)
        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('本当にこの顧客を削除しますか？')) {
            ipcRenderer.send('delete-customer', id);
        }
    };

    const handleSearch = () => {
        const searchColums = {}
        setPaymentVoucherDetails([])
        console.log(searchQueryList)
        for (let key in searchQueryList) {
            if (searchQueryList[key] !== "") {
                searchColums[key] = searchQueryList[key]
            }
        }
        ipcRenderer.send('search-payment-voucher-details', searchColums);
    };

    // const handleSearch = () => {
    //     ipcRenderer.send('search-customers', searchQuery);
    // };

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         handleSearch();
    //     }
    // };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const DropDown = (id) => {
        return (
            <div ref={dropdownRef} className='absolute right-0 origin-top-right mt-6 rounded shadow-lg z-50 bg-white p-3' style={{ top: "50px", width: "120px" }}>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        );
    }

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-customer', customerIdToDelete);
        setIsDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className='w-5/6'>
            <div className='p-8'>
                <div className='pb-6 flex items-center'>
                    <div className='text-2xl font-bold'>支払明細表</div>
                    <div className='flex ml-auto'>
                        <Link to={`/master/purchase-order-details/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                            明細表設定
                        </Link>
                    </div>
                </div>
                <div className='bg-gray-100 rounded-lg p-6'>
                    <div className='pb-6 text-lg font-bold'>
                        表示条件指定
                    </div>
                    <div className='grid grid-cols-2 gap-6 pb-6'>
                        <div className='pl-0'>
                            <div className='text-sm pb-1.5'>期間指定 <span className='text-xs ml-1 font-bold text-red-600'>必須</span>
                            </div> {/* ボックスと波線の間隔を調整 */}
                            <div className='flex items-center'>
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/2' placeholder='' name="" value={""} />
                                <div className='flex items-center px-2'>〜</div> {/* 波線 */}
                                <input type='text' className='border rounded px-4 py-2.5 bg-white w-1/2' placeholder='' name="" value={""} />
                            </div>
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払方法</div>
                            <input type='text' className='border rounded px-4 py-2.5 bg-white w-full' placeholder='' name="" value={""} />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-6'>
                        <div>
                            <div className='text-sm pb-1.5'>仕入先</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pvd.vender_name"
                                value={searchQueryList["pvd.vender_name"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>支払方法</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pvd.payment_method"
                                value={searchQueryList["pvd.payment_method"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>担当者</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="pvd.contact_person"
                                value={searchQueryList["pvd.contact_person"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分１</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="v.classification1"
                                value={searchQueryList["v.classification1"]}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <div className='text-sm pb-1.5'>区分２</div>
                            <input
                                type='text'
                                className='border rounded px-4 py-2.5 bg-white w-full'
                                placeholder=''
                                name="v.classification2"
                                value={searchQueryList["v.classification2"]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex mt-6'>
                        <div className='border rounded-lg py-3 px-7 text-base font-bold bg-blue-600 text-white' onClick={(e) => handleSearch()}>適用して表示</div>
                    </div>
                </div>
                <div className='flex justify-end pt-6'>
                    <Link to={`/master/purchase-order-details/edit/1`} className='py-3 px-4 border rounded-lg text-base font-bold flex'>
                        エクスポート
                    </Link>
                </div>
                <div className='px-8 pb-8 overflow-x-scroll'>
                    <table className="w-full mt-8 table-auto" style={{ width: "2000px" }}>
                        <thead className=''>
                            <tr className='border-b'>
                                <th className='text-left pb-2.5'>支払伝票番号</th>
                                <th className='text-left pb-2.5'>仕入先</th>
                                <th className='text-left pb-2.5'>支払方法</th>
                                <th className='text-left pb-2.5'>仕入金額税別</th>
                                <th className='text-left pb-2.5'>支払金額税込</th>
                                <th className='text-left pb-2.5'>担当者</th>
                                <th className='text-left pb-2.5'>区分１</th>
                                <th className='text-left pb-2.5'>区分２</th>
                                <th className='text-left pb-2.5'>仕入伝票番号</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentVoucherDetails.map((paymentVoucherDetail) => (
                                <tr className='border-b' key={paymentVoucherDetail.id}>
                                    <td className='py-4'>{paymentVoucherDetail.payment_voucher_id || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.vender_name || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.payment_method || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.payment_price || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.payment_price || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.contact_person || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.classification1 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.classification2 || <div className='border w-4'></div>}</td>
                                    <td className='py-4'>{paymentVoucherDetail.status || <div className='border w-4'></div>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function PaymentStatementsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
        </Routes>
    )
}

export default PaymentStatementsIndex;
