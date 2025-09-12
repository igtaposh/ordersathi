import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance, { setAuthToken } from "../api/axiosInstance";
import { IoCameraOutline } from "react-icons/io5";

function UserProfile() {
  // Context hooks
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Loading states for different actions
  const [loadingStates, setLoadingStates] = useState({
    deleting: false,
    logout: false,
  });

  // Message state for success/error feedback
  const [message, setMessage] = useState({ type: "", text: "" });

  return (
    <motion.div
      initial={{ right: "-100%" }}
      animate={{ right: 0 }}
      exit={{ right: "-100%" }}
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
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 -mt-6 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            rounded-2xl p-6
            ${theme === "dark" ? "bg-gray-800" : "bg-white"}
            shadow-lg
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h1
              className={`text-md font-medium ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {user?.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/edit-user")}
                className={`
                p-2 rounded-lg transition-all
                ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }
              `}
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
            {/* Shop Details Card */}
            <div
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
                Shop Name
              </p>
              <p
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {user?.shopName || "Not Set"}
              </p>
            </div>

            {/* User Details Grid */}
            <div className="flex flex-wrap overflow-hidden gap-4">
              {[
                { label: "Email", value: user?.email },
                { label: "Phone", value: user?.phone },
                { label: "Role", value: user?.role },
                {
                  label: "Joined",
                  value: new Date(user?.createdAt).toLocaleDateString(),
                },
              ].map((item, index) => (
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
        </motion.div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
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

export default UserProfile;
