import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { SupplierContext } from '../context/SupplierContext';
import { ProductContext } from '../context/ProductContext';
import { RiAiGenerate } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa6";
import { MdKeyboardArrowDown } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';

const CreateOrder = () => {
   const { theme } = useTheme();

   // State for form data
   const [selectedSupplier, setSelectedSupplier] = useState('');
   const [quantities, setQuantities] = useState({});
   const [orderId, setOrderId] = useState(null);

   // Loading states
   const [isCreatingOrder, setIsCreatingOrder] = useState(false);
   const [isDownloadingPDF, setIsDownloadingPDF] = useState({ shopkeeper: false, supplier: false });

   // Message states
   const [message, setMessage] = useState({ type: '', text: '' });

   // Context hooks
   const { suppliers, setSuppliers } = useContext(SupplierContext);
   const { products, setProducts } = useContext(ProductContext);

   // Fetch suppliers on component mount
   useEffect(() => {
      const fetchSuppliers = async () => {
         try {
            const res = await axiosInstance.get('/supplier');
            if (res.status !== 200) {
               throw new Error("Failed to fetch suppliers");
            }
            const data = res.data;
            setSuppliers(data);
         } catch (error) {
            setMessage({ type: 'error', text: 'Error fetching suppliers. Please refresh the page.' });
         }
      };
      fetchSuppliers();
   }, [setSuppliers]);

   // Fetch products on component mount
   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const res = await axiosInstance.get('/product');
            if (res.status !== 200) {
               throw new Error("Failed to fetch products");
            }
            const data = res.data;
            setProducts(data);
         } catch (error) {
            setMessage({ type: 'error', text: 'Error fetching products. Please try again.' });
         }
      };
      fetchProducts();
   }, [setProducts]);

   // Get the selected supplier ID (default to first supplier if none selected)
   const selectedSupplierId = selectedSupplier || suppliers[0]?._id;

   // Filter products based on selected supplier
   const filteredProducts = products.filter(p => p.supplierId?._id === selectedSupplierId || p.supplierId === selectedSupplierId);

   // Clear messages after 5 seconds
   useEffect(() => {
      if (message.text) {
         const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [message]);

   // Handle quantity input changes
   const handleQuantityChange = (productId, value) => {
      setQuantities({ ...quantities, [productId]: value });
   };

   // Handle order creation
   const handleSubmit = async () => {
      // Validation checks
      if (!selectedSupplier) {
         setMessage({ type: 'error', text: 'Please select a supplier' });
         return;
      }

      const productsToSend = Object.entries(quantities)
         .filter(([_, qty]) => parseFloat(qty) > 0)
         .map(([productId, quantity]) => ({ productId, quantity: parseInt(quantity) }));

      if (productsToSend.length === 0) {
         setMessage({ type: 'error', text: 'Please enter at least one quantity' });
         return;
      }

      setIsCreatingOrder(true);
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         // Send order creation request
         const res = await axiosInstance.post('/order/new', {
            supplierId: selectedSupplier,
            products: productsToSend
         });

         setOrderId(res.data.order._id);
         setMessage({ type: 'success', text: 'Order created successfully!' });

         // Reset quantities after successful order creation
         setQuantities({});

      } catch (err) {
         const errorMessage = err.response?.data?.msg || 'Error creating order. Please try again.';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setIsCreatingOrder(false);
      }
   };

   // Handle PDF download with loading state
   const downloadPDF = async (type) => {
      if (!orderId) {
         setMessage({ type: 'error', text: 'No order to download yet' });
         return;
      }

      setIsDownloadingPDF(prev => ({ ...prev, [type]: true }));
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         const res = await axiosInstance.get(`/order/${orderId}/pdf?type=${type}`, {
            responseType: 'blob'
         });

         // Create and trigger download
         const url = window.URL.createObjectURL(new Blob([res.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `order-${type}-${orderId}.pdf`);
         document.body.appendChild(link);
         link.click();
         link.remove();

         // Clean up the URL object
         window.URL.revokeObjectURL(url);

         setMessage({ type: 'success', text: `${type} PDF downloaded successfully!` });
      } catch (err) {
         const errorMessage = err.response?.data?.msg || `Failed to download ${type} PDF`;
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setIsDownloadingPDF(prev => ({ ...prev, [type]: false }));
      }
   };

   return (
      <div className={`max-w-[500px] w-screen h-screen mx-auto py-2 px-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-zinc-200'}`}>
         <div className={`mt-12 flex flex-col gap-4 shadow p-4 rounded-xl text-xs transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

            {/* Message Display */}
            {message.text && (
               <div className={`p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${message.type === 'success'
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

            {/* Supplier Selection */}
            <div className='relative'>
               <select
                  className={`p-2 rounded-lg w-full text-sm outline-none appearance-none border transition-colors duration-200 ${theme === 'dark'
                     ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400'
                     : 'bg-white border-zinc-300 text-gray-900 focus:border-blue-500'
                     }`}
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  disabled={isCreatingOrder}
               >
                  <option className='h-6' value="">Select Supplier </option>
                  {suppliers.map((s) => (
                     <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
               </select>
               <span className={`absolute right-0 top-0 p-2 border-l transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-zinc-300'}`}>
                  <MdKeyboardArrowDown className={`text-xl opacity-85 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
               </span>
            </div>

            {/* Products Table */}
            <table className={`w-full text-xs border rounded-lg overflow-hidden transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
               <thead>
                  <tr className={`transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                     <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Product</th>
                     <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>MRP</th>
                     <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Type</th>
                     <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Qty</th>
                  </tr>
               </thead>
               <tbody>
                  {
                     filteredProducts.length === 0 && (
                        <tr>
                           <td colSpan="4" className={`border p-2 text-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>No products found</td>
                        </tr>
                     )
                  }
                  {filteredProducts.map((p) => (
                     <tr key={p._id} className={`transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{p.name}</td>
                        <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>₹{p.mrp}</td>
                        <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{p.type}</td>
                        <td className={`border p-2 flex justify-center items-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                           <input
                              type="number"
                              min="0"
                              value={quantities[p._id] || ''}
                              onChange={(e) => handleQuantityChange(p._id, e.target.value)}
                              className={`border p-1 rounded max-w-12 w-full outline-none text-center transition-colors duration-200 ${theme === 'dark'
                                 ? 'bg-gray-600 border-gray-500 text-gray-100 focus:border-blue-400'
                                 : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                 }`}
                              disabled={isCreatingOrder}
                           />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* Create Order Button */}
            <button
               onClick={handleSubmit}
               disabled={isCreatingOrder || !selectedSupplier}
               className={`flex w-full justify-center items-center text-xs shadow-md border rounded-lg py-2 px-4 gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isCreatingOrder || !selectedSupplier
                  ? theme === 'dark'
                     ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-60 bg-gray-700'
                     : 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60 bg-zinc-100'
                  : theme === 'dark'
                     ? 'border-green-600 text-green-400 hover:bg-green-900 cursor-pointer bg-gray-700 focus:ring-green-500 focus:ring-offset-gray-800'
                     : 'border-green-700 text-green-700 hover:bg-green-50 cursor-pointer bg-zinc-100 focus:ring-green-400 focus:ring-offset-white'
                  }`}
            >
               <span>
                  {isCreatingOrder ? (
                     <AiOutlineLoading3Quarters className='text-lg animate-spin' />
                  ) : (
                     <RiAiGenerate className='text-lg' />
                  )}
               </span>
               <span>{isCreatingOrder ? 'Creating Order...' : 'Create Order'}</span>
            </button>

            {/* PDF Download Buttons */}
            {orderId && (
               <div className="flex flex-col w-full justify-center items-center gap-2">
                  {/* Shopkeeper PDF Button */}
                  <button
                     onClick={() => downloadPDF('shopkeeper')}
                     disabled={isDownloadingPDF.shopkeeper}
                     className={`w-full flex items-center justify-center gap-2 text-xs py-2 px-2 border rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDownloadingPDF.shopkeeper
                        ? theme === 'dark'
                           ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-60 bg-gray-700'
                           : 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60 bg-zinc-100'
                        : theme === 'dark'
                           ? 'border-red-500 text-red-400 hover:bg-red-900 cursor-pointer bg-gray-700 focus:ring-red-500 focus:ring-offset-gray-800'
                           : 'border-red-600 text-red-600 hover:bg-red-50 cursor-pointer bg-zinc-100 focus:ring-red-400 focus:ring-offset-white'
                        }`}
                  >
                     <span>
                        {isDownloadingPDF.shopkeeper ? (
                           <AiOutlineLoading3Quarters className='text-md animate-spin' />
                        ) : (
                           <FaFilePdf className='text-md' />
                        )}
                     </span>
                     <span>
                        {isDownloadingPDF.shopkeeper ? 'Downloading...' : 'Shopkeeper PDF'}
                     </span>
                  </button>

                  {/* Supplier PDF Button */}
                  <button
                     onClick={() => downloadPDF('supplier')}
                     disabled={isDownloadingPDF.supplier}
                     className={`w-full flex items-center justify-center gap-2 text-xs py-2 px-2 border rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDownloadingPDF.supplier
                        ? theme === 'dark'
                           ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-60 bg-gray-700'
                           : 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60 bg-zinc-100'
                        : theme === 'dark'
                           ? 'border-red-500 text-red-400 hover:bg-red-900 cursor-pointer bg-gray-700 focus:ring-red-500 focus:ring-offset-gray-800'
                           : 'border-red-600 text-red-600 hover:bg-red-50 cursor-pointer bg-zinc-100 focus:ring-red-400 focus:ring-offset-white'
                        }`}
                  >
                     <span>
                        {isDownloadingPDF.supplier ? (
                           <AiOutlineLoading3Quarters className='text-md animate-spin' />
                        ) : (
                           <FaFilePdf className='text-md' />
                        )}
                     </span>
                     <span>
                        {isDownloadingPDF.supplier ? 'Downloading...' : 'Supplier PDF'}
                     </span>
                  </button>
               </div>
            )}
         </div>
      </div >
   );
};

export default CreateOrder;