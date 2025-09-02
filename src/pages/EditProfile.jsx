import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineSave } from "react-icons/md";
import { IoArrowUndoOutline } from "react-icons/io5";
import Popup from "../components/Popup";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";

/**
 * EditProfile Component
 * Handles user profile editing functionality with form validation and loading states
 * @returns {JSX.Element} EditProfile component
 */
function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Form state management
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    shopName: user?.shopName || "",
  });

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    updating: false,
  });

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
   * Fetch user profile data on component mount
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/user-profile");
        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        setUser(response.data.user);
        // Update form with fresh user data
        setForm({
          name: response.data.user?.name || "",
          email: response.data.user?.email || "",
          phone: response.data.user?.phone || "",
          shopName: response.data.user?.shopName || "",
        });
      } catch (error) {
        showMessage(
          "Failed to load user data. Please refresh the page.",
          "error"
        );
      }
    };

    fetchUser();
  }, [setUser]);

  /**
   * Validate form data before submission
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    // Name validation
    if (!form.name) {
      setMessage({
        type: "error",
        text: "Name is required",
      });
      return false;
    }
    // shop name validation
    if (!form.shopName) {
      setMessage({
        type: "error",
        text: "Shop name is required",
      });
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      return false;
    }

    return true;
  };

  /**
   * Handle profile update submission
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
      const res = await axiosInstance.put("/auth/update-profile", form);
      setUser(res.data.user);
      navigate("/user-profile");
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setMessage({
        text: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <div
      className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-neutral-200"
      }`}
    >
      {/* Success/Error Popup */}
      {message.text && (
        <Popup onClose={() => updateState({ message: { type: "", text: "" } })}>
          <div
            className={`
                  w-full rounded-lg px-4 pt-8 pb-4
                  flex flex-col items-center gap-6 shadow-xl border
                  ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }
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
      
      ${theme === "dark"
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
        className={`shadow-md rounded-lg mt-16 mb-4 w-full flex flex-col p-6 gap-4 transition-colors duration-200 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                className={`text-xs font-semibold opacity-70 mb-2 ml-2 block
                     ${theme === "dark" ? "text-gray-300" : "text-gray-900"}
                  `}
              >
                Enter Name
              </label>
              <input
                type="text"
                value={form.name}
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
                Shop Name
              </label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
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
                Email
              </label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                Phone
              </label>
              <input
                disabled
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`
                        w-full p-3 rounded-lg text-xs
                        outline-none transition-colors duration-200
                        hover:cursor-not-allowed
                        ${
                          theme === "dark"
                            ? "bg-gray-700/10 text-gray-500 placeholder-gray-500"
                            : "bg-gray-300 text-gray-700"
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
                Role
              </label>
              <input
                type="text"
                value={user?.role}
                disabled
                className={`
                        w-full p-3 rounded-lg text-xs
                        outline-none transition-colors duration-200
                        hover:cursor-not-allowed
                        ${
                          theme === "dark"
                            ? "bg-gray-700/10 text-gray-500 placeholder-gray-500"
                            : "bg-gray-300 text-gray-700"
                        }
                     `}
              />
            </div>
          </div>
          <div className={`w-full rounded-lg flex items-center gap-2`}>
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
              disabled={
                loadingStates.updating ||
                !form.name ||
                !form.email ||
                !form.shopName
              }
              className={`
           w-full p-3 rounded-lg
           flex items-center justify-center gap-2
           text-xs font-medium
           transition-all duration-200 active:scale-[0.97]
           disabled:opacity-60 
           disabled:cursor-not-allowed 
           disabled:hover:scale-100
           ${
             loadingStates.updating
               ? theme === "dark"
                 ? "bg-gray-700 text-gray-500"
                 : "bg-gray-100 text-gray-400"
               : theme === "dark"
               ? "bg-green-500/20 text-green-400 "
               : "bg-green-500 text-white"
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
        </form>
      </div>

      {/* Action Buttons */}
    </div>
  );
}

export default EditProfile;
