import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit, FiLogOut, FiTrash2 } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance, { setAuthToken } from "../api/axiosInstance";
import { IoArrowBack, IoCameraOutline } from "react-icons/io5";

function UserProfile() {
  // Context hooks
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form state
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    shopName: user?.shopName || "",
  });

  // Loading states for different actions
  const [loadingStates, setLoadingStates] = useState({
    updating: false,
    deleting: false,
    logout: false,
  });

  // Message state for success/error feedback
  const [message, setMessage] = useState({ type: "", text: "" });
  
  /**
   * Handles profile update
   * @param {Event} e - Form submit event
   */
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.userName.trim()) {
      setMessage({ type: "error", text: "User name is required" });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, updating: true }));
    setMessage({ type: "", text: "" }); // Clear any existing messages

    try {
      const res = await axiosInstance.put("/auth/update-profile", form);
      setUser(res.data.user);
      setEditMode(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        "Failed to update profile. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoadingStates((prev) => ({ ...prev, updating: false }));
    }
  };

  /**
   * Handles account deletion with confirmation
   */
  const handleDelete = async () => {
    // Confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoadingStates((prev) => ({ ...prev, deleting: true }));
    setMessage({ type: "", text: "" }); // Clear any existing messages

    try {
      await axiosInstance.delete("/auth/delete-account");

      // Clear user data
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setMessage({
        type: "success",
        text: "Account deleted successfully. Redirecting...",
      });

      // Small delay before navigation to show success message
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        "Failed to delete account. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoadingStates((prev) => ({ ...prev, deleting: false }));
    }
  };
  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    setLoadingStates((prev) => ({ ...prev, logout: true }));
    setMessage({ type: "", text: "" }); // Clear any existing messages

    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        // Clear user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
        setUser(null);
        setToken(null);

        setMessage({
          type: "success",
          text: "Logged out successfully. Redirecting...",
        });

        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Logout failed. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoadingStates((prev) => ({ ...prev, logout: false }));
    }
  };

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

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={handleLogout}
                disabled={loadingStates.logout}
                className={`
                  py-3 px-4 rounded-xl
                  flex items-center justify-center gap-2
                  font-medium text-sm
                  transition-all duration-200
                  ${
                    theme === "dark"
                      ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }
                `}
              >
                {loadingStates.logout ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  <FiLogOut />
                )}
                <span>
                  {loadingStates.logout ? "Logging out..." : "Logout"}
                </span>
              </button>

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
                  {loadingStates.deleting ? "Deleting..." : "Delete Account"}
                </span>
              </button>
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
