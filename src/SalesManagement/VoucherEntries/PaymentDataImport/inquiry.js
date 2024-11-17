import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function PaymentDataReconciliation() {
  // サンプルデータ
  const transactionDetails = {
    date: '2023/05/01',
    source: 'カブキカインシャテスト',
    amount: '100,000円',
    status: '照合確定',
  };

  const invoiceData = [
    {
      id: 'INV-001',
      customer: '株式会社A',
      status: '照合確定',
      invoiceDate: '2023/04/25',
      transferFee: '700円',
      amount: '100,000円',
    },
  ];

  const [invoices, setInvoices] = useState([]);


  useEffect(() => {
    ipcRenderer.send('load-invoices');
    ipcRenderer.on('load-invoices', (event, data) => {
      console.log('data', data);
      setInvoices(data);
    })
    return () => {
      ipcRenderer.removeAllListeners('load-invoices');
    }
  }, []);

  // 選択された請求番号
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const handleConfirm = () => {
    setShowConfirmationMessage(true);
  };

  return (
    <div className="w-full p-8">
      {/* ヘッダー */}
      <div className="pb-6 text-2xl font-bold">入金データ照合</div>

      {/* 取引詳細 */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <div className="text-lg font-bold pb-4">取引詳細</div>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
          <div>取引日</div>
          <div>{transactionDetails.date}</div>
          <div>入金元</div>
          <div>{transactionDetails.source}</div>
          <div>金額</div>
          <div>{transactionDetails.amount}</div>
          <div>ステータス</div>
          <div>{transactionDetails.status}</div>
        </div>
      </div>

      {/* 請求データ */}
      <div className="text-lg font-bold mb-4">請求データ</div>
      <table className="w-full border-t border-gray-300 text-sm">
        <thead>
          <tr>
            <th className="py-2 text-left">請求番号</th>
            <th className="py-2 text-left">得意先名</th>
            <th className="py-2 text-left">ステータス</th>
            <th className="py-2 text-left">請求日</th>
            <th className="py-2 text-left">振込手数料</th>
            <th className="py-2 text-left">金額</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">
                <input
                  type="radio"
                  name="invoice"
                  onChange={() => setSelectedInvoice(invoice.id)}
                  checked={selectedInvoice === invoice.id}
                />
                <span className="ml-2">INV-{invoice.invoice_number}</span>
              </td>
              <td className="py-2">{invoice.name_primary}</td>
              <td className="py-2">{invoice.status === 0 ? "未照合" : "照合確定"}</td>
              <td className="py-2">{invoice.invoice_created}</td>
              <td className="py-2">{invoice.transferFee}</td>
              <td className="py-2">{invoice.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 確定メッセージ */}
      {showConfirmationMessage && (
        <div className="flex items-center bg-[#DEF7E4] border border-green-400 text-green-700 px-4 py-3 rounded mt-6" role="alert">
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>照合が確定されました。</span>
        </div>
      )}

      {/* ボタン */}
      <div className="flex justify-start mt-6 space-x-4">
        <button
          className={`px-6 py-3 rounded font-bold ${selectedInvoice ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-200'
            }`}
          onClick={handleConfirm}
          disabled={!selectedInvoice}
        >
          照合確定
        </button>
        <Link to={`/sales-management/voucher-entries/payment-slips/add`} className="border px-6 py-3 rounded font-bold">戻る</Link>
      </div>
    </div>
  );
}

export default PaymentDataReconciliation;
