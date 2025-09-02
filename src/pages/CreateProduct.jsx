import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidAddToQueue } from "react-icons/bi";
import { BiError } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SupplierContext } from "../context/SupplierContext";
import axiosInstance from "../api/axiosInstance";
import Popup from "../components/Popup";
import { IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineSave } from "react-icons/md";
import { IoArrowUndoOutline } from "react-icons/io5";

function CreateProduct() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  
  const [form, setForm] = useState({
    name: "",
    weight: "",
    rate: "",
    mrp: "",
    type: "Piece",
    supplierId: "",
  });

  const [state, setState] = useState({
    isLoading: false,
    newProductId: null,
    message: { type: "", text: "" },
  });

  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const { isLoading, message, newProductId } = state;

  // Define product types array
  const productTypes = [
    "Piece",
    "Bag",
    "Box",
    "Ltr",
    "Case",
    "Pkt",
    "Kg",
    "Patta",
    "Dozen",
  ];

  // Handle form updates
  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle state updates
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleAdd = async () => {
    const { name, rate, supplierId, weight, mrp, type } = form;

    if (
      !name.trim() ||
      !rate ||
      !weight.trim() ||
      !mrp ||
      !type.trim() ||
      !supplierId
    ) {
      updateState({
        message: { type: "error", text: "Please fill all fields" },
      });
      return;
    }

    updateState({ isLoading: true, message: { type: "", text: "" } });

    try {
      const response = await axiosInstance.post(`/product/add/${supplierId}`, {
        name: name.trim(),
        rate,
        weight: weight.trim(),
        mrp,
        type: type.trim(),
      });
      console.log(response.data);
      updateState({
        message: { type: "success", text: "Product added successfully!" },
        newProductId: response.data.product._id,
      });
    } catch (error) {
      updateState({
        message: {
          type: "error",
          text: error.response?.data?.msg || "Failed to add product",
        },
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get("/supplier/");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, [setSuppliers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSupplierDropdownOpen) {
        setIsSupplierDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSupplierDropdownOpen]);

  // Add this useEffect to handle clicking outside for type dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTypeDropdownOpen) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTypeDropdownOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
            max-w-[500px] w-screen min-h-screen mx-auto 
            py-16 px-4 relative
            transition-colors duration-200
            ${theme === "dark" ? "bg-gray-900" : "bg-white"}
         `}
    >
      <div
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
          To add new Products fill out the form below and click on the "save"
          button. It will automatically added on your items port.
        </li>
      </div>
      <div
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
          All the section who don't have the optional tag is mandatory to fill
          out or the form section can't work.
        </li>
      </div>
      {/* Form Container */}
      <div
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
              Enter Name of Product
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. Nivea Men Facewash 200ml"
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

          {/* Supplier Selection */}

          <div className="relative">
            <label
              className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                     ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
                  `}
            >
              Select Supplier
            </label>

            <div
              onClick={() => setIsSupplierDropdownOpen(!isSupplierDropdownOpen)}
              className={`
              w-full p-3 rounded-lg text-xs
              outline-none transition-all duration-200
              flex justify-between items-center
              cursor-pointer
              ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-100 "
                  : "bg-white border border-gray-300 text-gray-900"
              }
            `}
            >
              {form.supplierId ? (
                <span>
                  {suppliers.find((s) => s._id === form.supplierId)?.name}
                </span>
              ) : (
                <span
                  className={`${
                    theme === "dark" ? "text-gray-500 " : "text-gray-500"
                  }`}
                >
                  Not selected
                </span>
              )}

              <motion.div
                animate={{ rotate: isSupplierDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoChevronDownOutline size={16} />
              </motion.div>
            </div>

            <AnimatePresence>
              {isSupplierDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`
          absolute z-50 mt-2
          w-full rounded-lg
          shadow-lg border
          max-h-60 overflow-y-auto
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-200"
          }
        `}
                >
                  {suppliers.map((supplier) => (
                    <motion.div
                      key={supplier._id}
                      onClick={() => {
                        updateForm("supplierId", supplier._id);
                        setIsSupplierDropdownOpen(false);
                      }}
                      whileHover={{
                        backgroundColor:
                          theme === "dark" ? "#374151" : "#F3F4F6",
                      }}
                      className={`
              p-3 text-xs cursor-pointer
              transition-colors duration-200
              ${
                form.supplierId === supplier._id
                  ? theme === "dark"
                    ? "bg-gray-600 text-purple-300"
                    : "bg-purple-50 text-purple-600"
                  : theme === "dark"
                  ? "text-gray-100"
                  : "text-gray-900"
              }
              ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-50"}
            `}
                    >
                      {supplier.name}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Price Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                        ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
                     `}
              >
                MRP (₹)
              </label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => updateForm("mrp", e.target.value)}
                placeholder="200"
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
                        ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
                     `}
              >
                Rate (₹)
              </label>
              <input
                type="number"
                value={form.rate}
                onChange={(e) => updateForm("rate", e.target.value)}
                placeholder="150"
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

          {/* Weight and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`text-xs  font-semibold mb-2 ml-2 block
                        ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
                     `}
              >
                Weight
              </label>
              <div
                className={`w-full h-fit flex overflow-hidden rounded-lg  ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              >
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => {
                    updateForm("weight", e.target.value);
                  }}
                  placeholder="0.5"
                  className={`
                            text-xs flex-1
                            outline-none p-3
                            bg-transparent
                           ${
                             theme === "dark"
                               ? "text-gray-100 placeholder-gray-500"
                               : "text-gray-900 placeholder-gray-400"
                           }
                        `}
                />
              </div>
              {form.weight && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
        text-[10px] mt-1 ml-2
        ${theme === "dark" ? "text-gray-400" : "text-gray-500"}
      `}
                >
                  {form.weight >= 1
                    ? `${form.weight} kg`
                    : `${form.weight * 1000} g`}
                </motion.p>
              )}
            </div>
            {/* Replace the existing select element with this custom dropdown */}
            <div className="relative">
              <label
                className={`text-xs font-semibold mb-2 ml-2 block
      ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
    `}
              >
                Type
              </label>

              <div
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={`
      w-full p-3 rounded-lg text-xs
      outline-none transition-all duration-200
      flex justify-between items-center
      cursor-pointer
      ${
        theme === "dark"
          ? "bg-gray-700 text-gray-100 hover:bg-gray-650"
          : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
      }
    `}
              >
                <span>{form.type}</span>
                <motion.div
                  animate={{ rotate: isTypeDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoChevronDownOutline size={16} />
                </motion.div>
              </div>

              <AnimatePresence>
                {isTypeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`
          absolute z-50 mt-2
          w-full rounded-lg
          shadow-lg border
          max-h-32 overflow-y-auto
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600"
              : "bg-white border border-gray-200"
          }
        `}
                  >
                    {productTypes.map((type) => (
                      <motion.div
                        key={type}
                        onClick={() => {
                          updateForm("type", type);
                          setIsTypeDropdownOpen(false);
                        }}
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#F3F4F6",
                        }}
                        className={`
              p-3 text-xs cursor-pointer
              transition-colors duration-200
              ${
                form.type === type
                  ? theme === "dark"
                    ? "bg-gray-600 text-purple-300"
                    : "bg-purple-50 text-purple-600"
                  : theme === "dark"
                  ? "text-gray-100"
                  : "text-gray-900"
              }
              ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-50"}
            `}
                      >
                        {type}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <li
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-800"
            } text-[10px]`}
          >
            Type is defined for the attributes like pcs (pieces), bag, cs
            (case), box etc.
          </li>
          <li
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-800"
            } text-[10px]`}
          >
            Weight should be in kgs. If product's weight is 750g then write
            "0.75" only.
          </li>
        </div>

        {/* Action Buttons */}
        <div
          className={`
          fixed left-1/2 -translate-x-1/2
          w-[90%] rounded-md max-w-md 
          px-6 py-3
          flex items-center gap-2 z-50 
          transition-all duration-500
          backdrop-blur-sm shadow-inner
          ${form.mrp && form.rate && form.weight && form.name && form.supplierId && form.type ? " bottom-2" : "-bottom-32"}  ${
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
      </div>

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
                     ${
                       message.type === "success"
                         ? theme === "dark"
                           ? "bg-green-500/10"
                           : "bg-green-50"
                         : theme === "dark"
                         ? "bg-red-500/10"
                         : "bg-red-50"
                     }
                  `}
            >
              {message.type === "success" ? (
                <GrStatusGood
                  className={`text-2xl ${
                    theme === "dark" ? "text-green-400" : "text-green-500"
                  }`}
                />
              ) : (
                <BiError
                  className={`text-2xl ${
                    theme === "dark" ? "text-red-400" : "text-red-500"
                  }`}
                />
              )}
            </div>

            <p
              className={`text-center text-xs ${
                message.type === "success"
                  ? theme === "dark"
                    ? "text-green-400"
                    : "text-green-600"
                  : theme === "dark"
                  ? "text-red-400"
                  : "text-red-600"
              }`}
            >
              {message.text}
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => updateState({ message: { type: "", text: "" } })}
                className={`
                           flex-1 py-2.5 rounded-md
                           text-[10px] font-medium
                           transition-colors duration-200
                           hover:scale-[0.98] active:scale-[0.97]
      
      ${
        message.type === "success"
          ? theme === "dark"
            ? "text-green-400 bg-green-500/20"
            : "text-green-600 bg-green-500/20"
          : theme === "dark"
          ? "text-red-400 bg-red-500/10"
          : "text-red-600 bg-red-500/10"
      }
      
                        `}
              >
                Close
              </button>
              {message.type === "success" && (
                <button
                  onClick={() => navigate(`/product-profile/${newProductId}`)}
                  className={`
                           flex-1 py-2.5 rounded-md
                           text-[10px] font-medium
                           transition-colors duration-200
                           ${
                             theme === "dark"
                               ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                               : "bg-green-500 text-white hover:bg-green-600"
                           }
                        `}
                >
                  View Product
                </button>
              )}
            </div>
          </div>
        </Popup>
      )}
    </motion.div>
  );
}

export default CreateProduct;
