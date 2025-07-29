import React from 'react';
import Orders from '../components/Orders';
import Stocks from '../components/Stocks';
import { useTheme } from '../context/ThemeContext';

/**
 * History component - Displays order and stock history
 * This page serves as a centralized view for historical data
 * including order history and stock reports
 */
function History() {
  const { theme } = useTheme();

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
      <div className='w-full rounded-xl px-4 py-14 flex flex-col gap-4'>

        {/* Order History Section */}
        <div>
          <div className={`p-2 shadow-md rounded-xl transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <Orders />
          </div>
        </div>

        {/* Stock History Section */}
        <div>
          <div className={`p-2 shadow-md rounded-xl transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <Stocks />
          </div>
        </div>

      </div>
    </div>
  );
}

export default History;