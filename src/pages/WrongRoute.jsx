import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * WrongRoute Component - 404 Error Page
 * Displays a user-friendly 404 error page when users navigate to non-existent routes
 * Provides navigation options to help users get back to the application
 * @returns {JSX.Element} WrongRoute component
 */
function WrongRoute() {
   const navigate = useNavigate();

   /**
    * Handle navigation back to previous page
    * Falls back to home page if no history exists
    */
   const handleGoBack = () => {
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         navigate('/');
      }
   };

   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-200 px-4">
         {/* Error Code Display */}
         <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-orange-900 mb-4 animate-pulse">
               404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
               Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md mx-auto leading-relaxed">
               Oops! The page you are looking for does not exist or has been moved.
               Don't worry, it happens to the best of us!
            </p>
         </div>

         {/* Navigation Options */}
         <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Go Back Button */}
            <button
               onClick={handleGoBack}
               className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
               aria-label="Go back to previous page"
            >
               ← Go Back
            </button>

            {/* Home Link */}
            <Link
               to="/"
               className="bg-orange-900 hover:bg-orange-800 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
               aria-label="Go to home page"
            >
               🏠 Go to Home
            </Link>

            {/* Dashboard Link for authenticated users */}
            <Link
               to="/dashboard"
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
               aria-label="Go to dashboard"
            >
               📊 Dashboard
            </Link>
         </div>

         {/* Additional Help Section */}
         <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">
               Need help? Here are some quick links:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
               <Link
                  to="/products"
                  className="text-orange-900 hover:text-orange-700 underline transition-colors"
               >
                  Products
               </Link>
               <Link
                  to="/suppliers"
                  className="text-orange-900 hover:text-orange-700 underline transition-colors"
               >
                  Suppliers
               </Link>
               <Link
                  to="/orders"
                  className="text-orange-900 hover:text-orange-700 underline transition-colors"
               >
                  Orders
               </Link>
               <Link
                  to="/history"
                  className="text-orange-900 hover:text-orange-700 underline transition-colors"
               >
                  History
               </Link>
            </div>
         </div>

         {/* Footer */}
         <div className="mt-16 text-center">
            <p className="text-gray-400 text-xs">
               © 2025 Shopkeeper Order Manager. All rights reserved.
            </p>
         </div>
      </div>
   )
}

export default WrongRoute