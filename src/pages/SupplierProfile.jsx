import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { IoArrowBack, IoCameraOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SupplierContext } from "../context/SupplierContext";
import { ProductContext } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";

function SupplierProfile() {
  const { id } = useParams();
  const { supplier, setSupplier } = useContext(SupplierContext);
  const { products, setProducts } = useContext(ProductContext);
  console.log(products);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [loadingStates, setLoadingStates] = useState({
    deleting: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axiosInstance.get(`/supplier/${id}`);
        setSupplier(response.data);
        console.log(response.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.msg || "Failed to load supplier",
        });
      }
    };

    fetchSupplier();
  }, [setSupplier]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/product`);
        setProducts(response.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.msg || "Failed to load Products length",
        });
      }
    };

    fetchProducts();
  }, [setProducts]);

  const initials = (name) => {
    if (!name) return "S";
    const words = name.split(" ");
    return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
  };

  const supplierDetails = [
    {
      label: "Contact",
      value: supplier?.contact,
      isPrimary: true,
    },
    {
      label: "Address",
      value: supplier?.address,
      isPrimary: true,
    },
    {
      label: "Total Products",
      value: products.filter((p) => p.supplierId?._id === supplier?._id).length,
    },
    {
      label: "Added On",
      value: new Date(supplier?.createdAt).toLocaleDateString(),
    },
  ];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    setLoadingStates((prev) => ({ ...prev, deleting: true }));
    try {
      await axiosInstance.delete(`/supplier/${id}`);
      navigate("/suppliers");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.msg || "Failed to delete supplier",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, deleting: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-[500px] w-screen min-h-screen mx-auto relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header Section */}
      <div className="relative h-64">
        <div className={`absolute inset-0`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`
              w-24 h-24 rounded-2xl
              flex items-center justify-center
              text-3xl font-bold
              ${
                theme === "dark"
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-600"
              }
            `}
            >
              {initials(supplier?.name)}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`
            rounded-2xl p-6
            ${theme === "dark" ? "bg-gray-800" : "bg-white"}
            shadow-lg
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h1
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {supplier?.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit-supplier/${id}`)}
                className={`
                            p-2 rounded-lg transition-all
                            ${
                              theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }`}
              >
                <CiEdit size={15} />
              </button>
              <button
                className={`
                            p-2 rounded-lg transition-all
                            ${
                              theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }`}
              >
                <IoCameraOutline size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Primary Info Cards */}
            {supplierDetails
              .filter((detail) => detail.isPrimary)
              .map((detail, index) => (
                <div
                  key={index}
                  className={`
                p-4 rounded-xl
                ${theme === "dark" ? "bg-gray-700/50" : "bg-purple-50"}
              `}
                >
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {detail.label}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {detail.value || "Not Set"}
                  </p>
                </div>
              ))}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {supplierDetails
                .filter((detail) => !detail.isPrimary)
                .map((detail, index) => (
                  <div
                    key={index}
                    className={`
                  p-4 rounded-xl
                  ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}
                `}
                  >
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {detail.label}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {detail.value}
                    </p>
                  </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={handleDelete}
                disabled={loadingStates.deleting}
                className={`
                  py-3 px-4 rounded-xl
                  flex items-center justify-center gap-2
                  font-medium text-sm
                  transition-all duration-200
                  ${
                    theme === "dark"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }
                  ${loadingStates.deleting && "opacity-50 cursor-not-allowed"}
                `}
              >
                {loadingStates.deleting ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  <FiTrash2 />
                )}
                <span>
                  {loadingStates.deleting ? "Deleting..." : "Delete Supplier"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            fixed bottom-4 left-4 right-4
            p-4 rounded-lg shadow-lg
            ${
              message.type === "success"
                ? theme === "dark"
                  ? "bg-green-900/90 text-green-200"
                  : "bg-green-500 text-white"
                : theme === "dark"
                ? "bg-red-900/90 text-red-200"
                : "bg-red-500 text-white"
            }
          `}
        >
          {message.text}
        </motion.div>
      )}
    </motion.div>
  );
}

export default SupplierProfile;
