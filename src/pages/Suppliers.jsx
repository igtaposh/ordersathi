import React, { useState, useContext, useEffect } from 'react';
import { SupplierContext } from '../context/SupplierContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../api/axiosInstance';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { IoIosAdd } from "react-icons/io";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Suppliers = () => {
  // Context hooks
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const { theme } = useTheme();

  // UI state for collapsible sections
  const [supplierForm, setSupplierForm] = useState(true);
  const [supplierList, setSupplierList] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', contact: '', address: '' });

  // Loading states
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);

  // Message states
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get('/supplier');
        if (res.status !== 200) {
          throw new Error("Failed to fetch suppliers");
        }
        setSuppliers(res.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error fetching suppliers. Please refresh the page.' });
      }
    };
    fetchSuppliers();
  }, [setSuppliers]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle adding new supplier
  const handleAdd = async () => {
    // Validation
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Supplier name is required' });
      return;
    }

    setIsAddingSupplier(true);
    setMessage({ type: '', text: '' }); // Clear any existing messages

    try {
      const res = await axiosInstance.post('/supplier/add', { ...form });
      setSuppliers([...suppliers, res.data.supplier]);
      setMessage({ type: 'success', text: 'Supplier added successfully!' });

      // Reset form after successful addition
      setForm({ name: '', contact: '', address: '' });

      // Optionally collapse the form after successful addition
      setSupplierForm(true);

    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Error adding supplier. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsAddingSupplier(false);
    }
  };

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto mb-16 p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>

      {/* Message Display */}
      {message.text && (
        <div className={`w-full mt-8 p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${message.type === 'success'
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

      {/* Create Supplier Section */}
      <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div
          onClick={() => setSupplierForm(!supplierForm)}
          className={`p-2 flex items-center justify-between rounded-t-xl cursor-pointer transition-colors duration-200 ${theme === 'dark'
            ? 'bg-orange-800 hover:bg-orange-700'
            : 'bg-orange-900 hover:bg-orange-800'
            }`}
        >
          <span className='text-white'> Create Supplier </span>
          <span>
            <MdOutlineKeyboardArrowDown
              className={`text-white text-lg ml-2 transition-transform ${supplierForm ? '' : 'rotate-180'}`}
            />
          </span>
        </div>

        <div className='p-4'>
          {!supplierForm ? (
            <div className='flex flex-col text-sm'>
              {/* Supplier Name Input */}
              <input
                type="text"
                placeholder="Supplier Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`border w-full p-2 mb-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                  ? 'bg-gray-700 border-orange-600 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                  : 'bg-white border-orange-900 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                  }`}
                disabled={isAddingSupplier}
                required
              />

              {/* Contact Input */}
              <input
                type="text"
                placeholder="Contact"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className={`border w-full p-2 mb-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                  ? 'bg-gray-700 border-orange-600 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                  : 'bg-white border-orange-900 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                  }`}
                disabled={isAddingSupplier}
              />

              {/* Address Input */}
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`border w-full p-2 mb-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                  ? 'bg-gray-700 border-orange-600 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                  : 'bg-white border-orange-900 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                  }`}
                disabled={isAddingSupplier}
              />

              {/* Add Supplier Button */}
              <button
                onClick={handleAdd}
                disabled={isAddingSupplier || !form.name.trim()}
                className={`border px-4 py-2 rounded w-full flex items-center justify-center gap-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAddingSupplier || !form.name.trim()
                  ? theme === 'dark'
                    ? 'border-gray-500 bg-gray-600 text-gray-300 cursor-not-allowed opacity-60'
                    : 'border-gray-400 bg-gray-400 text-white cursor-not-allowed opacity-60'
                  : theme === 'dark'
                    ? 'border-green-600 bg-green-600 text-white hover:bg-green-700 cursor-pointer focus:ring-green-500 focus:ring-offset-gray-800'
                    : 'border-green-700 bg-green-700 text-white hover:bg-green-800 cursor-pointer focus:ring-green-400 focus:ring-offset-white'
                  }`}
              >
                <span>
                  {isAddingSupplier ? (
                    <AiOutlineLoading3Quarters className='text-lg animate-spin' />
                  ) : (
                    <IoIosAdd className='text-lg' />
                  )}
                </span>
                <span>{isAddingSupplier ? 'Adding Supplier...' : 'Add Supplier'}</span>
              </button>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <button
                onClick={() => setSupplierForm(false)}
                className={`text-sm flex items-center gap-2 transition-colors duration-200 ${theme === 'dark'
                  ? 'text-orange-400 hover:text-orange-300'
                  : 'text-orange-900 hover:text-orange-700'
                  }`}
              >
                Click to add supplier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Suppliers List Section */}
      <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div
          onClick={() => setSupplierList(!supplierList)}
          className={`p-2 flex items-center justify-between rounded-t-xl cursor-pointer transition-colors duration-200 ${theme === 'dark'
            ? 'bg-orange-800 hover:bg-orange-700'
            : 'bg-orange-900 hover:bg-orange-800'
            }`}
        >
          <span className='text-white'>Suppliers ({suppliers.length})</span>
          <span>
            <MdOutlineKeyboardArrowDown
              className={`text-white text-lg ml-2 transition-transform ${supplierList ? '' : 'rotate-180'}`}
            />
          </span>
        </div>

        <div className='p-2'>
          <div>
            {supplierList ? (
              <div className='flex items-center justify-between'>
                <button
                  onClick={() => setSupplierList(false)}
                  className={`text-sm flex items-center gap-2 transition-colors duration-200 ${theme === 'dark'
                    ? 'text-orange-400 hover:text-orange-300'
                    : 'text-orange-900 hover:text-orange-700'
                    }`}
                >
                  Click to view suppliers
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className='text-xs w-full'>
                  <thead>
                    <tr className={`transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-zinc-200'}`}>
                      <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Supplier Name</th>
                      <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Contact</th>
                      <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className={`border p-4 text-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                          No suppliers found. Add your first supplier above.
                        </td>
                      </tr>
                    ) : (
                      suppliers.map((s) => (
                        <tr key={s._id} className={`border-b transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-200'}`}>
                          <td className={`border p-2 text-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                            <Link
                              to={`/supplier-profile/${s._id}`}
                              className={`underline transition-colors duration-200 ${theme === 'dark'
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-800'
                                }`}
                            >
                              {s.name}
                            </Link>
                          </td>
                          <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{s.contact || "---"}</td>
                          <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{s.address || "---"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;