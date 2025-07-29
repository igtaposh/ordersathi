import React, { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { SupplierContext } from '../context/SupplierContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../api/axiosInstance';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosAdd } from "react-icons/io";
import { Link } from 'react-router-dom';

const Products = () => {
   // Context hooks
   const { products, setProducts } = useContext(ProductContext);
   const { suppliers, setSuppliers } = useContext(SupplierContext);
   const { theme } = useTheme();

   // UI state for collapsible sections
   const [productForm, setProductForm] = useState(true);
   const [productList, setProductList] = useState(false);

   // Form state
   const [form, setForm] = useState({
      name: '',
      weight: '',
      rate: '',
      mrp: '',
      type: '',
      supplierId: ''
   });

   // Loading states
   const [isAddingProduct, setIsAddingProduct] = useState(false);

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

   // Clear messages after 5 seconds
   useEffect(() => {
      if (message.text) {
         const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [message]);

   // Handle adding new product
   const handleAdd = async () => {
      const { name, rate, supplierId, weight, mrp, type } = form;

      // Validation
      if (!name.trim() || !rate || !weight.trim() || !mrp || !type.trim() || !supplierId) {
         setMessage({ type: 'error', text: 'Please fill all fields' });
         return;
      }

      setIsAddingProduct(true);
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         const newProduct = { name: name.trim(), rate, weight: weight.trim(), mrp, type: type.trim() };
         // Send supplierId as a URL param
         const res = await axiosInstance.post(`/product/add/${supplierId}`, newProduct);

         setProducts(prev => [...prev, res.data.product]);
         setMessage({ type: 'success', text: 'Product added successfully!' });

         // Reset form after successful addition
         setForm({ name: '', weight: '', rate: '', mrp: '', type: '', supplierId: '' });

         // Optionally collapse the form after successful addition
         setProductForm(true);

      } catch (error) {
         const errorMessage = error.response?.data?.msg || 'Failed to add product. Please try again.';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setIsAddingProduct(false);
      }
   };

   return (
      <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>

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

         {/* Create Product Section */}
         <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div
               onClick={() => setProductForm(!productForm)}
               className={`p-2 flex items-center justify-between rounded-t-xl cursor-pointer transition-colors duration-200 ${theme === 'dark'
                  ? 'bg-orange-800 hover:bg-orange-700'
                  : 'bg-orange-900 hover:bg-orange-800'
                  }`}
            >
               <span className='text-white'> Create Product </span>
               <span>
                  <MdOutlineKeyboardArrowDown
                     className={`text-white text-lg ml-2 transition-transform ${productForm ? '' : 'rotate-180'}`}
                  />
               </span>
            </div>

            <div className='p-4'>
               {!productForm ? (
                  <div className={`p-4 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                     {/* Product Name Input */}
                     <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                     />

                     {/* Weight Input */}
                     <input
                        type="text"
                        placeholder="Weight (e.g. 1kg, 500g)"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                     />

                     {/* Rate Input */}
                     <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={form.rate}
                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                        min="0"
                        step="0.01"
                     />

                     {/* MRP Input */}
                     <input
                        type="number"
                        placeholder="MRP (₹)"
                        value={form.mrp}
                        onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                        min="0"
                        step="0.01"
                     />

                     {/* Type Input */}
                     <input
                        type="text"
                        placeholder="Type (piece, bag, etc)"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                     />

                     {/* Supplier Selection */}
                     <select
                        value={form.supplierId}
                        onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                        className={`border p-2 rounded outline-none transition-colors duration-200 ${theme === 'dark'
                           ? 'bg-gray-600 border-gray-500 text-gray-100 focus:border-orange-500'
                           : 'bg-white border-gray-300 text-gray-900 focus:border-orange-700'
                           }`}
                        disabled={isAddingProduct}
                        required
                     >
                        <option value="">Select Supplier</option>
                        {suppliers.map((s) => (
                           <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                     </select>

                     {/* Add Product Button */}
                     <button
                        onClick={handleAdd}
                        disabled={isAddingProduct || !form.name.trim() || !form.rate || !form.weight.trim() || !form.mrp || !form.type.trim() || !form.supplierId}
                        className={`col-span-2 py-2 rounded flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAddingProduct || !form.name.trim() || !form.rate || !form.weight.trim() || !form.mrp || !form.type.trim() || !form.supplierId
                           ? theme === 'dark'
                              ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-60'
                              : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                           : theme === 'dark'
                              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer focus:ring-green-500 focus:ring-offset-gray-700'
                              : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer focus:ring-green-400 focus:ring-offset-white'
                           }`}
                     >
                        <span>
                           {isAddingProduct ? (
                              <AiOutlineLoading3Quarters className='text-lg animate-spin' />
                           ) : (
                              <IoIosAdd className='text-lg' />
                           )}
                        </span>
                        <span>{isAddingProduct ? 'Adding Product...' : 'Add Product'}</span>
                     </button>
                  </div>
               ) : (
                  <div className='flex items-center justify-between'>
                     <button
                        onClick={() => setProductForm(false)}
                        className={`text-sm flex items-center gap-2 transition-colors duration-200 ${theme === 'dark'
                           ? 'text-orange-400 hover:text-orange-300'
                           : 'text-orange-900 hover:text-orange-700'
                           }`}
                     >
                        Click to add product
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Products List Section */}
         <div className={`shadow-md rounded-xl mt-8 w-full flex flex-col transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div
               onClick={() => setProductList(!productList)}
               className={`p-2 flex items-center justify-between rounded-t-xl cursor-pointer transition-colors duration-200 ${theme === 'dark'
                  ? 'bg-orange-800 hover:bg-orange-700'
                  : 'bg-orange-900 hover:bg-orange-800'
                  }`}
            >
               <span className='text-white'>Products ({products.length})</span>
               <span>
                  <MdOutlineKeyboardArrowDown
                     className={`text-white text-lg ml-2 transition-transform ${productList ? '' : 'rotate-180'}`}
                  />
               </span>
            </div>

            <div className='p-2'>
               <div>
                  {productList ? (
                     <div className='flex items-center justify-between'>
                        <button
                           onClick={() => setProductList(false)}
                           className={`text-sm flex items-center gap-2 transition-colors duration-200 ${theme === 'dark'
                              ? 'text-orange-400 hover:text-orange-300'
                              : 'text-orange-900 hover:text-orange-700'
                              }`}
                        >
                           Click to view products
                        </button>
                     </div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className='text-xs w-full'>
                           <thead>
                              <tr className={`transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-zinc-200'}`}>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Name</th>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>MRP</th>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Type</th>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Rate</th>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Weight</th>
                                 <th className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Supplier</th>
                              </tr>
                           </thead>
                           <tbody>
                              {products.length === 0 ? (
                                 <tr>
                                    <td colSpan="6" className={`border p-4 text-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                                       No products found. Add your first product above.
                                    </td>
                                 </tr>
                              ) : (
                                 products.map((p) => (
                                    <tr key={p._id} className={`border-b transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-200'}`}>
                                       <td className={`border p-2 text-center transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                                          <Link
                                             to={`/product-profile/${p._id}`}
                                             className={`underline transition-colors duration-200 ${theme === 'dark'
                                                ? 'text-blue-400 hover:text-blue-300'
                                                : 'text-blue-600 hover:text-blue-800'
                                                }`}
                                          >
                                             {p.name}
                                          </Link>
                                       </td>
                                       <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>₹{p.mrp || "---"}</td>
                                       <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{p.type || "---"}</td>
                                       <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>₹{p.rate || "---"}</td>
                                       <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>{p.weight || "---"}</td>
                                       <td className={`border p-2 transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                                          {p.supplierId ? (
                                             <Link
                                                to={`/supplier-profile/${p.supplierId._id}`}
                                                className={`underline transition-colors duration-200 ${theme === 'dark'
                                                   ? 'text-blue-400 hover:text-blue-300'
                                                   : 'text-blue-600 hover:text-blue-800'
                                                   }`}
                                             >
                                                {p.supplierId.name}
                                             </Link>
                                          ) : (
                                             <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No Supplier</span>
                                          )}
                                       </td>
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

export default Products;