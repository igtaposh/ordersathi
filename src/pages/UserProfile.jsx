import React, { useContext, useState } from 'react';
import NavHeader from '../components/NavHeader';
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/logo.png';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';

/**
 * UserProfile component - Displays and manages user profile information
 * Allows users to view profile details, edit profile, logout, and delete account
 */
function UserProfile() {
   // Context hooks
   const { user, setUser, setToken } = useContext(AuthContext);
   const navigate = useNavigate();
   const { theme } = useTheme();

   // Form state
   const [editMode, setEditMode] = useState(false);
   const [form, setForm] = useState({
      userName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      shopName: user?.shopName || "",
   });

   // Loading states for different actions
   const [loadingStates, setLoadingStates] = useState({
      updating: false,
      deleting: false,
      logout: false
   });

   // Message state for success/error feedback
   const [message, setMessage] = useState({ type: '', text: '' });

   // Clear messages after 5 seconds
   React.useEffect(() => {
      if (message.text) {
         const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [message]);


   /**
    * Handles profile update
    * @param {Event} e - Form submit event
    */
   const handleUpdate = async (e) => {
      e.preventDefault();

      // Validation
      if (!form.userName.trim()) {
         setMessage({ type: 'error', text: 'User name is required' });
         return;
      }

      setLoadingStates(prev => ({ ...prev, updating: true }));
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         const res = await axiosInstance.put('/auth/update-profile', form);
         setUser(res.data.user);
         setEditMode(false);
         setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } catch (err) {
         const errorMessage = err.response?.data?.msg || 'Failed to update profile. Please try again.';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setLoadingStates(prev => ({ ...prev, updating: false }));
      }
   };

   /**
    * Handles account deletion with confirmation
    */
   const handleDelete = async () => {
      // Confirmation dialog
      if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
         return;
      }

      setLoadingStates(prev => ({ ...prev, deleting: true }));
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         await axiosInstance.delete('/auth/delete-account');

         // Clear user data
         setUser(null);
         setToken(null);
         setAuthToken(null);
         localStorage.removeItem('token');
         localStorage.removeItem('user');

         setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });

         // Small delay before navigation to show success message
         setTimeout(() => {
            navigate('/register');
         }, 2000);

      } catch (err) {
         const errorMessage = err.response?.data?.msg || 'Failed to delete account. Please try again.';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setLoadingStates(prev => ({ ...prev, deleting: false }));
      }
   };
   /**
    * Handles user logout
    */
   const handleLogout = async () => {
      setLoadingStates(prev => ({ ...prev, logout: true }));
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         const res = await axiosInstance.post('/auth/logout');
         if (res.status === 200) {
            // Clear user data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthToken(null);
            setUser(null);
            setToken(null);

            setMessage({ type: 'success', text: 'Logged out successfully. Redirecting...' });

            // Small delay before navigation to show success message
            setTimeout(() => {
               navigate('/login');
            }, 1500);
         }
      } catch (error) {
         const errorMessage = error.response?.data?.msg || 'Logout failed. Please try again.';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setLoadingStates(prev => ({ ...prev, logout: false }));
      }
   };

   return (
      <div>
         <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>

            {/* Message Display */}
            {message.text && (
               <div className={`w-full mt-4 p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${message.type === 'success'
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

            {/* Profile Header Section */}
            <div className={`rounded-xl shadow w-full flex justify-between items-center mt-8 p-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
               <div className='flex items-center gap-4'>
                  {/* Profile Avatar */}
                  <div>
                     <img
                        src={defaultAvatar}
                        alt='Profile'
                        className='w-12 h-12 rounded-full object-cover'
                     />
                  </div>

                  {/* Profile Basic Info */}
                  <div className='flex flex-col gap-1'>
                     <h1 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{form.userName}</h1>
                     <h5 className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{form.shopName}</h5>
                  </div>
               </div>

               {/* Edit Profile Link */}
               <Link
                  to="/edit-user"
                  className={`flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
               >
                  <span>
                     <FaRegEdit className='text-xs cursor-pointer' />
                  </span>
                  <span className='text-sm'>Edit</span>
               </Link>
            </div>

            {/* User Details Section */}
            <div className={`rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4 overflow-hidden transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
               <div className='flex justify-between items-center'>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Your Details</h3>
                  <Link
                     to="/edit-user"
                     className={`flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                     <span>
                        <FaRegEdit className='text-xs cursor-pointer' />
                     </span>
                     <span className='text-sm'>Edit</span>
                  </Link>
               </div>

               {/* User Information */}
               <div className='flex flex-col text-sm gap-2'>
                  <div className='flex justify-start gap-2'>
                     <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Email:</span>
                     <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user?.email || '-'}</span>
                  </div>
                  <div className='flex justify-start gap-2'>
                     <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Phone:</span>
                     <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user?.phone || '-'}</span>
                  </div>
                  <div className='flex justify-start gap-2'>
                     <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Role:</span>
                     <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user?.role || '-'}</span>
                  </div>
               </div>
            </div>

            {/* Account Actions Section */}
            <div className={`rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
               <h3 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Account Actions</h3>

               {/* Delete Account Button */}
               <button
                  className={`px-4 py-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2 ${loadingStates.deleting
                     ? `cursor-not-allowed opacity-60 ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-400 text-white'}`
                     : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                     } ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
                  onClick={handleDelete}
                  disabled={loadingStates.deleting}
               >
                  {loadingStates.deleting && (
                     <AiOutlineLoading3Quarters className='animate-spin' />
                  )}
                  <span>{loadingStates.deleting ? 'Deleting...' : 'Delete Account'}</span>
               </button>

               {/* Logout Button */}
               <button
                  onClick={handleLogout}
                  disabled={loadingStates.logout}
                  className={`px-4 py-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2 ${loadingStates.logout
                     ? `cursor-not-allowed opacity-60 ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-400 text-white'}`
                     : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                     } ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
               >
                  {loadingStates.logout && (
                     <AiOutlineLoading3Quarters className='animate-spin' />
                  )}
                  <span>{loadingStates.logout ? 'Logging out...' : 'Logout'}</span>
               </button>
            </div>
         </div>
      </div>
   );
}

export default UserProfile