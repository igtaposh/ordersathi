import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { IoSettingsOutline } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { GiShamrock } from "react-icons/gi";
import StatsTable from '../components/StatsTable';
import axiosInstance from '../api/axiosInstance';
import { statsContext } from '../context/Stats';
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { MdAddShoppingCart } from "react-icons/md";
import { GiWineBottle } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import SideNave from '../components/SideNave';
import { useTheme } from '../context/ThemeContext';



/**
 * Dashboard component - Main dashboard displaying statistics and overview
 * Shows user information, statistics tables, and provides navigation
 */
const Dashboard = () => {
  // Navigation and context hooks
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  // Stats context hooks
  const { stats, setStats } = useContext(statsContext);
  const { topSuppliers, setTopSuppliers } = useContext(statsContext);
  const { topProducts, setTopProducts } = useContext(statsContext);
  const { recentOrders, setRecentOrders } = useContext(statsContext);

  // UI state for side navigation
  const [isClosed, setIsClosed] = useState(false);

  // Loading states for different data sections
  const [loadingStates, setLoadingStates] = useState({
    stats: true,
    topSuppliers: true,
    topProducts: true,
    recentOrders: true
  });

  // Message state for success/error feedback
  const [message, setMessage] = useState({ type: '', text: '' });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch monthly statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, stats: true }));
        const res = await axiosInstance.get('/order/stats/monthly');
        setStats(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to fetch monthly statistics' });
      } finally {
        setLoadingStates(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, [setStats]);

  // Fetch top suppliers data
  useEffect(() => {
    const fetchTopSuppliers = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, topSuppliers: true }));
        const res = await axiosInstance.get('/order/stats/top-suppliers');
        setTopSuppliers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to fetch top suppliers data' });
      } finally {
        setLoadingStates(prev => ({ ...prev, topSuppliers: false }));
      }
    };

    fetchTopSuppliers();
  }, [setTopSuppliers]);

  // Fetch top products data
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, topProducts: true }));
        const res = await axiosInstance.get('/order/stats/top-products');
        setTopProducts(res.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to fetch top products data' });
      } finally {
        setLoadingStates(prev => ({ ...prev, topProducts: false }));
      }
    };

    fetchTopProducts();
  }, [setTopProducts]);

  // Fetch recent orders data
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, recentOrders: true }));
        const res = await axiosInstance.get('/order/stats/recent-orders');
        setRecentOrders(res.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to fetch recent orders data' });
      } finally {
        setLoadingStates(prev => ({ ...prev, recentOrders: false }));
      }
    };

    fetchRecentOrders();
  }, [setRecentOrders]);


  /**
   * Handles opening the side navigation
   */
  const handleOpenSideNav = () => {
    setIsClosed(true);
  };

  /**
   * Handles closing the side navigation
   */
  const handleCloseSideNav = () => {
    setIsClosed(false);
  };

  return (
    <div className={`w-full max-w-[500px] min-h-dvh relative transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Side Navigation Component */}
      <SideNave isClosed={isClosed} onClose={handleCloseSideNav} />

      <div className={`max-w-[500px] w-screen mx-auto relative transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>

        {/* Header Section */}
        <div className='w-full flex justify-between items-center p-4'>
          <div className='opacity-70'>
            <p className={`monoton-regular text-5xl absolute top-2 left-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>hey</p>
            <p className={`monoton-regular text-5xl absolute top-14 left-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{user?.name || 'User Name'}</p>
          </div>

          {/* Settings Icon - Opens Side Navigation */}
          <button
            onClick={handleOpenSideNav}
            className={`w-8 h-8 rounded-full flex justify-center items-center z-[8] transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
            aria-label="Open settings menu"
          >
            <IoSettingsOutline className='text-2xl' />
          </button>
        </div>

        {/* Main Content Area */}
        <div className={`w-full h-full min-h-screen relative z-10 rounded-t-3xl shadow-xl p-6 mt-10 padding-bottom-custom  border-t-2 flex flex-col gap-4 transition-colors duration-200 ${theme === 'dark'
          ? 'bg-gray-800 shadow-gray-900 border-gray-600'
          : 'bg-zinc-200 shadow-zinc-900 border-zinc-900'
          }`}>

          {/* Message Display */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm font-medium mb-4 border transition-colors duration-200 ${message.type === 'success'
              ? theme === 'dark'
                ? 'bg-green-900 text-green-200 border-green-700'
                : 'bg-green-100 text-green-800 border-green-200'
              : theme === 'dark'
                ? 'bg-red-900 text-red-200 border-red-700'
                : 'bg-red-100 text-red-800 border-red-200'
              }`}>
              {message.text}
            </div>
          )}

          {/* Page Title */}
          {/* <div className='mb-16'> */}
          <h1 className={`font-semibold text-lg text-center mb-4 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Statistics Overview</h1>

          {/* Statistics Tables */}
          <StatsTable
            title='Monthly Statistics'
            columns={[
              { label: 'Orders', key: 'totalOrders' },
              { label: 'Weight (kg)', key: 'totalWeight' },
              { label: 'Amount (₹)', key: 'totalAmount' }
            ]}
            data={stats}
            loading={loadingStates.stats}
          />
          <StatsTable
            title="Recent Orders"
            columns={[
              { label: 'Supplier', key: 'supplier' },
              { label: 'Date', key: 'createdAt' },
              { label: 'Amount (₹)', key: 'totalAmount' }
            ]}
            data={recentOrders}
            loading={loadingStates.recentOrders}
          />
          <StatsTable
            title="Top Products"
            columns={[
              { label: 'Product', key: 'name' },
              { label: 'Type', key: 'type' },
              { label: 'Quantity', key: 'totalQuantity' }
            ]}
            data={topProducts}
            loading={loadingStates.topProducts}
          />
          <StatsTable
            title="Top Suppliers"
            columns={[
              { label: 'Name', key: 'name' },
              { label: 'Contact', key: 'contact' },
              { label: 'Amount (₹)', key: 'totalPurchase' }
            ]}
            data={topSuppliers}
            loading={loadingStates.topSuppliers}
          />

          

          

          {/* </div> */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;