import React from 'react'
import { useTheme } from '../context/ThemeContext';

/**
 * StatsTable Component - Reusable Data Table
 * A flexible, responsive table component for displaying statistical data with proper formatting
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column definitions [{ label: 'Name', key: 'name' }, ...]
 * @param {Array} props.data - Array of data objects [{ name: '...', ... }, ...]
 * @param {string} props.title - Table title displayed in header
 * @returns {JSX.Element} StatsTable component
 * 
 * @example
 * <StatsTable 
 *   title="Product Statistics"
 *   columns={[
 *     { label: 'Product Name', key: 'name' },
 *     { label: 'Price', key: 'price' },
 *     { label: 'Created', key: 'createdAt' }
 *   ]}
 *   data={[
 *     { name: 'Product 1', price: '₹100', createdAt: '2025-01-01' }
 *   ]}
 * />
 */
function StatsTable({ columns = [], data = [], title = 'Stats' }) {
   const { theme } = useTheme();

   /**
    * Ensure data is always an array to prevent runtime errors
    * Provides fallback for undefined or null data props
    */
   const safeData = Array.isArray(data) ? data : [];

   /**
    * Format ISO date strings to localized Indian format
    * Handles invalid dates gracefully with fallback
    * @param {string} isoDate - ISO date string to format
    * @returns {string} Formatted date string or 'N/A' for invalid dates
    */
   const formatDate = (isoDate) => {
      if (!isoDate) return 'N/A';

      try {
         const date = new Date(isoDate);
         // Check if date is valid
         if (isNaN(date.getTime())) return 'N/A';

         return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
         });
      } catch (error) {
         // Fallback for any formatting errors
         return 'N/A';
      }
   };

   /**
    * Format cell values based on data type and column key
    * Provides special formatting for dates and currency
    * @param {any} value - The cell value to format
    * @param {string} columnKey - The column key for context-specific formatting
    * @returns {string} Formatted cell value
    */
   const formatCellValue = (value, columnKey) => {
      // Handle null, undefined, or empty values
      if (value === null || value === undefined || value === '') {
         return 'N/A';
      }

      // Special formatting for date columns
      if (columnKey === 'createdAt' || columnKey === 'updatedAt' || columnKey.includes('Date')) {
         return formatDate(value);
      }

      // Special formatting for price/currency columns
      if (columnKey.includes('price') || columnKey.includes('rate') || columnKey.includes('mrp')) {
         // If already formatted with currency symbol, return as is
         if (typeof value === 'string' && (value.includes('₹') || value.includes('$'))) {
            return value;
         }
         // If numeric, format with currency
         if (!isNaN(value) && value !== '') {
            return `₹${parseFloat(value).toFixed(2)}`;
         }
      }

      // Return value as string for display
      return String(value);
   };

   /**
    * Validate props to ensure proper usage
    */
   if (!Array.isArray(columns)) {
      console.warn('StatsTable: columns prop should be an array');
      return <div className={`p-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>Invalid table configuration</div>;
   }

   return (
      <div
         className={`w-full h-fit flex justify-center items-center rounded-xl overflow-hidden border shadow-md transition-colors duration-200 ${theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-300'
            }`}
         role="region"
         aria-label={`${title} data table`}
      >
         <table
            className='w-full text-sm text-center border-collapse'
            role="table"
            aria-label={title}
         >
            {/* Table Header with Title and Column Headers */}
            <thead className={`transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
               {/* Title Row */}
               <tr>
                  <th
                     className={`text-left px-4 py-3 font-semibold border-b transition-colors duration-200 ${theme === 'dark'
                        ? 'text-gray-100 bg-gray-600 border-gray-500'
                        : 'text-gray-800 bg-gray-200 border-gray-300'
                        }`}
                     colSpan={columns.length}
                     scope="colgroup"
                  >
                     {title}
                  </th>
               </tr>

               {/* Column Headers Row */}
               <tr className={`transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {columns.map((col, index) => (
                     <th
                        key={col.key || index}
                        className={`px-3 py-2 font-medium border-b border-r last:border-r-0 transition-colors duration-200 ${theme === 'dark'
                           ? 'text-gray-200 border-gray-500'
                           : 'text-gray-700 border-gray-300'
                           }`}
                        scope="col"
                        aria-label={`${col.label} column`}
                     >
                        {col.label}
                     </th>
                  ))}
               </tr>
            </thead>

            {/* Table Body with Data Rows */}
            <tbody className={`divide-y transition-colors duration-200 ${theme === 'dark'
               ? 'bg-gray-800 divide-gray-600'
               : 'bg-white divide-gray-200'
               }`}>
               {safeData.length === 0 ? (
                  /* Empty State Row */
                  <tr>
                     <td
                        colSpan={columns.length}
                        className={`px-2 py-4 text-center italic transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                        role="cell"
                     >
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-2xl">📋</span>
                           <span>No data available</span>
                           <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Data will appear here when available</span>
                        </div>
                     </td>
                  </tr>
               ) : (
                  /* Data Rows */
                  safeData.map((row, rowIndex) => (
                     <tr
                        key={row.id || rowIndex}
                        className={`transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        role="row"
                     >
                        {columns.map((col, colIndex) => (
                           <td
                              key={`${col.key}-${rowIndex}` || `${rowIndex}-${colIndex}`}
                              className={`px-3 py-2 border-r last:border-r-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] transition-colors duration-200 ${theme === 'dark'
                                 ? 'text-gray-200 border-gray-600'
                                 : 'text-gray-900 border-gray-200'
                                 }`}
                              role="cell"
                              title={formatCellValue(row[col.key], col.key)} // Tooltip for truncated content
                           >
                              {formatCellValue(row[col.key], col.key)}
                           </td>
                        ))}
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
   );
}

export default StatsTable