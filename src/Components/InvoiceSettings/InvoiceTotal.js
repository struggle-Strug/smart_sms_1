import React from "react";

const InvoiceTotal = ({ details }) => {
  const { subtotal, totalConsumptionTax, total } = React.useMemo(() => {
    let sumPrice = 0;
    let totalTax = 0;

    for (let i = 0; i < details.length; i++) {
      const { price=0, number=0, tax_rate=0 } = details[i] || {};
      sumPrice += price * number;
      totalTax += (price * number * tax_rate) / 100;
    }

    return {
      subtotal: sumPrice,
      totalConsumptionTax: totalTax,
      total: sumPrice + totalTax,
    };
  }, [details]);

  const groupedDetails = React.useMemo(() => {
    return details.reduce((acc, orderDetail) => {
      const taxRate = Number(orderDetail.tax_rate || 0);
      if (!acc[taxRate]) {
        acc[taxRate] = 0; // Initialize if not exists
      }
      // Round and accumulate tax amounts
      acc[taxRate] += Math.round(
        ((orderDetail.price * orderDetail.number * taxRate) / 100 + 0.05) * 10
      ) / 10;
      console.log(acc);
      
      return acc;
    }, {});
  }, [details]);

  return (
    <div className="ml-auto rounded px-10 py-8 bg-gray-100">
      <div className="flex pb-2">
        <div className="w-40">税抜合計</div>
        <div>{subtotal.toFixed(0).toLocaleString()}円</div>
      </div>
      {Object.entries(groupedDetails).map(([taxRate, total], idx) => (
        <div className="flex pb-2" key={idx}>
          <div className="w-40">消費税({taxRate}%)</div>
          <div>{Number(total || 0)}円</div>
        </div>
      ))}
      <div className="flex pb-2">
        <div className="w-40">消費税合計</div>
        <div>{totalConsumptionTax.toFixed(0).toLocaleString()}円</div>
      </div>
      <div className="flex">
        <div className="w-40">税込合計</div>
        <div>{total.toFixed(0).toLocaleString()}円</div>
      </div>
    </div>
  );
};

export default InvoiceTotal;