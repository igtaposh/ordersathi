import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiError } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axiosInstance from "../api/axiosInstance";
import Popup from "../components/Popup";
import { IoArrowUndoOutline } from "react-icons/io5";
import { MdOutlineClose, MdOutlineSave } from "react-icons/md";
import CustomAlert from "../components/CustomAlert";

function CreateSupplier() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [state, setState] = useState({
    isLoading: false,
    newSupplierId: null,
    message: { type: "", text: "" },
    vertical: "top",
    horizontal: "center",
    open: false,
  });

  const { isLoading, message, newSupplierId, vertical, horizontal, open } =
    state;

  // Handle form updates
  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle state updates
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateState({ message: { type: "", text: "" } });
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleAdd = async () => {
    const { name, phone, address } = form;

    if (!name.trim()) {
      updateState({
        message: {
          type: "error",
          text: "Please enter a valid name for the supplier",
        },
      });
      return;
    }

    updateState({ isLoading: true, message: { type: "", text: "" } });

    try {
      const response = await axiosInstance.post("/supplier/add", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      updateState({
        message: {
          type: "success",
          text: "Supplier added successfully !",
        },
        newSupplierId: response.data.supplier._id,
      });
    } catch (error) {
      updateState({
        message: {
          type: "error",
          text:
            error.response?.data?.msg ||
            "There was an error adding the supplier",
        },
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <div
      className={`
            max-w-[500px] w-screen min-h-screen mx-auto 
            py-16 px-4 relative
            transition-colors duration-200
            ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}
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
                : "bg-white border text-gray-700 border-gray-900/20"
            }
            shadow-sm
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
                : "bg-white border text-gray-700 border-gray-900/20"
            }
            shadow-sm
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
                : "bg-white border border-gray-900/20"
            }
            shadow-sm
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
              Enter Name of Supplier
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. Karim Drug House"
              onChange={(e) => updateForm("name", e.target.value)}
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
              value={form.number}
              onChange={(e) => updateForm("number", e.target.value)}
              placeholder="0123456789"
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
              onChange={(e) => updateForm("address", e.target.value)}
              placeholder="e.g. 123 Main St"
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
      </motion.div>
      {/* Action Buttons */}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2
          w-[92%] rounded-md max-w-md 
          px-6 py-3
          flex items-center gap-2 z-50 
          transition-all duration-500
          ${form.name ? " bottom-2" : "-bottom-32"}  ${
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white border border-gray-900/20"
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
          : "bg-gray-50 border border-gray-300 text-gray-600"
      }
    `}
        >
          <IoArrowUndoOutline className="text-base" />
          <span>Discard</span>
        </button>

        <button
          onClick={handleAdd}
          disabled={isLoading}
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
        isLoading
          ? theme === "dark"
            ? "bg-gray-700 text-gray-500"
            : "bg-gray-100 text-gray-400"
          : theme === "dark"
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-green-500 text-white hover:bg-green-600"
      }
    `}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-base" />
          ) : (
            <>
              <MdOutlineSave className="text-base" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* Success/Error Popup */}

      <CustomAlert
        msg={message.text}
        msgType={message.type}
        onClose={() => updateState({ message: { type: "", text: "" } })}
        isOpen={!!message.text}
        btnLink={newSupplierId ? `/supplier-profile/${newSupplierId}` : null}
      />
    </div>
  );
}

export default CreateSupplier;
