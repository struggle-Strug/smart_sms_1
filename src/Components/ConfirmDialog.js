import React from 'react';

const ConfirmDialog = ({ isOpen, message, additionalMessage, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="container mx-auto px-4 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white py-10 rounded-2xl shadow-md">
                <p className='text-2xl font-bold text-center'>{message}</p>
                {additionalMessage && <p className="mt-6 text-base font-medium text-center">{additionalMessage}</p>}
                <div className="mt-6  flex justify-center">
                    <button onClick={onCancel} className="w-30 h-12 font-semibold text-base mr-6 px-5 py-3 bg-white border border-gray-300 rounded">キャンセル</button>
                    <button onClick={onConfirm} className="w-30 h-12 font-semibold text-base px-11 py-3 bg-red-500 text-white border-0 rounded">削除</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
