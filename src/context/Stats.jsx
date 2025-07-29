import React, { createContext, useState } from 'react';

export const statsContext  = createContext();

export const StatsProvider = ({ children }) => {
   const [topSuppliers, setTopSuppliers] = useState([]);
   const [topProducts, setTopProducts] = useState([]);
   const [recentOrders, setRecentOrders] = useState([]);
   const [stats, setStats] = useState([]);
   return (
      <statsContext.Provider value={{ topSuppliers, setTopSuppliers, topProducts, setTopProducts, recentOrders, setRecentOrders, stats, setStats }}>
         {children}
      </statsContext.Provider>
   );
};