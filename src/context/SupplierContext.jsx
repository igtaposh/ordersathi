import React, { createContext, useState } from 'react';

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
   const [suppliers, setSuppliers] = useState([]);
   const [supplier, setSupplier] = useState(null);
   return (
      <SupplierContext.Provider value={{ suppliers, setSuppliers, supplier, setSupplier }}>
         {children}
      </SupplierContext.Provider>
   );
};