import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

/**
 * EditSupplier Component
 * Handles supplier editing functionality with form validation and loading states
 * @returns {JSX.Element} EditSupplier component
 */
function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state management
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
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
          email: supplierData.email || "",
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
    if (!form.email?.trim()) {
      showMessage('Email is required', 'error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showMessage('Please enter a valid email address', 'error');
      return false;
    }

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
    <div className='max-w-[500px] w-screen min-h-screen bg-neutral-200 mx-auto p-4 flex flex-col items-center'>
      {/* Loading overlay for initial data fetch */}
      {loadingStates.fetchingSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading supplier data...</span>
          </div>
        </div>
      )}

      {/* Message display */}
      {message.text && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' :
            message.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
          }`}>
          {message.text}
        </div>
      )}

      <div className='bg-white shadow-md rounded-xl mt-8 w-full flex flex-col p-6 gap-4'>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Edit Supplier</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Supplier Name Field */}
          <div className='flex flex-col gap-2'>
            <label className="font-medium text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className='border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
              type="text"
              placeholder="Enter supplier name"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          {/* Contact Field */}
          <div className='flex flex-col gap-2'>
            <label className="font-medium text-gray-700">Contact Number <span className="text-red-500">*</span></label>
            <input
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              className='border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
              type="tel"
              placeholder="Enter contact number"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          {/* Address Field */}
          <div className='flex flex-col gap-2'>
            <label className="font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className='border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-vertical min-h-[80px]'
              placeholder="Enter complete address"
              disabled={loadingStates.updating || loadingStates.fetchingSupplier}
              required
            />
          </div>

          {/* Email Field */}
          <div className='flex flex-col gap-2'>
            <label className="font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className='border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
              type="email"
              placeholder="Enter email address"
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
          className='flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md text-center transition-colors'
        >
          Cancel
        </Link>

        <button
          onClick={handleUpdate}
          disabled={loadingStates.updating || loadingStates.fetchingSupplier}
          className='flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2'
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