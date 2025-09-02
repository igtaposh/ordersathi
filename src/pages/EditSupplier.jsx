import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTheme } from "../context/ThemeContext";

import { motion, AnimatePresence } from "framer-motion";
import { IoArrowUndoOutline, IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineSave } from "react-icons/md";
import { BiError } from "react-icons/bi";
import Popup from "../components/Popup";

/**
 * EditSupplier Component
 * Handles supplier editing functionality with form validation and loading states
 * @returns {JSX.Element} EditSupplier component
 */
function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form state management
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
  });

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({ updating: false });

  // Message state for user feedback
  const [message, setMessage] = useState({
    text: "",
    type: "", // 'success', 'error', 'info'
  });

  /**
   * Display message to user with auto-hide functionality
   * @param {string} text - Message text
   * @param {string} type - Message type (success/error/info)
   */

  /**
   * Fetch supplier data on component mount
   */
  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) {
        setMessage({ text: "Invalid supplier ID", type: "error" });
        navigate(`/supplier-profile/${id}`);
        return;
      }

      try {
        const response = await axiosInstance.get(`/supplier/${id}`);
        const supplierData = response.data;

        setForm({
          name: supplierData.name || "",
          contact: supplierData.contact || "",
          address: supplierData.address || "",
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to load supplier data";
        setMessage({ text: errorMessage, type: "error" });
        navigate(`/supplier-profile/${id}`);
      }
    };

    fetchSupplier();
  }, [id, navigate]);

  /**
   * Validate form data before submission
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    if (!form.name?.trim()) {
      setMessage({ text: "Supplier name is required", type: "error" });
      return false;
    }
    if (!form.contact?.trim()) {
      setMessage({ text: "Contact number is required", type: "error" });
      return false;
    }
    if (!form.address?.trim()) {
      setMessage({ text: "Address is required", type: "error" });
      return false;
    }

    // Email validation

    // Contact validation (basic phone number check)
    const contactRegex = /^[\d\-\+\(\)\s]+$/;
    if (!contactRegex.test(form.contact)) {
      setMessage({
        text: "Please enter a valid contact number",
        type: "error",
      });
      return false;
    }

    return true;
  };

  /**
   * Handle supplier update submission
   * @param {Event} e - Form submit event
   */
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoadingStates((prev) => ({ ...prev, updating: true }));

    try {
      await axiosInstance.put(`/supplier/${id}`, form);
      navigate(`/supplier-profile/${id}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to update supplier. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoadingStates((prev) => ({ ...prev, updating: false }));
    }
  };

  return (
    <div
      className={`
            max-w-[500px] w-screen min-h-screen mx-auto 
            py-16 px-4 relative
            transition-colors duration-200
            ${theme === "dark" ? "bg-gray-900" : "bg-white"}
         `}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
                  rounded-md px-4 mt-6 py-2 mb-3
                  transition-colors duration-200  text-[10px]
                  ${
                    theme === "dark"
                      ? "bg-gray-800"
                      : "bg-gray-100 border text-gray-800 border-gray-200"
                  }
                  shadow-md
               `}
      >
        <li>
          Update the fields below and click 'Update' to securely save your
          changes.
        </li>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
                  rounded-md px-4 py-2 mb-3
                  transition-colors duration-200 text-[10px]
                  ${
                    theme === "dark"
                      ? "bg-gray-800"
                      : "bg-gray-100 border text-gray-800 border-gray-200"
                  }
                  shadow-md
               `}
      >
        <li>
          Please complete all required fields (those without the 'Optional' tag)
          to proceed.
        </li>
      </motion.div>
      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
            rounded-lg p-6 mb-4
            transition-colors duration-200
            ${
              theme === "dark"
                ? "bg-gray-800"
                : "bg-gray-100 border border-gray-200"
            }
            shadow-md
         `}
      >
        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                     ${theme === "dark" ? "text-gray-300" : "text-gray-900"}
                  `}
            >
              Enter Supplier Name
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. sh enterprise"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`
                        w-full p-3 rounded-lg text-xs
                        outline-none transition-colors duration-200
                        ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-100 placeholder-gray-500"
                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                        }
                     `}
            />
          </div>
          <div>
            <label
              className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                     ${theme === "dark" ? "text-gray-300" : "text-gray-900"}
                  `}
            >
              Phone Number (Optional)
            </label>
            <input
              type="number"
              value={form.contact}
              placeholder="e.g. +123456789"
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={`
                        w-full p-3 rounded-lg text-xs
                        outline-none transition-colors duration-200
                        ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-100 placeholder-gray-500"
                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                        }
                     `}
            />
          </div>
          <div>
            <label
              className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                     ${theme === "dark" ? "text-gray-300" : "text-gray-900"}
                  `}
            >
              Address (Optional)
            </label>
            <input
              type="text"
              value={form.address}
              placeholder="e.g. 123 Main St"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`
                        w-full p-3 rounded-lg text-xs
                        outline-none transition-colors duration-200
                        ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-100 placeholder-gray-500"
                            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                        }
                     `}
            />
          </div>
        </div>

        {/* Action Buttons */}
      </motion.div>

      {/* Success/Error Popup */}
      {message.text && (
        <Popup onClose={() => updateState({ message: { type: "", text: "" } })}>
          <div
            className={`
                  w-full rounded-lg px-4 pt-8 pb-4
                  flex flex-col items-center gap-6
                  ${theme === "dark" ? "bg-gray-800" : "bg-white"}
                  shadow-xl border
                  ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
               `}
          >
            <div
              className={`
                     w-12 h-12 rounded-full
                     flex items-center justify-center
                     ${theme === "dark" ? "bg-red-500/10" : "bg-red-50"}
                  `}
            >
              <BiError
                className={`text-2xl ${
                  theme === "dark" ? "text-red-400" : "text-red-500"
                }`}
              />
            </div>

            <p
              className={`text-center text-xs ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {message.text}
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className={`
                           flex-1 py-2.5 rounded-md
                           text-[10px] font-medium
                           transition-colors duration-200
                           hover:scale-[0.98] active:scale-[0.97]
      
      ${
        theme === "dark"
          ? "text-red-400 bg-red-500/10"
          : "text-red-600 bg-red-500/10"
      }
      
                        `}
              >
                Close
              </button>
            </div>
          </div>
        </Popup>
      )}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2
          w-[90%] rounded-md max-w-md 
          px-6 py-3
          flex items-center gap-2 z-50 
          transition-all duration-500
          backdrop-blur-sm shadow-inner
          ${form.name ? " bottom-2" : "-bottom-32"}  ${
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700"
            : "bg-gray-100 border border-gray-200"
        }
        `}
      >
        <button
          onClick={() => navigate(-1)}
          className={`
      w-full p-3 rounded-lg
      text-xs font-medium
      transition-all duration-200
      flex items-center justify-center gap-2
      hover:scale-[0.98] active:scale-[0.97]
      ${
        theme === "dark"
          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
          : "bg-white border border-gray-300 text-gray-600"
      }
    `}
        >
          <IoArrowUndoOutline className="text-base" />
          <span>Discard</span>
        </button>

        <button
          onClick={handleUpdate}
          disabled={loadingStates.updating}
          className={`
      w-full p-3 rounded-lg
      flex items-center justify-center gap-2
      text-xs font-medium
      transition-all duration-200
      hover:scale-[0.98] active:scale-[0.97]
      disabled:opacity-60 
      disabled:cursor-not-allowed 
      disabled:hover:scale-100
      ${
        loadingStates.updating
          ? theme === "dark"
            ? "bg-gray-700 text-gray-500"
            : "bg-gray-100 text-gray-400"
          : theme === "dark"
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-green-500 text-white hover:bg-green-600"
      }
    `}
        >
          {loadingStates.updating ? (
            <AiOutlineLoading3Quarters className="animate-spin text-base" />
          ) : (
            <>
              <MdOutlineSave className="text-base" />
              <span>Update</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EditSupplier;
