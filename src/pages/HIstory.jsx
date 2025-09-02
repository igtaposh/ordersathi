import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "../context/ThemeContext";
import { OrderContext } from "../context/OrderContext";
import { StockReportContext } from "../context/StockReport";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoChevronForward } from "react-icons/io5";
import stockReportPNG from "../assets/stock-report.png";
import createOrder from "../assets/create-order.png";
import Search from "../components/Search";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

/**
 * History component - Displays filtered order and stock history
 * This page serves as a centralized view for historical data
 * including order history and stock reports with search and filter functionality
 */
function History() {
  const { theme } = useTheme();
  const { orders, setOrders } = useContext(OrderContext);
  const { stockReport, setStockReport } = useContext(StockReportContext);
  const navigate = useNavigate();

  // Combined history state
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filter states
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const ordersRes = await axiosInstance.get("/order");
        setOrders(ordersRes.data);

        // Fetch stock reports
        const stockRes = await axiosInstance.get("/stock-report/");
        setStockReport(stockRes.data);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Failed to fetch history data. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setOrders, setStockReport]);

  // Combine and process history data
  useEffect(() => {
    const combineHistory = () => {
      const combinedData = [];

      // Add orders to history
      orders.forEach((order) => {
        combinedData.push({
          id: order._id || order.id,
          type: "order",
          title: "Order Creation",
          supplierName: order.supplier,
          amount: order.totalAmount,
          weight: order.totalWeight,
          createdAt: order.createdAt,
          icon: createOrder,
          data: order,
        });
      });

      // Add stock reports to history
      stockReport.forEach((stock) => {
        combinedData.push({
          id: stock._id || stock.id,
          type: "stock",
          title: "Stock Report",
          supplierName: stock.supplier,
          amount: null,
          weight: null,
          createdAt: stock.createdAt,
          icon: stockReportPNG,
          data: stock,
        });
      });

      // Sort by date (newest first by default)
      let sortedData = combinedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Apply sorting filters
      if (activeFilters.includes("oldest")) {
        sortedData = combinedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }

      // Apply search query filter
      if (searchQuery.trim()) {
        sortedData = sortedData.filter(
          (item) =>
            item.supplierName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.amount?.toString().includes(searchQuery) ||
            item.type?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply date filter
      if (selectedDate) {
        const filterDate = new Date(selectedDate);
        sortedData = sortedData.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate.toDateString() === filterDate.toDateString();
        });
      }

      setFilteredHistory(sortedData);
    };

    combineHistory();
  }, [orders, stockReport, activeFilters, searchQuery, selectedDate]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * Formats ISO date string to readable format
   * @param {string} isoDate - ISO date string
   * @returns {string} Formatted date and time string
   */
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  /**
   * Navigates to history detail page
   * @param {Object} item - The history item
   */
  const handleItemClick = (item) => {
    navigate(`/history/${item.type}/${item.id}`, { state: { item } });
  };

  // Handle filter updates from Search component
  const handleFiltersUpdate = (filters) => {
    setActiveFilters(filters.activeFilters || []);
    setSearchQuery(filters.searchQuery || "");
    setSelectedDate(filters.selectedDate || null);
  };

  if (loading) {
    return (
      <div
        className={`pt-16 p-4 flex flex-col items-center justify-center min-h-screen max-w-[500px] w-screen mx-auto transition-colors duration-200 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <AiOutlineLoading3Quarters
          className={`text-4xl animate-spin mb-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        />
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Loading history...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`pt-16 p-4 flex flex-col gap-4 max-w-[500px] pb-28 w-screen min-h-screen mx-auto transition-colors duration-200 z-10 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Search and Filter Component */}
      <Search onFiltersUpdate={handleFiltersUpdate} />

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${
            message.type === "success"
              ? theme === "dark"
                ? "bg-green-900 text-green-200 border-green-700"
                : "bg-green-100 text-green-800 border-green-200"
              : theme === "dark"
              ? "bg-red-900 text-red-200 border-red-700"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Statistics Summary */}
      <div
        className={`p-4 rounded-lg border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Items
            </p>
            <p
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {filteredHistory.length}
            </p>
          </div>
          <div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Orders
            </p>
            <p
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {filteredHistory.filter((item) => item.type === "order").length}
            </p>
          </div>
          <div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Reports
            </p>
            <p
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {filteredHistory.filter((item) => item.type === "stock").length}
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div
          className={`p-8 text-center rounded-lg border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <p className="text-sm mb-2">No history found</p>
          <p className="text-xs opacity-75">
            {searchQuery || activeFilters.length > 0 || selectedDate
              ? "Try adjusting your filters or search terms"
              : "Create orders or stock reports to see history here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const { date, time } = formatDateTime(item.createdAt);

            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleItemClick(item)}
                className={`w-full shadow-sm p-2 gap-2 rounded-lg flex items-center cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  theme === "dark"
                    ? "bg-gray-800"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <span
                    className={`relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-10 h-10 object-contain"
                    />
                  </span>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.title}
                      </span>
                      <h3
                        className={`text-sm font-medium truncate ${
                          theme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {item.supplierName}
                      </h3>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {date}, {time}
                      </p>
                    </div>

                    {/* Amount Display for Orders */}
                    {item.type === "order" && (
                      <div className="text-right ml-2">
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Amount
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          ₹{item.amount?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chevron Icon */}
                <div className="flex-shrink-0 ml-2">
                  <IoChevronForward
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default History;
