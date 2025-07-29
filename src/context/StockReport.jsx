import React, { createContext, useState } from 'react';

export const StockReportContext = createContext();

export const StockReportProvider = ({ children }) => {
   const [stockReport, setStockReport] = useState([]);
   return (
      <StockReportContext.Provider value={{ stockReport, setStockReport }}>
         {children}
      </StockReportContext.Provider>
   );
};