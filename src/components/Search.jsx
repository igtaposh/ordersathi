import React, { useState, useRef, useEffect, useContext } from 'react'
import { useTheme } from '../context/ThemeContext';
import { RiSearchLine, RiCalendarLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { CgOptions } from 'react-icons/cg';

// Custom Date Picker Component
const CustomDatePicker = ({ value, onChange, placeholder = "Select date" }) => {
   const { theme } = useTheme();
   const [isOpen, setIsOpen] = useState(false);
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
   const datePickerRef = useRef(null);

   const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
   ];

   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

   // Close date picker when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Get days in month
   const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];

      // Add empty cells for previous month
      for (let i = 0; i < startingDayOfWeek; i++) {
         days.push(null);
      }

      // Add days of current month
      for (let day = 1; day <= daysInMonth; day++) {
         days.push(new Date(year, month, day));
      }

      return days;
   };

   const handleDateSelect = (date) => {
      setSelectedDate(date);
      onChange(date);
      setIsOpen(false);
   };

   const handlePrevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
   };

   const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
   };

   const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
   };

   const isToday = (date) => {
      const today = new Date();
      return date &&
         date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
   };

   const isSelected = (date) => {
      return selectedDate &&
         date &&
         date.getDate() === selectedDate.getDate() &&
         date.getMonth() === selectedDate.getMonth() &&
         date.getFullYear() === selectedDate.getFullYear();
   };

   return (
      <div className="relative" ref={datePickerRef}>
         {/* Date Input */}
         <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-[10px] h-10 px-3 py-2 rounded-lg border cursor-pointer flex items-center justify-between transition-all duration-200 ${theme === 'dark'
               ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-600'
               : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
               } ${isOpen ? (theme === 'dark' ? 'border-blue-500' : 'border-blue-500') : ''}`}
         >
            <span className={`text-[10px] ${selectedDate ? '' : 'opacity-50'}`}>
               {selectedDate ? formatDate(selectedDate) : placeholder}
            </span>
            <RiCalendarLine className={`text-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
         </div>

         {/* Date Picker Dropdown */}
         {isOpen && (
            <div className={`absolute top-full left-0 mt-2 w-50 p-4 rounded-xl shadow-2xl border z-50 ${theme === 'dark'
               ? 'bg-gray-800 border-gray-700'
               : 'bg-white border-gray-200'
               }`}>
               {/* Header */}
               <div className="flex items-center justify-between mb-4">
                  <button
                     onClick={handlePrevMonth}
                     className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                  >
                     <RiArrowLeftSLine className={`text-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>

                  <h3 className={`font-semibold text-[10px] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                     {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>

                  <button
                     onClick={handleNextMonth}
                     className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                  >
                     <RiArrowRightSLine className={`text-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
               </div>

               {/* Days of Week */}
               <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map(day => (
                     <div key={day} className={`p-2 text-center text-[10px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {day}
                     </div>
                  ))}
               </div>

               {/* Calendar Days */}
               <div className="grid grid-cols-7 gap-1 ">
                  {getDaysInMonth(currentDate).map((date, index) => (
                     <button
                        key={index}
                        onClick={() => date && handleDateSelect(date)}
                        disabled={!date}
                        className={`p-2 text-[10px] rounded-lg transition-all duration-200 ${!date
                           ? 'invisible'
                           : isSelected(date)
                              ? 'bg-blue-500 text-white shadow-md'
                              : isToday(date)
                                 ? theme === 'dark'
                                    ? 'bg-gray-700 text-blue-400 border border-blue-500'
                                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                                 : theme === 'dark'
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                           }`}
                     >
                        {date && date.getDate()}
                     </button>
                  ))}
               </div>

               {/* Quick Actions */}
               <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                     onClick={() => handleDateSelect(new Date())}
                     className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                  >
                     Today
                  </button>
                  <button
                     onClick={() => {
                        setSelectedDate(null);
                        onChange(null);
                        setIsOpen(false);
                     }}
                     className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                        }`}
                  >
                     Clear
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

function Search({ onFiltersUpdate, enableDate = true, enableSupplier = false, suppliers = [] }) {
   const { theme } = useTheme();
   const [searchQuery, setSearchQuery] = useState('');
   const [showFilters, setShowFilters] = useState(false);
   const [selectedDate, setSelectedDate] = useState(null);
   const [activeFilters, setActiveFilters] = useState([]);
   const [selectedSupplier, setSelectedSupplier] = useState(''); // new

   const filterOptions = [
      { id: 'newest', label: 'Newest', icon: '📅' },
      { id: 'oldest', label: 'Oldest', icon: '📆' },
   ];

   useEffect(() => {
      if (onFiltersUpdate) {
         onFiltersUpdate({
            activeFilters,
            searchQuery,
            selectedDate: enableDate ? selectedDate : null,
            selectedSupplier: enableSupplier ? selectedSupplier : ''
         });
      }
   }, [activeFilters, searchQuery, selectedDate, selectedSupplier, onFiltersUpdate, enableDate, enableSupplier]);

   const toggleFilter = (filterId) => {
      setActiveFilters(prev =>
         prev.includes(filterId)
            ? prev.filter(id => id !== filterId)
            : [...prev, filterId]
      );
   };

   const handleDateChange = (date) => setSelectedDate(date);

   return (
      <div className="space-y-4">
         {/* Search Input */}
         <div className={`w-full h-12 rounded-xl flex items-center transition-all duration-200 border ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}>
            <span className='p-2 flex items-center justify-center'>
               <RiSearchLine className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </span>
            <input
               type="text"
               placeholder='Search ...'
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className='w-full h-full bg-transparent outline-none text-sm placeholder-opacity-50'
               maxLength={30}
            />
            <button
               onClick={() => setShowFilters(!showFilters)}
               className={`p-2 rounded-lg mr-2 transition-colors ${theme === 'dark'
                  ? ' text-gray-300'
                  : ' text-gray-600'
                  }`}
            >
               <CgOptions className='text-lg' />
            </button>
         </div>

         {/* Filters Section */}
         {showFilters && (
            <div className={`p-4 rounded-xl border transition-all duration-200 ${theme === 'dark'
               ? 'bg-gray-800 border-gray-700'
               : 'bg-gray-50 border-gray-200'
               }`}>
               {/* Filter Tags */}
               <div className='flex flex-wrap gap-2 mb-4'>
                  {filterOptions.map(filter => (
                     <button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-medium transition-all duration-200 flex items-center gap-2 ${activeFilters.includes(filter.id)
                           ? 'bg-blue-500 text-white shadow-md'
                           : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                           }`}
                     >
                        <span>{filter.icon}</span>
                        {filter.label}
                     </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Date Picker (optional) */}
                  {enableDate && (
                     <div className="space-y-2">
                        <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                           Filter by Date
                        </label>
                        <CustomDatePicker
                           value={selectedDate}
                           onChange={handleDateChange}
                           placeholder="Select date"
                        />
                     </div>
                  )}

                  {/* Supplier Filter (optional) */}
                  {enableSupplier && (
                     <div className="space-y-2">
                        <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                           Filter by Supplier
                        </label>
                        <select
                           value={selectedSupplier}
                           onChange={(e) => setSelectedSupplier(e.target.value)}
                           className={`w-full h-10 px-3 rounded-lg text-sm border transition-colors ${theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-gray-200'
                              : 'bg-white border-gray-300 text-gray-800'
                              }`}
                        >
                           <option value="">All suppliers</option>
                           {suppliers?.map(s => (
                              <option key={s._id} value={s._id}>{s.name}</option>
                           ))}
                        </select>
                     </div>
                  )}
               </div>

               {/* Clear Filters */}
               <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                     {(activeFilters.length)
                        + (enableDate && selectedDate ? 1 : 0)
                        + (enableSupplier && selectedSupplier ? 1 : 0)} filter(s) active
                  </span>
                  <button
                     onClick={() => {
                        setActiveFilters([]);
                        if (enableDate) setSelectedDate(null);
                        if (enableSupplier) setSelectedSupplier('');
                     }}
                     className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                        }`}
                  >
                     Clear All
                  </button>
               </div>
            </div>
         )}

         {/* Active Filters Display */}
         {(activeFilters.length > 0 || (enableDate && selectedDate) || (enableSupplier && selectedSupplier)) && (
            <div className="flex flex-wrap gap-2">
               {activeFilters.map(filterId => {
                  const filter = filterOptions.find(f => f.id === filterId);
                  return (
                     <span
                        key={filterId}
                        className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1 ${theme === 'dark'
                           ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                           : 'bg-blue-100 text-blue-700 border border-blue-200'
                           }`}
                     >
                        {filter?.icon} {filter?.label}
                        <button
                           onClick={() => toggleFilter(filterId)}
                           className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                           ×
                        </button>
                     </span>
                  );
               })}
               {enableDate && selectedDate && (
                  <span
                     className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1 ${theme === 'dark'
                        ? 'bg-green-900/30 text-green-300 border border-green-700'
                        : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                  >
                     📅 {selectedDate.toLocaleDateString('en-GB')}
                     <button
                        onClick={() => setSelectedDate(null)}
                        className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                     >
                        ×
                     </button>
                  </span>
               )}
               {enableSupplier && selectedSupplier && (
                  <span
                     className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1 ${theme === 'dark'
                        ? 'bg-purple-900/30 text-purple-300 border border-purple-700'
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}
                  >
                     🏪 {suppliers.find(s => s._id === selectedSupplier)?.name || 'Supplier'}
                     <button
                        onClick={() => setSelectedSupplier('')}
                        className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                     >
                        ×
                     </button>
                  </span>
               )}
            </div>
         )}
      </div>
   );
}

export default Search;