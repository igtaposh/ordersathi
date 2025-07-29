import React, { useContext } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import logo_image from '../assets/logo.png';
import { FiAlertCircle } from "react-icons/fi";
import { MdAddShoppingCart, MdDownloading } from "react-icons/md";
import NavHeader from './NavHeader';
import { HiOutlineDocumentReport, HiOutlineUserGroup } from 'react-icons/hi';
import { GiWineBottle } from 'react-icons/gi';
import { useTheme } from '../context/ThemeContext';
import { TbChartHistogram } from "react-icons/tb";

const Layout = () => {
  const navigate = useNavigate();
  const { user, setToken } = useContext(AuthContext);
  const { theme } = useTheme();
  const location = window.location.pathname;

  // const handleLogout = async () => {
  //   try {
  //     const res = await axiosInstance.post('/auth/logout');
  //     console.log(res.data);
  //     setAuthToken(null);
  //     setToken(null);
  //     navigate('/login');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  return (

    <div className={`max-w-[500px] mx-auto top-0 w-full flex flex-col justify-between items-center p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* nav bar */}

      <div className={`fixed bottom-0 max-w-[500px] w-full flex justify-between items-center p-[10px] z-50 transition-colors duration-200 border-t-4 border-gray-200 ${theme === 'dark'
        ? 'bg-gray-800 border-t border-gray-700'
        : 'bg-white'
        }`}>
        {location != '/dashboard' ? null : (
          <div className='flex flex-col absolute gap-2 right-2 bottom-24 '>
            <div className={`text-sm border px-4 py-2 rounded-xl flex gap-2 items-center justify-center transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-zinc-950 text-zinc-950'
              }`}>
              <span>
                <HiOutlineDocumentReport className={`text-xl inline-block ${theme === 'dark' ? 'text-gray-100' : 'text-zinc-950'}`} />
              </span>
              <Link to='/stock-report' className='font-semibold'>Stock Report</Link>
            </div>
            <div className={`text-sm border px-4 py-2 rounded-xl flex gap-2 items-center justify-center transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-zinc-950 text-zinc-950'
              }`}>
              <span>
                <MdAddShoppingCart className={`text-xl inline-block ${theme === 'dark' ? 'text-gray-100' : 'text-zinc-950'}`} />
              </span>
              <Link to='/create-order' className='font-semibold'>Create Order</Link>
            </div>
            <div className={`text-sm border px-4 py-2 rounded-xl flex gap-2 items-center justify-start transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-zinc-950 text-zinc-950'
              }`}>
              <span>
                <HiOutlineUserGroup className={`text-xl inline-block ${theme === 'dark' ? 'text-gray-100' : 'text-zinc-950'}`} />
              </span>
              <Link to='/suppliers' className='font-semibold'>Suppliers</Link>
            </div>
            <div className={`text-sm border px-4 py-2 rounded-xl flex gap-2 items-center justify-start transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100'
              : 'bg-white border-zinc-950 text-zinc-950'
              }`}>
              <span>
                <GiWineBottle className={`text-xl inline-block ${theme === 'dark' ? 'text-gray-100' : 'text-zinc-950'}`} />
              </span>
              <Link to='/products' className='font-semibold'>Products</Link>
            </div>
          </div>
        )}

        <Link to='/'>
          <div className={`${location === '/dashboard'
            ? `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-gray-200'}`
            : `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
            }`}>
            <div className={`text-lg transition-colors duration-200 ${location === '/dashboard'
              ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <TbChartHistogram />
            </div>
            <span>Dashboard</span>
          </div>
        </Link>

        <Link to='/history'>
          <div className={`${location === '/history'
            ? `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-gray-200'}`
            : `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
            }`}>
            <div className={`text-lg transition-colors duration-200 ${location === '/history'
              ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <MdDownloading />
            </div>
            <span>History</span>
          </div>
        </Link>

        <Link to='/about'>
          <div className={`${location === '/about'
            ? `flex flex-col items-center font-semibold text-[0.6rem] px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-gray-200'}`
            : `flex flex-col items-center justify-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-95 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
            }`}>
            <div className={`text-lg transition-colors duration-200 ${location === '/about'
              ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiAlertCircle />
            </div>
            <span>About</span>
          </div>
        </Link>



        <Link to='/user-profile'>
          <div className={`${location === '/user-profile'
            ? `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-gray-200'}`
            : `flex flex-col items-center text-[0.6rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
            }`}>
            <div className={`text-lg w-4 h-4 p-2 rounded-full flex justify-center items-center transition-colors duration-200 bg-orange-100`}>
              <span className='text-orange-600 font-semibold text-xs sm:text-lg text-center'>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span>Profile</span>
          </div>
        </Link>
      </div>

      {/* Page Content */}
      <div>
        <div>

          {location === '/dashboard' ? null : <NavHeader />}
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;