import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { GiPlagueDoctorProfile } from 'react-icons/gi';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useTheme } from '../context/ThemeContext';

/**
 * NavHeader Component - Navigation Header
 * Provides page title and back navigation functionality
 * Features responsive design and dynamic page detection
 * @returns {JSX.Element} NavHeader component
 */
function NavHeader() {
   // Use React Router hooks for better navigation handling
   const location = useLocation();
   const navigate = useNavigate();
   const { theme } = useTheme();

   // Get current pathname for page detection
   const pathname = location.pathname;
   /**
    * Extract ID from dynamic routes
    * @param {string} path - Current pathname
    * @param {string} route - Route pattern to match
    * @returns {string|null} Extracted ID or null
    */
   const extractIdFromPath = (path, route) => {
      const segments = path.split(route);
      return segments.length > 1 ? segments[1] : null;
   };

   // Extract IDs from dynamic routes for better route matching
   const supplierProfileId = extractIdFromPath(pathname, '/supplier-profile/');
   const productProfileId = extractIdFromPath(pathname, '/product-profile/');
   const editProductId = extractIdFromPath(pathname, '/edit-product/');
   const editSupplierId = extractIdFromPath(pathname, '/edit-supplier/');

   /**
    * Page title mapping for better maintainability and extensibility
    */
   const pageRoutes = {
      '/dashboard': 'Dashboard',
      '/history': 'History',
      '/products': 'Products',
      '/suppliers': 'Suppliers',
      '/create-order': 'Create Order',
      '/user-profile': 'User Profile',
      '/about': 'About',
      '/stock-report': 'Stock Report',
      '/edit-profile': 'Edit Profile',
      '/login': 'Login',
      '/register': 'Register',
      '/': 'Home'
   };

   /**
    * Detect current page title based on pathname
    * Handles both static and dynamic routes
    * @returns {string} Page title
    */
   const detectPageTitle = () => {
      // Check static routes first
      if (pageRoutes[pathname]) {
         return pageRoutes[pathname];
      }

      // Handle dynamic routes
      if (supplierProfileId) return 'Supplier Profile';
      if (productProfileId) return 'Product Profile';
      if (editProductId) return 'Edit Product';
      if (editSupplierId) return 'Edit Supplier';

      // Fallback for unknown routes
      return 'OrderSathi';
   };

   /**
    * Handle back navigation with smart routing
    * Uses browser history when available, otherwise navigates to logical parent
    */
   const handleBackNavigation = () => {
      // Check if we can go back in browser history
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         // Fallback navigation based on current route
         if (supplierProfileId || editSupplierId) {
            navigate('/suppliers');
         } else if (productProfileId || editProductId) {
            navigate('/products');
         } else if (pathname === '/edit-profile') {
            navigate('/user-profile');
         } else {
            // Default fallback to dashboard
            navigate('/dashboard');
         }
      }
   };

   /**
    * Determine if back button should be shown
    * Hide on main dashboard, show on all other pages
    * @returns {boolean} Whether to show back button
    */
   const shouldShowBackButton = () => {
      const hideBackButtonRoutes = ['/dashboard', '/login', '/register'];
      return !hideBackButtonRoutes.includes(pathname);
   };

   return (
      <header
         className={`fixed w-full max-w-[500px] h-12 sm:h-14 md:h-16 flex top-0 justify-start items-center shadow-md px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 gap-2 sm:gap-3 md:gap-4 border-b-2 z-40 transition-colors duration-200 ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-zinc-300'
            }`}
         role="banner"
         aria-label="Navigation header"
      >
         <div className='w-full flex justify-start items-center gap-2 sm:gap-3 md:gap-4'>
            {/* Back Navigation Button */}
            {shouldShowBackButton() && (
               <button
                  onClick={handleBackNavigation}
                  className={`p-1 sm:p-1.5 md:p-2 rounded-full shadow-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${theme === 'dark'
                     ? 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200'
                     : 'border-zinc-400 hover:border-zinc-600 bg-white hover:bg-gray-50 text-gray-700'
                     }`}
                  aria-label="Go back to previous page"
                  title="Go back"
               >
                  <MdOutlineKeyboardArrowLeft className='text-base sm:text-lg md:text-xl' />
               </button>
            )}

            {/* App Logo (Optional - shown on dashboard) */}
            {pathname === '/dashboard' && (
               <div className='flex items-center gap-2'>
                  <img
                     src={logo}
                     alt="OrderSathi Logo"
                     className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full object-cover'
                  />
               </div>
            )}

            {/* Page Title */}
            <h1 className={`text-sm sm:text-base md:text-lg font-medium truncate flex-1 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
               {detectPageTitle()}
            </h1>

            {/* Additional Actions Placeholder */}
            <div className='flex items-center gap-1 sm:gap-2'>
               {/* Future: Add action buttons like settings, notifications, etc. */}
               {pathname === '/dashboard' && (
                  <Link
                     to="/user-profile"
                     className={`p-1 sm:p-1.5 md:p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                     aria-label="Go to user profile"
                     title="User Profile"
                  >
                     <GiPlagueDoctorProfile className={`text-base sm:text-lg md:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </Link>
               )}
            </div>
         </div>
      </header>
   )
}

export default NavHeader