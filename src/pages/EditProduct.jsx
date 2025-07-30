import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useTheme } from '../context/ThemeContext'

/**
 * EditProduct Component
 * Handles product editing functionality with form validation and loading states
 * @returns {JSX.Element} EditProduct component
 */
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form state management
  const [form, setForm] = useState({
    name: "",
    type: "",
    mrp: "",
    rate: "",
    weight: "",
  });

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    fetchingProduct: false,
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
   * Fetch product data on component mount
   */
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        showMessage('Invalid product ID', 'error');
        navigate('/products');
        return;
      }

      setLoadingStates(prev => ({ ...prev, fetchingProduct: true }));

      try {
        const response = await axiosInstance.get(`/product/${id}`);
        const productData = response.data;

        setForm({
          name: productData.name || "",
          type: productData.type || "",
          mrp: productData.mrp || "",
          rate: productData.rate || "",
          weight: productData.weight || "",
        });

        showMessage('Product data loaded successfully', 'success');
      } catch (error) {
        const errorMessage = error.response?.data?.msg ||
          error.response?.data?.message ||
          'Failed to load product data';
        showMessage(errorMessage, 'error');

        // Navigate back to products list after a delay
        setTimeout(() => {
          navigate('/products');
        }, 3000);
      } finally {
        setLoadingStates(prev => ({ ...prev, fetchingProduct: false }));
      }
    };

    fetchProduct();
  }, [id, navigate]);

  /**
   * Validate form data before submission
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    if (!form.name?.trim()) {
      showMessage('Product name is required', 'error');
      return false;
    }
    if (!form.type?.trim()) {
      showMessage('Product type is required', 'error');
      return false;
    }
    if (!form.mrp || parseFloat(form.mrp) <= 0) {
      showMessage('Valid MRP is required', 'error');
      return false;
    }
    if (!form.rate || parseFloat(form.rate) <= 0) {
      showMessage('Valid rate is required', 'error');
      return false;
    }
    if (parseFloat(form.rate) > parseFloat(form.mrp)) {
      showMessage('Rate cannot be higher than MRP', 'error');
      return false;
    }
    if (!form.weight?.trim()) {
      showMessage('Product weight is required', 'error');
      return false;
    }
    return true;
  };

  /**
   * Handle product update submission
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
      await axiosInstance.put(`/product/${id}`, form);
      showMessage('Product updated successfully!', 'success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(`/product-profile/${id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Failed to update product. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
      {/* Loading overlay for initial data fetch */}
      {loadingStates.fetchingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg flex items-center gap-3 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading product data...</span>
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
        <h2 className={`text-2xl font-bold text-center mb-4 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Edit Product</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Product Name Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Product Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter product name"
              disabled={loadingStates.updating || loadingStates.fetchingProduct}
              required
            />
          </div>

          {/* Product Type Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Product Type <span className="text-red-500">*</span></label>
            <input
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter product type"
              disabled={loadingStates.updating || loadingStates.fetchingProduct}
              required
            />
          </div>

          {/* MRP Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>MRP (₹) <span className="text-red-500">*</span></label>
            <input
              value={form.mrp}
              onChange={e => setForm({ ...form, mrp: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter maximum retail price"
              disabled={loadingStates.updating || loadingStates.fetchingProduct}
              required
            />
          </div>

          {/* Rate Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Rate (₹) <span className="text-red-500">*</span></label>
            <input
              value={form.rate}
              onChange={e => setForm({ ...form, rate: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter selling rate"
              disabled={loadingStates.updating || loadingStates.fetchingProduct}
              required
            />
            <small className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Rate should not exceed MRP</small>
          </div>

          {/* Weight Field */}
          <div className='flex flex-col gap-2'>
            <label className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Weight <span className="text-red-500">*</span></label>
            <input
              value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
              className={`border p-3 rounded-md outline-none focus:ring-1 transition-colors duration-200 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                }`}
              type="text"
              placeholder="Enter weight (e.g., 1kg, 500g, 2L)"
              disabled={loadingStates.updating || loadingStates.fetchingProduct}
              required
            />
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mt-6 w-full'>
        <Link
          to={`/product-profile/${id}`}
          className={`flex-1 px-6 py-3 rounded-md text-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
        >
          Cancel
        </Link>

        <button
          onClick={handleUpdate}
          disabled={loadingStates.updating || loadingStates.fetchingProduct}
          className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${loadingStates.updating || loadingStates.fetchingProduct
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

export default EditProduct