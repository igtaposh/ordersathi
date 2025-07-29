import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

/**
 * EditProfile Component
 * Handles user profile editing functionality with form validation and loading states
 * @returns {JSX.Element} EditProfile component
 */
function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Form state management
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    shopName: user?.shopName || "",
  });

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    fetchingUser: false,
    updating: false,
  });

  // Message state for user feedback
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
    }, 5000);
  };

  /**
   * Fetch user profile data on component mount
   */
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingStates(prev => ({ ...prev, fetchingUser: true }));
      try {
        const response = await axiosInstance.get('/auth/user-profile');
        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        setUser(response.data.user);
        // Update form with fresh user data
        setForm({
          name: response.data.user?.name || "",
          email: response.data.user?.email || "",
          phone: response.data.user?.phone || "",
          shopName: response.data.user?.shopName || "",
        });
      } catch (error) {
        showMessage('Failed to load user data. Please refresh the page.', 'error');
      } finally {
        setLoadingStates(prev => ({ ...prev, fetchingUser: false }));
      }
    };

    fetchUser();
  }, [setUser]);


  /**
   * Validate form data before submission
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    if (!form.name?.trim()) {
      showMessage('Name is required', 'error');
      return false;
    }
    if (!form.email?.trim()) {
      showMessage('Email is required', 'error');
      return false;
    }
    if (!form.phone?.trim()) {
      showMessage('Phone number is required', 'error');
      return false;
    }
    if (!form.shopName?.trim()) {
      showMessage('Shop name is required', 'error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showMessage('Please enter a valid email address', 'error');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(form.phone)) {
      showMessage('Please enter a valid phone number', 'error');
      return false;
    }

    return true;
  };

  /**
   * Handle profile update submission
   * @param {Event} e - Form submit event
   */
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, updating: true }));

    try {
      const res = await axiosInstance.put('/auth/update-profile', form);
      setUser(res.data.user);
      showMessage('Profile updated successfully!', 'success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/user-profile');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Failed to update profile. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
      {/* Loading overlay for initial data fetch */}
      {loadingStates.fetchingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg flex items-center gap-3 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading profile data...</span>
          </div>
        </div>
      )}

      {/* Message display */}
      {message.text && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${message.type === 'success'
          ? theme === 'dark'
            ? 'bg-green-800 text-green-200 border border-green-700'
            : 'bg-green-500 text-white'
          : message.type === 'error'
            ? theme === 'dark'
              ? 'bg-red-800 text-red-200 border border-red-700'
              : 'bg-red-500 text-white'
            : theme === 'dark'
              ? 'bg-blue-800 text-blue-200 border border-blue-700'
              : 'bg-blue-500 text-white'
          }`}>
          {message.text}
        </div>
      )}

      <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col p-6 gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-4 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Edit Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Name Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`p-3 rounded-md outline-none transition-colors duration-200 border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter your full name"
              disabled={loadingStates.updating}
              required
            />
          </div>

          {/* Shop Name Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Shop Name <span className="text-red-500">*</span></label>
            <input
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className={`p-3 rounded-md outline-none transition-colors duration-200 border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter your shop name"
              disabled={loadingStates.updating}
              required
            />
          </div>

          {/* Phone Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Phone <span className="text-red-500">*</span></label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`p-3 rounded-md outline-none transition-colors duration-200 border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              type="tel"
              placeholder="Enter your phone number"
              disabled={loadingStates.updating}
              required
            />
          </div>

          {/* Email Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Email <span className="text-red-500">*</span></label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`p-3 rounded-md outline-none transition-colors duration-200 border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              type="email"
              placeholder="Enter your email address"
              disabled={loadingStates.updating}
              required
            />
          </div>

          {/* Role Field (Read-only) */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Role</label>
            <input
              value={user?.role || 'User'}
              className={`p-3 rounded-md cursor-not-allowed transition-colors duration-200 border ${theme === 'dark'
                ? 'bg-gray-600 border-gray-500 text-gray-300'
                : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
              type="text"
              disabled
              readOnly
            />
            <small className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Role cannot be changed</small>
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mt-6 mb-16 w-full'>
        <Link
          to="/user-profile"
          className={`flex-1 px-6 py-3 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark'
            ? 'bg-gray-600 hover:bg-gray-700 text-gray-200 focus:ring-gray-500 focus:ring-offset-gray-900'
            : 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400 focus:ring-offset-white'
            }`}
        >
          Cancel
        </Link>

        <button
          onClick={handleUpdate}
          disabled={loadingStates.updating || loadingStates.fetchingUser}
          className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${loadingStates.updating || loadingStates.fetchingUser
            ? theme === 'dark'
              ? 'bg-blue-600 opacity-50 cursor-not-allowed text-gray-300'
              : 'bg-blue-300 cursor-not-allowed text-white'
            : theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-900'
              : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400 focus:ring-offset-white'
            }`}
        >
          {loadingStates.updating ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}

export default EditProfile