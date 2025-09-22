import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import { HiOutlineScale } from "react-icons/hi";
import stockReportPNG from "../assets/stock-report.png";
import createOrder from "../assets/create-order.png";
import axiosInstance from "../api/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";

/**
 * HistoryDetail component - Displays detailed view of a history item
 * with download functionality for PDFs
 */
function HistoryDetail() {
  const { theme } = useTheme();
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get item data from navigation state
  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!item);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleting, setDeleting] = useState(false);
  const [downloadingPDFs, setDownloadingPDFs] = useState({});

  // Fetch item data if not available from navigation state
  useEffect(() => {
    if (!item) {
      fetchItemData();
    }
  }, [id, type]);

  function formatDate() {
    const data = new Date(item.createdAt);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return data.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  }

  const fetchItemData = async () => {
    setLoading(true);
    try {
      let endpoint = type === "order" ? `/order/${id}` : `/stock-report/${id}`;
      const res = await axiosInstance.get(endpoint);

      // Format the data to match our structure
      const formattedItem = {
        id: res.data._id || res.data.id,
        type: type,
        title: type === "order" ? "Order Creation" : "Stock Report",
        supplierName: res.data.supplier,
        amount: res.data.totalAmount || null,
        weight: res.data.totalWeight || null,
        createdAt: res.data.createdAt,
        icon: type === "order" ? createOrder : stockReportPNG,
        data: res.data,
      };

      setItem(formattedItem);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to fetch item details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
        month: "long",
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
   * Handles PDF download
   * @param {string} downloadType - Download type ('shopkeeper', 'supplier', or 'stock')
   */
  const handleDownload = async (downloadType) => {
    const downloadKey =
      downloadType === "stock" ? `stock-${id}` : `order-${id}-${downloadType}`;
    setDownloadingPDFs((prev) => ({ ...prev, [downloadKey]: true }));
    setMessage({ type: "", text: "" });

    try {
      let endpoint, filename;

      if (downloadType === "stock") {
        endpoint = `/stock-report/${id}/pdf`;
        filename = `${item.supplierName
          ?.replace(/\s+/g, "-")
          .toUpperCase()}-STOCK-REPORT-${formatDate().toUpperCase()}.pdf`;
      } else {
        endpoint = `/order/${id}/pdf?type=${downloadType}`;
        filename = `order-${id}-${downloadType}.pdf`;
        filename = `${item.supplierName.replace(/\s+/g, "-").toUpperCase()}-${
          downloadType === "supplier" ? "ORDER" : type.toUpperCase()
        }-LIST-${formatDate().toUpperCase()}${
          downloadType === "shopkeeper" ? "-SHOPKEEPER-VERSION" : ""
        }.pdf`;
      }

      const res = await axiosInstance.get(endpoint, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: `${
          downloadType === "stock"
            ? "Stock report"
            : downloadType.charAt(0).toUpperCase() + downloadType.slice(1)
        } PDF downloaded successfully!`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to download ${
          downloadType === "stock" ? "stock report" : downloadType
        } PDF`,
      });
    } finally {
      setDownloadingPDFs((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };
  const handleDelete = async () => {
    setDeleting(true);

    try {
      await axiosInstance.delete(`/order/delete/${id}`);
      setMessage({
        type: "success",
        text: "History item deleted successfully!",
      });
      navigate("/history");
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to delete history item. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };
  const handleStockReportDelete = async () => {
    setDeleting(true);

    try {
      await axiosInstance.delete(`/stock-report/delete/${id}`);
      setMessage({
        type: "success",
        text: "History item deleted successfully!",
      });
      navigate("/history");
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to delete history item. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`pt-16 p-4 flex flex-col items-center justify-center min-h-screen max-w-[500px] w-screen mx-auto transition-colors duration-200 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
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
          Loading details...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className={`pt-16 p-4 flex flex-col items-center justify-center min-h-screen max-w-[500px] w-screen mx-auto transition-colors duration-200 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <p
          className={`text-sm mb-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Item not found
        </p>
        <button
          onClick={() => navigate("/history")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Back to History
        </button>
      </div>
    );
  }

  const { date, time } = formatDateTime(item.createdAt);
  const isOrderType = item.type === "order";

  return (
    <div
      className={`pt-20 p-4 flex flex-col gap-4 max-w-[500px] pb-20 w-screen min-h-screen mx-auto transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-2">
        <div>
          <h1
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {item.title}
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {item.supplierName}
          </p>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-3 rounded-lg text-xs font-medium border transition-colors duration-200 ${
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

      {/* Details Section - Dashboard card style */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {isOrderType ? "Order Details" : "Stock Report Details"}
        </h3>

        <div className="space-y-3">
          {/* Supplier Info */}
          <div className="flex items-center gap-3">
            <IoPersonOutline
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Supplier Name
              </p>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {item.supplierName}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <IoCalendarOutline
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Created On
              </p>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {date} at {time}
              </p>
            </div>
          </div>

          {/* Order-specific details */}
          {isOrderType && (
            <>
              {/* Amount */}
              <div className="flex items-center gap-3">
                <IoPricetagOutline
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Amount
                  </p>
                  <p
                    className={`text-md font-semibold ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ₹{item.amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Weight */}
              {item.weight && (
                <div className="flex items-center gap-3">
                  <HiOutlineScale
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Weight
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {item.weight} kg
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Download Section - Dashboard card style with consistent buttons */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <h3
          className={`text-sm font-medium mb-4 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Download PDF Reports
        </h3>

        <div className="space-y-3">
          {isOrderType ? (
            <>
              {/* Shopkeeper PDF Button - Dashboard style */}
              <button
                onClick={() => handleDownload("shopkeeper")}
                disabled={downloadingPDFs[`order-${id}-shopkeeper`]}
                className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-lg transition-all duration-200 font-medium ${
                  downloadingPDFs[`order-${id}-shopkeeper`]
                    ? "text-white bg-violet-600 opacity-60 cursor-not-allowed"
                    : "text-white bg-violet-600 "
                }`}
              >
                {downloadingPDFs[`order-${id}-shopkeeper`] ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <IoMdDownload />
                    <span>Download (Shopkeeper Version)</span>
                  </>
                )}
              </button>
              {/* Supplier PDF Button - Dashboard style */}
              <button
                onClick={() => handleDownload("supplier")}
                disabled={downloadingPDFs[`order-${id}-supplier`]}
                className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-md transition-all duration-200 font-medium ${
                  downloadingPDFs[`order-${id}-supplier`]
                    ? "text-white bg-violet-600 cursor-not-allowed opacity-60"
                    : "text-white bg-violet-600"
                }`}
              >
                {downloadingPDFs[`order-${id}-supplier`] ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <IoMdDownload />
                    <span>Download (Supplier Version)</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Stock Report PDF Button - Dashboard style */
            <button
              onClick={() => handleDownload("stock")}
              disabled={downloadingPDFs[`stock-${id}`]}
              className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-md transition-all duration-200 font-medium ${
                downloadingPDFs[`stock-${id}`]
                  ? "text-white bg-violet-600 opacity-60  cursor-not-allowed"
                  : "text-white bg-violet-600"
              }`}
            >
              {downloadingPDFs[`stock-${id}`] ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <IoMdDownload />
                  <span>Download</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <h3
          className={`text-sm font-medium mb-4 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Manage
        </h3>
        <div>
          <button
            onClick={() =>
              isOrderType ? handleDelete() : handleStockReportDelete()
            }
            disabled={deleting}
            className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-lg transition-all duration-200 font-medium ${
              deleting
                ? "text-white bg-red-300 opacity-60 cursor-not-allowed"
                : "text-white bg-red-400 "
            }`}
          >
            {deleting ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <MdDeleteOutline size={14} color="white" />
                <span>Delete History</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetail;
