import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ContactPersonsAdd from './add';
import ContactPersonsEdit from './edit';
import ContactPersonsDetail from './detail';

const { ipcRenderer } = window.require('electron');

function Index() {
    const [contactPersons, setContactPersons] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        ipcRenderer.send('load-contact-persons');
        ipcRenderer.on('load-contact-persons', (event, data) => {
            setContactPersons(data);
        });

        ipcRenderer.on('contact-person-deleted', (event, id) => {
            setContactPersons((prevPersons) => prevPersons.filter(person => person.id !== id));
        });

        return () => {
            ipcRenderer.removeAllListeners('load-contact-persons');
            ipcRenderer.removeAllListeners('contact-person-deleted');
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

    const handleDelete = (id) => {
        if (window.confirm('本当にこの担当者を削除しますか？')) {
            ipcRenderer.send('delete-contact-person', id);
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
            <div className='absolute left-0 origin-top-right rounded shadow z-50 bg-white' style={{ top: "50px" }}>
                <div className='text-center py-2 hover:bg-gray-100 mt-2'><Link to={`detail/${id.id}`} className={``}>詳細</Link></div>
                <div className='px-4 py-2 hover:bg-gray-100'><Link to={`edit/${id.id}`} className={``}>編集</Link></div>
                <div className='px-4 py-2 mb-2 hover:bg-gray-100' onClick={() => handleDelete(id.id)}>削除</div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='pb-6 text-2xl font-bold'>担当者一覧</div>
                <div className='flex'>
                    <div className='border rounded py-3 px-4 mb-8 text-base font-bold'><Link to="add" className={``}>＋新規登録</Link></div>
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
                            <input className='outline-none' placeholder='検索' />
                        </div>
                    </div>
                </div>
                <table className="w-full mt-8">
                    <thead>
                        <tr>
                            <th className='text-left'>担当者名</th>
                            <th className='text-left'>所属部署</th>
                            <th className='text-left'>役職</th>
                            <th className='text-left'>電話番号</th>
                            <th className='text-left'>メールアドレス</th>
                            <th className='text-right'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactPersons.map((person) => (
                            <tr className='border-b' key={person.id}>
                                <td>{person.name}</td>
                                <td>{person.department}</td>
                                <td>{person.position}</td>
                                <td>{person.phone_number}</td>
                                <td>{person.email}</td>
                                <td className='flex justify-center relative'>
                                    {isOpen === person.id && <DropDown id={person.id} />}
                                    <div className='border rounded px-4 py-3' onClick={() => toggleDropdown(person.id)}>
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

function ContactPersonsIndex() {
    return (
        <Routes>
            <Route path="" element={<Index />} />
            <Route path="add" element={<ContactPersonsAdd />} />
            <Route path="edit/:id" element={<ContactPersonsEdit />} />
            <Route path="detail/:id" element={<ContactPersonsDetail />} />
        </Routes>
    )
}

export default ContactPersonsIndex;
