import React, { createContext, useState } from 'react';

export const PurchaseOrdersContext = createContext();

export const PurchaseOrdersProvider = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  return (
    <PurchaseOrdersContext.Provider value={{ purchaseOrders, setPurchaseOrders }}>
      {children}
    </PurchaseOrdersContext.Provider>
  );
};
