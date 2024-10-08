import React from 'react';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <p>{message}</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-300 rounded">キャンセル</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">削除</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
