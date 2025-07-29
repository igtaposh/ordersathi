import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdBrightness6 } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';


/**
 * SideNave Component - Navigation Sidebar
 * Provides navigation options, settings, and logout functionality
 * Features responsive design with appearance toggle and user actions
 * Includes dark/light theme switching functionality
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isClosed - Controls sidebar visibility
 * @param {Function} props.onClose - Callback function to close sidebar
 * @returns {JSX.Element} SideNave component
 */
function SideNave({ isClosed, onClose }) {
  // Context for user authentication state
  const { user, setUser } = useContext(AuthContext);
  const { token, setToken } = useContext(AuthContext);

  // Global theme context
  const { theme, toggleTheme } = useTheme();

  // Local state management
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: '', // 'success', 'error', 'info'
  });

  /**
   * Display message to user with auto-hide functionality
   * @param {string} text - Message text
   * @param {string} type - Message type (success/error/info)
   */
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  /**
   * Handle user logout with proper error handling and feedback
   * Clears all authentication data and provides user feedback
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const res = await axiosInstance.post('/auth/logout');

      if (res.status === 200) {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
        setToken(null);

        showMessage('Logged out successfully!', 'success');

        // Close sidebar after successful logout
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg ||
        error.response?.data?.message ||
        'Logout failed. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Handle appearance toggle and theme switching
   */
  const handleAppearanceToggle = () => {
    setIsAppearanceOpen(!isAppearanceOpen);
  };

  /**
   * Handle theme toggle with feedback message
   */
  const handleThemeToggle = () => {
    toggleTheme();
    // Show theme change feedback
    showMessage(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'success');
  };

  return (
    <>
      {/* Message display */}
      {message.text && (
        <div className={`fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-[60] px-3 sm:px-4 py-2 rounded-lg shadow-lg transition-all duration-300 max-w-[90vw] sm:max-w-md text-center text-sm sm:text-base ${message.type === 'success' ? 'bg-green-500 text-white' :
          message.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
          {message.text}
        </div>
      )}

      {/* Sidebar Container */}
      <div
        className={`top-0 right-0 h-dvh w-full sm:w-80 md:w-96 lg:w-[400px] max-w-[90vw] shadow-2xl transition-transform duration-300 z-50 flex flex-col ${theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-zinc-100'
          } ${isClosed ? 'fixed' : 'hidden'}`}
        role="navigation"
        aria-label="Settings sidebar"
      >
        {/* Sidebar Header */}
        <header className={`w-full flex justify-start items-center p-3 sm:p-4 gap-3 sm:gap-4 border-b-2 transition-colors duration-200 ${theme === 'dark'
          ? 'border-gray-700 bg-gray-800'
          : 'border-zinc-300 bg-white'
          }`}>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            aria-label="Close settings sidebar"
          >
            <MdKeyboardArrowRight className='text-lg sm:text-xl' />
          </button>
          <h2 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Settings</h2>
        </header>

        {/* Sidebar Content */}
        <main className='flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 flex-1 overflow-y-auto'>
          {/* User Information Section */}
          {user && (
            <section className={`rounded-lg shadow-md p-3 sm:p-4 border transition-colors duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
              }`}>
              <h3 className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Logged in as:</h3>
              <div className='flex items-center gap-2 sm:gap-3'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-orange-600 font-semibold text-sm sm:text-lg'>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className={`font-medium text-sm sm:text-base truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{user.name || 'User'}</p>
                  <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email || 'No email'}</p>
                </div>
              </div>
            </section>
          )}

          {/* Appearance Settings */}
          <section className={`rounded-lg shadow-md border transition-colors duration-200 ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            }`}>
            <button
              onClick={handleAppearanceToggle}
              className={`flex justify-between items-center w-full p-3 sm:p-4 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg ${theme === 'dark'
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-50'
                }`}
              aria-expanded={isAppearanceOpen}
              aria-controls="appearance-options"
            >
              <div className='flex items-center gap-2 sm:gap-3'>
                <MdBrightness6 className={`text-lg sm:text-xl flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`font-medium capitalize text-sm sm:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Appearance</span>
              </div>
              <MdKeyboardArrowDown
                className={`text-base sm:text-lg transition-transform duration-200 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${isAppearanceOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Appearance Options */}
            <div
              id="appearance-options"
              className={`overflow-hidden transition-all duration-300 ${isAppearanceOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              {/* Light Theme Option */}
              <button
                onClick={handleThemeToggle}
                className={`flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 pl-4 sm:pl-6 transition-colors duration-200 border-t focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-100 hover:bg-gray-50'
                  } ${theme === 'light' ? (theme === 'dark' ? 'bg-blue-900 border-l-4 border-l-blue-400' : 'bg-blue-50 border-l-4 border-l-blue-500') : ''}`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <HiOutlineLightBulb className={`text-base sm:text-lg flex-shrink-0 ${theme === 'light' ? 'text-blue-500' : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500')}`} />
                <span className={`capitalize text-sm sm:text-base ${theme === 'light' ? (theme === 'dark' ? 'text-blue-300 font-medium' : 'text-blue-700 font-medium') : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}`}>Light</span>
                {theme === 'light' && <span className={`ml-auto text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Active</span>}
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={handleThemeToggle}
                className={`flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 pl-4 sm:pl-6 transition-colors duration-200 border-t focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-100 hover:bg-gray-50'
                  } ${theme === 'dark' ? (theme === 'dark' ? 'bg-blue-900 border-l-4 border-l-blue-400' : 'bg-blue-50 border-l-4 border-l-blue-500') : ''}`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                <MdOutlineDarkMode className={`text-base sm:text-lg flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-600'}`} />
                <span className={`capitalize text-sm sm:text-base ${theme === 'dark' ? (theme === 'dark' ? 'text-blue-300 font-medium' : 'text-blue-700 font-medium') : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}`}>Dark</span>
                {theme === 'dark' && <span className={`ml-auto text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Active</span>}
              </button>
            </div>
          </section>

          {/* Logout Button */}
          <section className='mt-auto pt-2 sm:pt-4'>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className='flex items-center justify-center gap-2 sm:gap-3 w-full p-3 sm:p-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
              aria-label="Logout from application"
            >
              {isLoggingOut ? (
                <>
                  <AiOutlineLoading3Quarters className='text-base sm:text-lg animate-spin flex-shrink-0' />
                  <span className='font-medium text-sm sm:text-base'>Logging out...</span>
                </>
              ) : (
                <>
                  <HiOutlineLogout className='text-base sm:text-lg flex-shrink-0' />
                  <span className='font-medium text-sm sm:text-base'>Logout</span>
                </>
              )}
            </button>
          </section>
        </main>
      </div>

      {/* Backdrop Overlay */}
      {isClosed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}

export default SideNave