import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
   const [product, setProduct] = useState([]);
   const [products, setProducts] = useState([]);
   return (
      <ProductContext.Provider value={{ product, setProduct, products, setProducts }}>
         {children}
      </ProductContext.Provider>
   );
};