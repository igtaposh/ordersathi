import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { SupplierProvider } from './context/SupplierContext';
import { OrderProvider } from './context/OrderContext';
import { StatsProvider } from './context/Stats.jsx';
import { StockReportProvider } from './context/StockReport.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <SupplierProvider>
            <OrderProvider>
              <StockReportProvider>
                <StatsProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </StatsProvider>
              </StockReportProvider>
            </OrderProvider>
          </SupplierProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
