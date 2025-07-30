import React, { useEffect, useState } from 'react'
import defaultAvatar from '../assets/logo.png'
import axiosInstance from '../api/axiosInstance'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useTheme } from '../context/ThemeContext'

/**
 * ProductProfile Component
 * Displays product details with edit and delete functionality
 * @returns {JSX.Element} ProductProfile component
 */
function ProductProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Product data state
  const [productProfile, setProductProfile] = useState({});

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    fetchingProduct: false,
    deleting: false,
  });

  // Message state for user feedback
  const [message, setMessage] = useState({
    text: '',
    type: '', // 'success', 'error', 'info'
  });

  // Confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        setProductProfile(response.data);
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
   * Handle product deletion with confirmation
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm product deletion
   */
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoadingStates(prev => ({ ...prev, deleting: true }));

    try {
      await axiosInstance.delete(`/product/${id}`);
      showMessage('Product deleted successfully!', 'success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Failed to delete product. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  };

  /**
   * Cancel deletion
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      {/* Loading overlay for initial data fetch */}
      {loadingStates.fetchingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg flex items-center gap-3 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading product data...</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full mx-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Confirm Deletion</h3>
            <p className={`mb-6 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
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

      <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
        {/* Product Header Card */}
        <div className={`rounded-xl shadow w-full flex justify-between items-center mt-8 p-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className='flex items-center gap-4'>
            <div>
              <img
                src={defaultAvatar}
                alt='Product'
                className='w-12 h-12 rounded-full object-cover'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{productProfile.name || 'Loading...'}</h1>
              {productProfile.type && (
                <p className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{productProfile.type}</p>
              )}
            </div>
          </div>
          {!loadingStates.fetchingProduct && (
            <Link
              to={`/edit-product/${id}`}
              className={`flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <span>
                <FaRegEdit className={`text-xs cursor-pointer transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-zinc-900'}`} />
              </span>
              <span className='text-sm'>Edit</span>
            </Link>
          )}
        </div>

        {/* Product Details Card */}
        <div className={`rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className='flex justify-between items-center'>
            <h3 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Product Details</h3>
            {!loadingStates.fetchingProduct && (
              <Link
                to={`/edit-product/${id}`}
                className={`flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <span>
                  <FaRegEdit className={`text-xs cursor-pointer transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-zinc-900'}`} />
                </span>
                <span className='text-sm'>Edit</span>
              </Link>
            )}
          </div>

          {loadingStates.fetchingProduct ? (
            <div className="flex items-center justify-center py-8">
              <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
              <span className={`ml-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Loading details...</span>
            </div>
          ) : (
            <div className='flex flex-col text-sm gap-3'>
              <div className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Type:</span>
                <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{productProfile.type || '-'}</span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>MRP:</span>
                <span className={`font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {productProfile.mrp ? `₹${parseFloat(productProfile.mrp).toFixed(2)}` : '-'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Rate:</span>
                <span className={`font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {productProfile.rate ? `₹${parseFloat(productProfile.rate).toFixed(2)}` : '-'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Weight:</span>
                <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{productProfile.weight || '-'}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className={`font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Supplier:</span>
                <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {productProfile.supplierId ? productProfile.supplierId.name : 'No Supplier'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Actions Card */}
        <div className={`rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Product Actions</h3>
          <div className="space-y-3">
            <Link
              to={`/edit-product/${id}`}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2'
            >
              <FaRegEdit />
              Edit Product
            </Link>
            <button
              className={`w-full px-4 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2 ${loadingStates.deleting || loadingStates.fetchingProduct
                ? 'bg-red-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                } text-white`}
              onClick={handleDeleteClick}
              disabled={loadingStates.deleting || loadingStates.fetchingProduct}
            >
              {loadingStates.deleting ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductProfile