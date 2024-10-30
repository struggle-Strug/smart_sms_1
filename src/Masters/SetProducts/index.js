import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SetProductDetail from './detail';
import SetProductEdit from './edit';
import SetProductAdd from './add';
import ConfirmDialog from '../../Components/ConfirmDialog';

const { ipcRenderer } = window.require('electron');

function SetProductList() {
    const [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ipcRenderer.send('load-set-products');
        ipcRenderer.on('load-set-products', (event, data) => {
            setProducts(data);
        });

        ipcRenderer.on('product-set-deleted', (event, id) => {
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
        });

        ipcRenderer.on('search-set-products-result', (event, data) => {
            setProducts(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('load-products');
            ipcRenderer.removeAllListeners('search-products-result');
        };
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('本当にこの商品を削除しますか？')) {
            ipcRenderer.send('delete-set-product', id);
        }
    };

    const toggleDropdown = (id) => {
        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSearch = () => {
        ipcRenderer.send('search-set-products', searchQuery);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

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
        )
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>セット商品一覧</div>
                <div className='flex'>
                <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>新規登録</Link></div>
                </div>
                <div className='bg-gray-100 rounded p-6'>
                    <div className='pb-3 text-lg font-bold'>
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
                <table className="w-full mt-8 table-auto">
                    <thead className=''>
                        <tr className='border-b'>
                            <th className='text-left pb-2.5'>セット商品名</th>
                            <th className='text-left pb-2.5'>セット商品コード</th>
                            <th className='text-left pb-2.5'>カテゴリー</th>
                            <th className='text-left pb-2.5'>サブカテゴリー</th>
                            <th className='text-left pb-2.5'>販売売価</th>
                            <th className='text-right'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr className='border-b' key={product.id}>
                                <td>{product.set_product_name || <div className='border w-4'></div>}</td>
                                <td>{product.code || <div className='border w-4'></div>}</td>
                                <td>{product.category || <div className='border w-4'></div>}</td>
                                <td>{product.sub_category || <div className='border w-4'></div>}</td>
                                <td>{product.set_product_price || <div className='border w-4'></div>}</td>
                                <td className='flex justify-center relative'>
                                    <div className='border rounded px-4 py-3 relative' onClick={(e) => toggleDropdown(product.id)}>
                                    {isOpen === product.id && <DropDown id={product.id} />}
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

function SetProductsIndex() {
    return (
        <Routes>
            <Route path="" element={<SetProductList />} />
            <Route path="edit/:id" element={<SetProductEdit />} />
            <Route path="add" element={<SetProductAdd />} />
            <Route path="detail/:id" element={<SetProductDetail />} />
        </Routes>
    )
}

export default SetProductsIndex;
