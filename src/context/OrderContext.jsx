import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
   const [order, setOrder] = useState([]);
   const [orders, setOrders] = useState([]);
   return (
      <OrderContext.Provider value={{ order, setOrder, orders, setOrders }}>
         {children}
      </OrderContext.Provider>
   );
};