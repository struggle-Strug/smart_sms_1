import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CompaniesAdd from './add';
import CompaniesEdit from './edit';
import CompaniesDetail from './detail';
import ConfirmDialog from '../../Components/ConfirmDialog';

const { ipcRenderer } = window.require('electron');

function Index() {
    const [companies, setCompanies] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState('');

    useEffect(() => {
        ipcRenderer.send('load-companies');
        ipcRenderer.on('load-companies', (event, data) => {
            setCompanies(data);
        });

        ipcRenderer.on('company-deleted', (event, id) => {
            setCompanies((prevCompanies) => prevCompanies.filter(company => company.id !== id));
        });

        ipcRenderer.on('search-companies-result', (event, data) => {
            setCompanies(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('load-companies');
            ipcRenderer.removeAllListeners('company-deleted');
            ipcRenderer.removeAllListeners('search-companies-result');
        };
    }, []);

    const toggleDropdown = (id) => {
        if (!isOpen) setIsOpen(id);
        else setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleDelete = (id, name) => {
        setCustomerIdToDelete(id);
        setMessageToDelete(name);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        ipcRenderer.send('delete-company', customerIdToDelete);
        setIsDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    const handleSearch = () => {
        ipcRenderer.send('search-companies', searchQuery);
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
                <div className='px-3 py-1 hover:text-blue-600 hover:underline' onClick={() => handleDelete(id.id, id.name)}>削除</div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>自社マスタ</div>
                {
                    companies.length === 0 &&
                    <div className='flex'>
                        <div className='border rounded-lg py-3 px-7 mb-8 text-base font-bold bg-blue-600 text-white'><Link to="add" className={``}>新規登録</Link></div>
                    </div>
                }
                <table className="w-full mt-8 table-auto">
                    <thead>
                        <tr className='border-b'>
                            <th className='text-left pb-2.5'>会社名</th>
                            <th className='text-left pb-2.5'>自社コード</th>
                            <th className='text-left pb-2.5'>代表者名</th>
                            <th className='text-left pb-2.5'>電話番号</th>
                            <th className='text-left pb-2.5'>メールアドレス</th>
                            <th className='text-right'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr className='border-b' key={company.id}>
                                <td>{company.name || <div className='border w-4'></div>}</td>
                                <td>{company.code || <div className='border w-4'></div>}</td>
                                <td>{company.representive_name || <div className='border w-4'></div>}</td>
                                <td>{company.phone_number || <div className='border w-4'></div>}</td>
                                <td className='flex justify-center relative'>
                                    <div className='border rounded px-4 py-3 relative' onClick={() => toggleDropdown(company.id)}>
                                        {isOpen === company.id && <DropDown id={company.id} name={company.name} />}
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
    )
}

function CompaniesIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
            <Route path="add" element={<CompaniesAdd />} />
            <Route path="edit/:id" element={<CompaniesEdit />} />
            <Route path="detail/:id" element={<CompaniesDetail />} />
        </Routes>
    )
}

export default CompaniesIndex;
