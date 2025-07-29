import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { useTheme } from '../context/ThemeContext';

/**
 * Register Component - User Registration with OTP Verification
 * 
 * Features:
 * - Multi-step registration process with OTP verification
 * - Form validation with real-time error feedback
 * - Dark/Light theme support with smooth transitions
 * - Responsive design for mobile and desktop
 * - Loading states and user feedback messages
 * - Production-ready error handling
 * 
 * @component
 * @returns {JSX.Element} Register component
 */
function Register() {
   // Router and context hooks
   const navigate = useNavigate();
   const { setUser, setToken } = useContext(AuthContext);
   const { theme } = useTheme();

   // Component state management
   const [otpSent, setOtpSent] = useState(false);
   const [loading, setLoading] = useState(false);
   const [formError, setFormError] = useState({});
   const [message, setMessage] = useState({ type: '', text: '' });

   // Form data state
   const [userForm, setUserForm] = useState({
      userName: '',
      shopName: '',
      phone: '',
      email: '',
      role: '',
      otp: ''
   });

   /**
    * Validates form inputs before proceeding with registration
    * 
    * Validation Rules:
    * - Name: Required field
    * - Shop Name: Required field  
    * - Role: Required selection
    * - Phone: Required, must be valid 10-digit Indian mobile number
    * - Email: Optional, but must be valid format if provided
    * 
    * @returns {boolean} True if all validations pass, false otherwise
    */
   const validateForm = () => {
      const errors = {};

      // Required field validations
      if (!userForm.userName.trim()) {
         errors.userName = "Name is required";
      }

      if (!userForm.shopName.trim()) {
         errors.shopName = "Shop name is required";
      }

      if (!userForm.role) {
         errors.role = "Role selection is required";
      }

      // Phone number validation
      if (!userForm.phone) {
         errors.phone = "Phone number is required";
      } else if (!/^[6-9]\d{9}$/.test(userForm.phone)) {
         errors.phone = "Enter a valid 10-digit Indian mobile number";
      }

      // Email validation (optional field)
      if (userForm.email && !/\S+@\S+\.\S+/.test(userForm.email)) {
         errors.email = "Enter a valid email address";
      }

      setFormError(errors);
      return Object.keys(errors).length === 0;
   };

   /**
    * Handles OTP sending process
    * 
    * Process Flow:
    * 1. Clear any existing messages
    * 2. Validate form inputs
    * 3. Send OTP request to backend
    * 4. Update UI state based on response
    * 5. Show appropriate feedback to user
    * 
    * @async
    * @function
    */
   const handleSendOtp = async () => {
      // Clear previous messages and errors
      setMessage({ type: '', text: '' });
      setFormError({});

      // Validate form before proceeding
      if (!validateForm()) {
         setMessage({
            type: 'error',
            text: 'Please fill in all required fields correctly.'
         });
         return;
      }

      setLoading(true);

      try {
         // Send OTP request to backend with user details
         const response = await axiosInstance.post('/auth/send-otp', {
            phone: userForm.phone,
            name: userForm.userName.trim(),
            email: userForm.email.trim(),
            role: userForm.role
         });

         // Success: Update UI for OTP input
         setOtpSent(true);
         setMessage({
            type: 'success',
            text: 'OTP sent successfully to your mobile number. Please check your messages.'
         });

      } catch (err) {
         // Handle API errors gracefully
         const errorMessage = err.response?.data?.msg ||
            err.response?.data?.message ||
            'Failed to send OTP. Please try again.';

         setMessage({ type: 'error', text: errorMessage });

         // Reset OTP state on error
         setOtpSent(false);

      } finally {
         setLoading(false);
      }
   };

   /**
    * Handles OTP verification and user registration
    * 
    * Process Flow:
    * 1. Validate OTP input
    * 2. Verify OTP with backend
    * 3. Register user if OTP is valid
    * 4. Set authentication data
    * 5. Navigate to dashboard
    * 
    * @async
    * @function
    */
   const handleVerifyOtp = async () => {
      // Clear previous messages
      setMessage({ type: '', text: '' });

      // Validate OTP input
      if (!userForm.otp || userForm.otp.length !== 6) {
         setFormError({ ...formError, otp: "Please enter a valid 6-digit OTP" });
         setMessage({ type: 'error', text: 'Please enter the complete 6-digit OTP.' });
         return;
      }

      setLoading(true);

      try {
         // Step 1: Verify OTP
         const verifyResponse = await axiosInstance.post('/auth/verify-otp', {
            phone: userForm.phone,
            otp: userForm.otp
         });

         if (verifyResponse.status === 200) {
            // Step 2: Register user after successful OTP verification
            const registrationData = {
               name: userForm.userName.trim(),
               shopName: userForm.shopName.trim(),
               phone: userForm.phone,
               email: userForm.email.trim(),
               role: userForm.role,
            };

            const registerResponse = await axiosInstance.post('/auth/register', registrationData);

            if (registerResponse.status === 201) {
               // Step 3: Set authentication data
               const { user, token } = registerResponse.data;

               setUser(user);
               setToken(token);
               setAuthToken(token);

               // Persist authentication data
               localStorage.setItem("token", token);
               localStorage.setItem("user", JSON.stringify(user));

               // Step 4: Show success message and navigate
               setMessage({
                  type: 'success',
                  text: 'Registration successful! Redirecting to dashboard...'
               });

               // Navigate to dashboard after brief delay
               setTimeout(() => {
                  navigate('/dashboard');
               }, 1500);
            }
         }

      } catch (err) {
         // Handle different types of errors
         if (err.response?.status === 400) {
            const errorMsg = err.response?.data?.msg || "Invalid OTP. Please try again.";
            setFormError({ ...formError, otp: errorMsg });
            setMessage({ type: 'error', text: errorMsg });
         } else if (err.response?.status === 409) {
            setMessage({
               type: 'error',
               text: 'User already exists. Please try logging in instead.'
            });
         } else {
            const errorMessage = err.response?.data?.msg ||
               err.response?.data?.message ||
               'Registration failed. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
         }

      } finally {
         setLoading(false);
      }
   };

   /**
    * Handles input field changes and clears related errors
    * 
    * @param {string} field - The form field being updated
    * @param {string} value - The new value for the field
    */
   const handleInputChange = (field, value) => {
      // Update form data
      setUserForm(prev => ({ ...prev, [field]: value }));

      // Clear field-specific error when user starts typing
      if (formError[field]) {
         setFormError(prev => ({ ...prev, [field]: '' }));
      }

      // Clear general messages when user makes changes
      if (message.text) {
         setMessage({ type: '', text: '' });
      }
   };

   return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
         {/* Main Container - Responsive width and padding */}
         <div className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:max-w-lg">

            {/* Registration Form Container */}
            <div className='flex flex-col gap-4 sm:gap-6'>

               {/* Header Section */}
               <div className="text-center">
                  <h1 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                     Create Account
                  </h1>
                  <p className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                     Sign up to continue with your business management
                  </p>
               </div>

               {/* Message Display - Success/Error Feedback */}
               {message.text && (
                  <div className={`p-3 sm:p-4 rounded-lg text-sm font-medium transition-all duration-200 ${message.type === 'success'
                        ? theme === 'dark'
                           ? 'bg-green-900 text-green-100 border border-green-700'
                           : 'bg-green-100 text-green-800 border border-green-200'
                        : theme === 'dark'
                           ? 'bg-red-900 text-red-100 border border-red-700'
                           : 'bg-red-100 text-red-800 border border-red-200'
                     }`}>
                     {message.text}
                  </div>
               )}

               {/* Form Card */}
               <div className={`px-4 py-6 sm:px-6 sm:py-8 border-4 border-l-0 border-r-0 border-yellow-400 rounded-lg transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>

                  {/* Form Fields Container */}
                  <div className='flex flex-col gap-4 sm:gap-5'>

                     {/* Name Input Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Full Name *
                        </label>
                        <input
                           value={userForm.userName}
                           onChange={e => handleInputChange('userName', e.target.value)}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${formError.userName ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           type="text"
                           placeholder="Enter your full name"
                           disabled={loading}
                        />
                        {formError.userName && (
                           <p className="text-red-500 text-xs font-medium">{formError.userName}</p>
                        )}
                     </div>

                     {/* Business Name Input Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Business Name *
                        </label>
                        <input
                           value={userForm.shopName}
                           onChange={e => handleInputChange('shopName', e.target.value)}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${formError.shopName ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           type="text"
                           placeholder="Enter your business name"
                           disabled={loading}
                        />
                        {formError.shopName && (
                           <p className="text-red-500 text-xs font-medium">{formError.shopName}</p>
                        )}
                     </div>

                     {/* Mobile Number Input Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Mobile Number *
                        </label>
                        <input
                           value={userForm.phone}
                           onChange={e => handleInputChange('phone', e.target.value)}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${formError.phone ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           type="tel"
                           placeholder="Enter 10-digit mobile number"
                           maxLength="10"
                           disabled={loading}
                        />
                        {formError.phone && (
                           <p className="text-red-500 text-xs font-medium">{formError.phone}</p>
                        )}
                     </div>

                     {/* Email Input Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Email Address
                           <span className={`text-xs font-normal ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>(Optional)</span>
                        </label>
                        <input
                           value={userForm.email}
                           onChange={e => handleInputChange('email', e.target.value)}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${formError.email ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           type="email"
                           placeholder="Enter your email address"
                           disabled={loading}
                        />
                        {formError.email && (
                           <p className="text-red-500 text-xs font-medium">{formError.email}</p>
                        )}
                     </div>

                     {/* Role Selection Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Your Role *
                        </label>
                        <select
                           value={userForm.role}
                           onChange={e => handleInputChange('role', e.target.value)}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${formError.role ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           disabled={loading}
                        >
                           <option value="">Select your role</option>
                           <option value="shopkeeper">Shopkeeper</option>
                           <option value="manager">Manager</option>
                           <option value="employee">Employee</option>
                           <option value="admin">Admin</option>
                        </select>
                        {formError.role && (
                           <p className="text-red-500 text-xs font-medium">{formError.role}</p>
                        )}
                     </div>

                     {/* Conditional rendering: Send OTP or OTP Verification */}
                     {!otpSent ? (
                        /* Send OTP Button */
                        <button
                           onClick={handleSendOtp}
                           disabled={loading}
                           className={`w-full h-10 sm:h-12 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${loading
                                 ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                 : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 active:transform active:scale-98'
                              }`}
                           type="button"
                        >
                           {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                 </svg>
                                 Sending OTP...
                              </span>
                           ) : (
                              'Send OTP'
                           )}
                        </button>
                     ) : (
                        /* OTP Verification Section */
                        <>
                           {/* OTP Input Field */}
                           <div className='flex flex-col gap-2'>
                              <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                 Enter OTP *
                              </label>
                              <input
                                 value={userForm.otp}
                                 onChange={e => handleInputChange('otp', e.target.value)}
                                 className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border text-center tracking-widest ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                                    : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                                    } ${formError.otp ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                                 type="text"
                                 placeholder="Enter 6-digit OTP"
                                 maxLength="6"
                                 disabled={loading}
                              />
                              {formError.otp && (
                                 <p className="text-red-500 text-xs font-medium">{formError.otp}</p>
                              )}
                           </div>

                           {/* Submit Registration Button */}
                           <button
                              onClick={handleVerifyOtp}
                              disabled={loading}
                              className={`w-full h-10 sm:h-12 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${loading
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 focus:ring-yellow-400 active:transform active:scale-98'
                                 }`}
                           >
                              {loading ? (
                                 <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Verifying & Registering...
                                 </span>
                              ) : (
                                 'Complete Registration'
                              )}
                           </button>
                        </>
                     )}
                  </div>

                  {/* Login Link Section */}
                  <div className='flex flex-col items-center mt-6 pt-4 border-t border-opacity-20 border-gray-400'>
                     <p className={`text-sm mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Already have an account?
                     </p>
                     <Link
                        to='/login'
                        className={`text-sm font-medium transition-colors duration-200 hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                     >
                        Sign In
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Register;