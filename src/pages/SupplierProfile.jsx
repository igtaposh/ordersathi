import React, { useContext, useEffect, useState } from 'react'
import defaultAvatar from '../assets/logo.png'
import axiosInstance from '../api/axiosInstance'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaRegEdit } from "react-icons/fa";
import { SupplierContext } from '../context/SupplierContext'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

/**
 * SupplierProfile Component
 * Displays supplier details with edit and delete functionality
 * @returns {JSX.Element} SupplierProfile component
 */
function SupplierProfile() {
  const { id } = useParams();
  const { supplier, setSupplier } = useContext(SupplierContext);
  const navigate = useNavigate();

  // Supplier data state
  const [supplierProfile, setSupplierProfile] = useState({});

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    fetchingSupplier: false,
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
        setSupplierProfile(response.data);
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
   * Handle supplier deletion with confirmation
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm supplier deletion
   */
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoadingStates(prev => ({ ...prev, deleting: true }));

    try {
      await axiosInstance.delete(`/supplier/${id}`);
      setSupplier(null);
      showMessage('Supplier deleted successfully!', 'success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/suppliers');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Failed to delete supplier. Please try again.';
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
      {loadingStates.fetchingSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span>Loading supplier data...</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this supplier? This action cannot be undone and will also affect any associated products.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' :
            message.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
          }`}>
          {message.text}
        </div>
      )}

      <div className='max-w-[500px] w-screen min-h-screen bg-neutral-200 mx-auto p-4 flex flex-col items-center'>
        {/* Supplier Header Card */}
        <div className='rounded-xl shadow w-full flex bg-white justify-between items-center mt-8 p-4'>
          <div className='flex items-center gap-4'>
            <div>
              <img
                src={defaultAvatar}
                alt='Supplier'
                className='w-12 h-12 rounded-full object-cover'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='text-lg font-semibold'>{supplierProfile.name || 'Loading...'}</h1>
              {supplierProfile.email && (
                <p className='text-sm text-gray-600'>{supplierProfile.email}</p>
              )}
            </div>
          </div>
          {!loadingStates.fetchingSupplier && (
            <Link
              to={`/edit-supplier/${id}`}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
            >
              <span>
                <FaRegEdit className='text-zinc-900 text-xs cursor-pointer' />
              </span>
              <span className='text-sm'>Edit</span>
            </Link>
          )}
        </div>

        {/* Supplier Details Card */}
        <div className='bg-white rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Supplier Details</h3>
            {!loadingStates.fetchingSupplier && (
              <Link
                to={`/edit-supplier/${id}`}
                className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
              >
                <span>
                  <FaRegEdit className='text-zinc-900 text-xs cursor-pointer' />
                </span>
                <span className='text-sm'>Edit</span>
              </Link>
            )}
          </div>

          {loadingStates.fetchingSupplier ? (
            <div className="flex items-center justify-center py-8">
              <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
              <span className="ml-2">Loading details...</span>
            </div>
          ) : (
            <div className='flex flex-col text-sm gap-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{supplierProfile.name || '-'}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{supplierProfile.email || '-'}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-900">{supplierProfile.contact || '-'}</span>
              </div>
              <div className='flex justify-between items-start py-2'>
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-900 text-right max-w-[60%]">
                  {supplierProfile.address || '-'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Supplier Actions Card */}
        <div className='bg-white rounded-xl shadow p-4 mt-4 w-full flex flex-col gap-4'>
          <h3 className='text-lg font-semibold'>Supplier Actions</h3>
          <div className="space-y-3">
            <Link
              to={`/edit-supplier/${id}`}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2'
            >
              <FaRegEdit />
              Edit Supplier
            </Link>
            <button
              className='w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2'
              onClick={handleDeleteClick}
              disabled={loadingStates.deleting || loadingStates.fetchingSupplier}
            >
              {loadingStates.deleting ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Supplier'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierProfile