import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import { CiEdit } from "react-icons/ci";
import { IoCameraOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";

function ProductProfile() {
  const [profile, setProfile] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/product/single/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const initials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
  };

  const profileDetails = [
    {
      label: "Rate",
      value: `₹ ${profile.rate}`,
    },
    {
      label: "Weight",
      value: `${profile.weight <= 1 ? profile.weight + " g" : profile.weight + " kg"}`,
    },
    {
      label: "Type",
      value: profile.type,
    },
    {
      label: "Category",
      value: profile.supplierId?.name,
    },
  ];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/product/single/${id}`);
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20 }}
      animate={{opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-[500px] w-screen min-h-screen mx-auto relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header Section */}
      <div className="relative h-64">
        <div>
          <div className="absolute top-4 left-4"></div>

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
              {initials(profile.name)}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-6">
        <motion.div
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
              {profile.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit-product/${id}`)}
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
            {/* Price Card */}
            <div
              className={`
              p-3 rounded-xl
              ${theme === "dark" ? "bg-gray-700/50" : "bg-purple-50"}
            `}
            >
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                MRP
              </p>
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                ₹{profile.mrp || "0"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {profileDetails.map((item, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-xl
                    ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}
                  `}
                >
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {item.value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add this at the bottom of the motion.div, after the existing content */}
          <div className="mt-8 flex flex-col w-full gap-2 ">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
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
          ${isDeleting && "opacity-50 cursor-not-allowed"}
        `}
            >
              <MdDelete className="text-lg" />
              <span>{isDeleting ? "Deleting..." : "Delete Product"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ProductProfile;
