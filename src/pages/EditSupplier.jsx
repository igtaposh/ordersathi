import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useTheme } from '../context/ThemeContext'

/**
 * EditSupplier Component
 * Handles supplier editing functionality with form validation and loading states
 * @returns {JSX.Element} EditSupplier component
 */
function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form state management
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
  });

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    fetchingSupplier: false,
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
   * Fetch supplier data on component mount
   */
  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) {
        showMessage('Invalid supplier ID', 'error');
        navigate('/suppliers');
        return;
      }

      setLoadingStates(prev => ({ ...prev, fetchingSupplier: true }));

      try {
        const response = await axiosInstance.get(`/supplier/${id}`);
        const supplierData = response.data;

        setForm({
          name: supplierData.name || "",
          contact: supplierData.contact || "",
          address: supplierData.address || "",
        });

        showMessage('Supplier data loaded successfully', 'success');
      } catch (error) {
        const errorMessage = error.response?.data?.msg ||
          error.response?.data?.message ||
          'Failed to load supplier data';
        showMessage(errorMessage, 'error');

        // Navigate back to suppliers list after a delay
        setTimeout(() => {
          navigate('/suppliers');
        }, 3000);
      } finally {
        setLoadingStates(prev => ({ ...prev, fetchingSupplier: false }));
      }
    };

    fetchSupplier();
  }, [id, navigate]);

  /**
   * Validate form data before submission
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    if (!form.name?.trim()) {
      showMessage('Supplier name is required', 'error');
      return false;
    }
    if (!form.contact?.trim()) {
      showMessage('Contact number is required', 'error');
      return false;
    }
    if (!form.address?.trim()) {
      showMessage('Address is required', 'error');
      return false;
    }

    // Email validation

    // Contact validation (basic phone number check)
    const contactRegex = /^[\d\-\+\(\)\s]+$/;
    if (!contactRegex.test(form.contact)) {
      showMessage('Please enter a valid contact number', 'error');
      return false;
    }

    return true;
  };

  /**
   * Handle supplier update submission
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
      await axiosInstance.put(`/supplier/${id}`, form);
      showMessage('Supplier updated successfully!', 'success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(`/supplier-profile/${id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Failed to update supplier. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
      {/* Loading overlay for initial data fetch */}
      {loadingStates.fetchingSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg flex items-center gap-3 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading supplier data...</span>
          </div>
        </div>
      )}

      {/* Message display */}
      {message.text && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${message.type === 'success'
          ? theme === 'dark'
            ? 'bg-green-900 text-green-200 border border-green-700'
            : 'bg-green-500 text-white'
          : message.type === 'error'
            ? theme === 'dark'
              ? 'bg-red-900 text-red-200 border border-red-700'
              : 'bg-red-500 text-white'
            : theme === 'dark'
              ? 'bg-blue-900 text-blue-200 border border-blue-700'
              : 'bg-blue-500 text-white'
          }`}>
          {message.text}
        </div>
      )}

      <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col p-6 gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-4 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Edit Supplier</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Supplier Name Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Supplier Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter supplier name"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          {/* Contact Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Contact Number <span className="text-red-500">*</span></label>
            <input
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="tel"
              placeholder="Enter contact number"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          {/* Address Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Address <span className="text-red-500">*</span></label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 resize-vertical min-h-[80px] ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              placeholder="Enter complete address"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          
        </form>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mt-6 w-full'>
        <Link
          to={`/supplier-profile/${id}`}
          className={`flex-1 px-6 py-3 rounded-md text-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
        >
          Cancel
        </Link>

        <button
          onClick={handleUpdate}
          disabled={loadingStates.updating || loadingStates.fetchingSupplier}
          className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${loadingStates.updating || loadingStates.fetchingSupplier
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            } text-white`}
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

export default EditSupplier