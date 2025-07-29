import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { StockReportContext } from '../context/StockReport';
import { useTheme } from '../context/ThemeContext';

/**
 * Stocks component - Displays and manages stock report history
 * Provides functionality to view stock reports and download PDF reports
 */
function Stocks() {
   // Context for stock reports data
   const { stockReport, setStockReport } = useContext(StockReportContext);
   const { theme } = useTheme();

   // UI state for collapsible stock reports list
   const [showStockReports, setShowStockReports] = useState(false);

   // Loading states for PDF downloads
   const [downloadingPDFs, setDownloadingPDFs] = useState({});

   // Message state for success/error feedback
   const [message, setMessage] = useState({ type: '', text: '' });

   // Fetch stock reports on component mount
   useEffect(() => {
      const fetchStockReports = async () => {
         try {
            const res = await axiosInstance.get('/stock-report/');
            setStockReport(res.data);
         } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch stock reports. Please refresh the page.' });
         }
      };
      fetchStockReports();
   }, [setStockReport]);

   // Clear messages after 5 seconds
   useEffect(() => {
      if (message.text) {
         const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [message]);

   /**
    * Formats ISO date string to readable format
    * @param {string} isoDate - ISO date string
    * @returns {string} Formatted date string
    */
   const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('en-IN', {
         day: '2-digit',
         month: 'short',
         year: 'numeric',
      });
   };

   /**
    * Handles PDF download for stock reports with loading state
    * @param {string} reportId - The stock report ID
    */
   const downloadPDF = async (reportId) => {
      if (!reportId) {
         setMessage({ type: 'error', text: 'No report ID available for download' });
         return;
      }

      setDownloadingPDFs(prev => ({ ...prev, [reportId]: true }));
      setMessage({ type: '', text: '' }); // Clear any existing messages

      try {
         const res = await axiosInstance.get(`/stock-report/${reportId}/pdf`, {
            responseType: 'blob'
         });

         // Create and trigger download
         const url = window.URL.createObjectURL(new Blob([res.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `stock-report-${reportId}.pdf`);
         document.body.appendChild(link);
         link.click();
         link.remove();

         // Clean up the URL object
         window.URL.revokeObjectURL(url);

         setMessage({ type: 'success', text: 'Stock report PDF downloaded successfully!' });
      } catch (err) {
         const errorMessage = err.response?.data?.msg || 'Failed to download stock report PDF';
         setMessage({ type: 'error', text: errorMessage });
      } finally {
         setDownloadingPDFs(prev => ({ ...prev, [reportId]: false }));
      }
   };

   return (
      <div className={`rounded-xl shadow transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

         {/* Message Display */}
         {message.text && (
            <div className={`m-4 p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${message.type === 'success'
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

         {/* Header Section */}
         <div
            onClick={() => setShowStockReports(!showStockReports)}
            className={`p-2 flex items-center justify-between rounded-t-xl cursor-pointer transition-colors duration-200 ${theme === 'dark'
               ? 'bg-orange-800 hover:bg-orange-700'
               : 'bg-orange-900 hover:bg-orange-800'
               }`}
         >
            <span className='text-white'>Stock Reports ({stockReport.length})</span>
            <span>
               <MdOutlineKeyboardArrowDown
                  className={`text-white text-lg ml-2 transition-transform ${showStockReports ? 'rotate-180' : ''}`}
               />
            </span>
         </div>

         {/* Stock Reports Content */}
         <div className='p-4 w-full'>
            {!showStockReports ? (
               <div className='flex items-center justify-between'>
                  <button
                     onClick={() => setShowStockReports(true)}
                     className={`text-sm flex items-center gap-2 transition-colors duration-200 ${theme === 'dark'
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'text-orange-900 hover:text-orange-700'
                        }`}
                  >
                     Click to view Stock reports
                  </button>
               </div>
            ) : (
               <div>
                  {/* Table Header */}
                  <div className={`flex font-semibold text-xs rounded-t-lg transition-colors duration-200 ${theme === 'dark'
                     ? 'bg-gray-700 text-gray-200'
                     : 'bg-gray-100 text-gray-800'
                     }`}>
                     <div className={`flex-1 p-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>Date</div>
                     <div className={`flex-1 p-2 border-b transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>Supplier</div>
                  </div>

                  {/* Stock Reports List */}
                  {stockReport.length === 0 ? (
                     <div className={`p-4 text-center border-b transition-colors duration-200 ${theme === 'dark'
                        ? 'text-gray-400 border-gray-600'
                        : 'text-gray-400 border-gray-200'
                        }`}>
                        No stock reports found. Create your first stock report to see it here.
                     </div>
                  ) : (
                     stockReport.map((stock) => {
                        const reportId = stock.id || stock._id;

                        return (
                           <React.Fragment key={reportId}>
                              {/* Stock Report Row */}
                              <div className={`flex items-center text-xs border-b last:border-b-0 transition-colors duration-200 mt-1 ${theme === 'dark'
                                 ? 'hover:bg-gray-700 border-gray-600 text-gray-200'
                                 : 'hover:bg-gray-50 border-gray-200 text-gray-800'
                                 }`}>
                                 <div className="flex-1 p-2">{formatDate(stock.createdAt)}</div>
                                 <div className="flex-1 p-2">{stock.supplier}</div>
                              </div>

                              {/* PDF Download Button */}
                              <div className="flex w-full justify-center items-center gap-2 mt-1 mb-2">
                                 <button
                                    onClick={() => downloadPDF(reportId)}
                                    disabled={downloadingPDFs[reportId]}
                                    className={`w-full flex items-center justify-center gap-2 text-xs py-1 px-2 border-[1px] rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${downloadingPDFs[reportId]
                                       ? theme === 'dark'
                                          ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-60 bg-gray-700'
                                          : 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60 bg-white'
                                       : theme === 'dark'
                                          ? 'border-gray-400 hover:bg-gray-700 cursor-pointer bg-gray-800 text-gray-200 focus:ring-gray-500 focus:ring-offset-gray-800'
                                          : 'border-zinc-900 hover:bg-gray-50 cursor-pointer bg-white text-gray-800 focus:ring-gray-400 focus:ring-offset-white'
                                       }`}
                                 >
                                    <span>
                                       {downloadingPDFs[reportId] ? (
                                          <AiOutlineLoading3Quarters className='text-md animate-spin' />
                                       ) : (
                                          <FaFilePdf className='text-md' />
                                       )}
                                    </span>
                                    <span>
                                       {downloadingPDFs[reportId] ? 'Downloading...' : 'Download PDF'}
                                    </span>
                                 </button>
                              </div>
                           </React.Fragment>
                        );
                     })
                  )}
               </div>
            )}
         </div>
      </div>
   );
}

export default Stocks;