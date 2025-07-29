import React, { useState, useContext } from 'react';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';

/**
 * Login Component - User Authentication with OTP Verification
 * 
 * Features:
 * - Two-step authentication process with OTP
 * - Form validation with real-time error feedback
 * - Dark/Light theme support with smooth transitions
 * - Responsive design for mobile and desktop
 * - Loading states and user feedback messages
 * - Production-ready error handling
 * 
 * @component
 * @returns {JSX.Element} Login component
 */
const Login = () => {
   // Form state management
   const [phone, setPhone] = useState('');
   const [otp, setOtp] = useState('');
   const [otpSent, setOtpSent] = useState(false);

   // Loading and message states
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState({ type: '', text: '' });

   // Router and context hooks
   const navigate = useNavigate();
   const { setUser, setToken } = useContext(AuthContext);
   const { theme } = useTheme();

   /**
    * Handles OTP sending process
    * 
    * Validation Rules:
    * - Phone number must be exactly 10 digits
    * - Must start with 6, 7, 8, or 9 (Indian mobile format)
    * 
    * Process Flow:
    * 1. Clear previous messages
    * 2. Validate phone number format
    * 3. Send OTP request to backend
    * 4. Update UI state based on response
    * 5. Show appropriate feedback to user
    * 
    * @async
    * @function
    */
   const handleSendOtp = async () => {
      // Clear any existing messages
      setMessage({ type: '', text: '' });

      // Validate phone number format
      if (!phone || phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
         setMessage({
            type: 'error',
            text: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'
         });
         return;
      }

      setLoading(true);

      try {
         // Send OTP request to backend
         const response = await axiosInstance.post('/auth/send-otp', { phone });

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

      } finally {
         setLoading(false);
      }
   };

   /**
    * Handles OTP verification and user authentication
    * 
    * Process Flow:
    * 1. Validate OTP input (must be 6 digits)
    * 2. Verify OTP with backend
    * 3. Authenticate user if OTP is valid
    * 4. Set authentication data and persist to localStorage
    * 5. Navigate to dashboard with success feedback
    * 
    * @async
    * @function
    */
   const handleLogin = async () => {
      // Clear previous messages
      setMessage({ type: '', text: '' });

      // Validate OTP input
      if (!otp || otp.length !== 6) {
         setMessage({
            type: 'error',
            text: 'Please enter a valid 6-digit OTP'
         });
         return;
      }

      setLoading(true);

      try {
         // Step 1: Verify OTP
         const verifyResponse = await axiosInstance.post('/auth/verify-otp', {
            phone,
            otp
         });

         if (verifyResponse.status !== 200) {
            throw new Error("OTP verification failed");
         }

         // Step 2: Authenticate user
         const loginResponse = await axiosInstance.post('/auth/login', {
            phone,
            otp
         });

         // Step 3: Set authentication data
         const { user, token } = loginResponse.data;

         setUser(user);
         setToken(token);
         setAuthToken(token);

         // Persist authentication data
         localStorage.setItem("token", token);
         localStorage.setItem("user", JSON.stringify(user));

         // Step 4: Show success message and navigate
         setMessage({
            type: 'success',
            text: 'Login successful! Redirecting to dashboard...'
         });

         // Navigate to dashboard after brief delay
         setTimeout(() => {
            navigate('/dashboard');
         }, 1500);

      } catch (error) {
         // Handle different types of authentication errors
         if (error.response?.status === 401) {
            setMessage({
               type: 'error',
               text: 'Invalid OTP or expired session. Please try again.'
            });
         } else if (error.response?.status === 404) {
            setMessage({
               type: 'error',
               text: 'User not found. Please register first.'
            });
         } else {
            const errorMessage = error.response?.data?.msg ||
               error.response?.data?.message ||
               'Login failed. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
         }

      } finally {
         setLoading(false);
      }
   };

   /**
    * Resets the OTP flow to allow phone number change
    * Clears OTP input and any existing messages
    * 
    * @function
    */
   const handleChangeNumber = () => {
      setOtpSent(false);
      setOtp('');
      setMessage({ type: '', text: '' });
   };

   /**
    * Handles phone number input changes
    * Clears existing messages when user starts typing
    * 
    * @param {Event} e - Input change event
    */
   const handlePhoneChange = (e) => {
      setPhone(e.target.value);
      // Clear messages when user starts typing
      if (message.text) {
         setMessage({ type: '', text: '' });
      }
   };

   /**
    * Handles OTP input changes
    * Clears existing messages when user starts typing
    * 
    * @param {Event} e - Input change event
    */
   const handleOtpChange = (e) => {
      setOtp(e.target.value);
      // Clear messages when user starts typing
      if (message.text) {
         setMessage({ type: '', text: '' });
      }
   };

   return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
         {/* Main Container - Responsive width and padding */}
         <div className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:max-w-lg">

            {/* Login Form Container */}
            <div className='flex flex-col gap-4 sm:gap-6'>

               {/* Header Section */}
               <div className="text-center">
                  <h1 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                     Welcome Back
                  </h1>
                  <p className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                     Sign in to continue with your business management
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

                     {/* Phone Number Input Field */}
                     <div className='flex flex-col gap-2'>
                        <label className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                           Mobile Number *
                        </label>
                        <input
                           value={phone}
                           onChange={handlePhoneChange}
                           className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                              : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                              } ${message.type === 'error' && !otpSent ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                           type="tel"
                           disabled={otpSent || loading}
                           placeholder="Enter 10-digit mobile number"
                           maxLength="10"
                        />
                     </div>

                     {/* Conditional rendering: Send OTP or OTP Verification */}
                     {!otpSent ? (
                        /* Send OTP Button */
                        <button
                           onClick={handleSendOtp}
                           disabled={loading || !phone}
                           className={`w-full h-10 sm:h-12 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${loading || !phone
                                 ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                 : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 active:transform active:scale-98'
                              }`}
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
                                 value={otp}
                                 onChange={handleOtpChange}
                                 className={`h-10 sm:h-12 rounded-xl outline-none px-3 py-2 text-sm transition-all duration-200 border text-center tracking-widest ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400'
                                    : 'bg-neutral-200 text-gray-900 border-gray-300 focus:border-blue-500'
                                    } ${message.type === 'error' && otpSent ? 'border-red-500 focus:border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
                                 type="text"
                                 maxLength="6"
                                 placeholder="Enter 6-digit OTP"
                                 disabled={loading}
                              />
                           </div>

                           {/* Login Button */}
                           <button
                              onClick={handleLogin}
                              disabled={loading || !otp}
                              className={`w-full h-10 sm:h-12 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${loading || !otp
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
                                    Logging in...
                                 </span>
                              ) : (
                                 'Sign In'
                              )}
                           </button>

                           {/* Change Number Button */}
                           <button
                              onClick={handleChangeNumber}
                              disabled={loading}
                              className={`text-xs underline mt-2 text-center transition-colors duration-200 ${loading
                                 ? theme === 'dark' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                                 : theme === 'dark' ? 'text-blue-400 hover:text-blue-300 cursor-pointer' : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                                 }`}
                           >
                              Change Number
                           </button>
                        </>
                     )}
                  </div>

                  {/* Register Link Section */}
                  <div className='flex flex-col items-center mt-6 pt-4 border-t border-opacity-20 border-gray-400'>
                     <p className={`text-sm mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Don't have an account?
                     </p>
                     <Link
                        to='/register'
                        className={`text-sm font-medium transition-colors duration-200 hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                     >
                        Create Account
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;