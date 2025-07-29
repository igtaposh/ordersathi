import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Eager load critical components
import Login from './pages/Login';
import Register from './pages/Register';
import WrongRoute from './pages/WrongRoute';

// Lazy load non-critical components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/HIstory'));
const StockReport = lazy(() => import('./pages/StockReport'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const ProductProfile = lazy(() => import('./pages/ProductProfile'));
const SupplierProfile = lazy(() => import('./pages/SupplierProfile'));
const EditSupplier = lazy(() => import('./pages/EditSupplier'));
const EditProduct = lazy(() => import('./pages/EditProduct'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-neutral-200">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-900"></div>
  </div>
);

const App = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/history" element={<History />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/stock-report" element={<StockReport />} />
          <Route path="/edit-user" element={<EditProfile />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/edit-supplier/:id" element={<EditSupplier />} />
          <Route path="/product-profile/:id" element={<ProductProfile />} />
          <Route path="/supplier-profile/:id" element={<SupplierProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<WrongRoute />} />
    </Routes>
  </Suspense>
);

export default App;