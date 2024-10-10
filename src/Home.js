import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SalesTaxSettingsIndex from './SalesTaxSettings/index';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function Home() {
    const location = useLocation();
    return (
        <>
            {
                location.pathname === '/' &&
                <div className='mx-40 my-9'>
                    <>
                        <div className='text-3xl font-bold my-2'>
                            通知
                        </div>
                        <div className='bg-gray-100 p-6 rounded-xl'>
                            <div className='grid grid-col-12 mb-4'>
                                <div className='col-start-1 col-end-2 text-gray-600'>2024年10月10日</div>
                                <div className='col-start-2 col-end-12 pl-4'>タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。</div>
                                <div className='col-start-12 col-end-13'><img src='/Icon.png' width={24} /></div>
                            </div>
                            <div className='grid grid-col-12 mb-4'>
                                <div className='col-start-1 col-end-2 text-gray-600'>2024年10月10日</div>
                                <div className='col-start-2 col-end-12 pl-4'>タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。</div>
                                <div className='col-start-12 col-end-13'><img src='/Icon.png' width={24} /></div>
                            </div>
                            <div className='grid grid-col-12 mb-4'>
                                <div className='col-start-1 col-end-2 text-gray-600'>2024年10月10日</div>
                                <div className='col-start-2 col-end-12 pl-4'>タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。</div>
                                <div className='col-start-12 col-end-13'><img src='/Icon.png' width={24} /></div>
                            </div>
                            <div className='grid grid-col-12 mb-4'>
                                <div className='col-start-1 col-end-2 text-gray-600'>2024年10月10日</div>
                                <div className='col-start-2 col-end-12 pl-4'>タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。</div>
                                <div className='col-start-12 col-end-13'><img src='/Icon.png' width={24} /></div>
                            </div>
                            <div className='grid grid-col-12'>
                                <div className='col-start-1 col-end-2 text-gray-600'>2024年10月10日</div>
                                <div className='col-start-2 col-end-12 pl-4'>タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。</div>
                                <div className='col-start-12 col-end-13'><img src='/Icon.png' width={24} /></div>
                            </div>
                        </div>
                        <div className='text-3xl font-bold my-9'>
                            データ設定
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center py-3 px-4 border rounded'>
                                <div className='font-bold'>バックアップ設定</div>
                                <div><img src='/Icon.png' width={24} /></div>
                            </div>
                            <div className='flex items-center py-3 px-4 border rounded ml-14'>
                                <div className='font-bold'>データコンバート</div>
                                <div><img src='/Icon.png' width={24} /></div>
                            </div>
                        </div>
                        <div className='text-3xl font-bold my-9'>
                            ファイル管理
                        </div>
                        <div className=''>
                            <div className='flex items-center'>
                                <div className='flex items-center py-3 px-4 border rounded'>
                                    <div className='font-bold'>管理者設定</div>
                                    <div><img src='/Icon.png' width={24} /></div>
                                </div>
                                <div className='flex items-center py-3 px-4 border rounded ml-14'>
                                    <div className='font-bold'>POS連携</div>
                                    <div><img src='/Icon.png' width={24} /></div>
                                </div>
                                <Link to="/sales-tax-settings" className='flex items-center py-3 px-4 border rounded ml-14'>
                                    <div className='font-bold'>消費税設定</div>
                                    <div><img src='/Icon.png' width={24} /></div>
                                </Link>
                                <div className='flex items-center py-3 px-4 border rounded ml-14'>
                                    <div className='font-bold'>使用者設定</div>
                                    <div><img src='/Icon.png' width={24} /></div>
                                </div>
                                <div className='flex items-center py-3 px-4 border rounded ml-14'>
                                    <div className='font-bold'>銀行API連携</div>
                                    <div><img src='/Icon.png' width={24} /></div>
                                </div>
                            </div>
                            <div className='flex items-center mt-6'>

                            </div>
                        </div>
                    </>
                </div>
            }
            <Routes>
                <Route path="sales-tax-settings/*" element={<SalesTaxSettingsIndex />} />
            </Routes>
        </>
    )
}

export default Home;
