import React, { createContext, useContext, useState } from 'react';

const StatsContext = createContext();

export const useStats = () => {
   const context = useContext(StatsContext);
   if (!context) {
      throw new Error('useStats must be used within a StatsProvider');
   }
   return context;
};

export const StatsProvider = ({ children }) => {
   const [monthlyData, setMonthlyData] = useState([]);
   const [topProducts, setTopProducts] = useState([]);
   const [topSuppliers, setTopSuppliers] = useState([]);
   const [recentOrders, setRecentOrders] = useState([]);
   const [loadingStates, setLoadingStates] = useState({
      monthly: false,
      products: false,
      suppliers: false,
      recent: false
   });
   const [error, setError] = useState(null);

   return (
      <StatsContext.Provider value={{
         monthlyData,
         topProducts,
         topSuppliers,
         recentOrders,
         loadingStates,
         error,
         setMonthlyData,
         setTopProducts,
         setTopSuppliers,
         setRecentOrders,
         setLoadingStates,
         setError
      }}>
         {children}
      </StatsContext.Provider>
   );
};

export { StatsContext };