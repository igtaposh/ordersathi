import React, { useContext, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  MdBrightness6,
  MdOutlineDarkMode,
  MdKeyboardArrowDown,
  MdDeleteOutline,
} from "react-icons/md";
import { HiOutlineLogout, HiOutlineLightBulb } from "react-icons/hi";
import { motion } from "framer-motion";
import { FiLogOut, FiTrash2 } from "react-icons/fi";

function NavBar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [otp, setOtp] = useState("");
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  const handleAppearanceToggle = () => {
    setIsAppearanceOpen(!isAppearanceOpen);
  };
  const [loadingStates, setLoadingStates] = useState({
    updating: false,
    deleting: false,
    logout: false,
  });

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
  const getRandomColor = (seed) => {
    const colors = [
      "bg-blue-500/20 text-blue-600",
      "bg-purple-500/20 text-purple-600",
      "bg-green-500/20 text-green-600",
      "bg-amber-500/20 text-amber-600",
      "bg-pink-500/20 text-pink-600",
      "bg-indigo-500/20 text-indigo-600",
      "bg-rose-500/20 text-rose-600",
      "bg-cyan-500/20 text-cyan-600",
    ];
    const darkColors = [
      "bg-blue-500/20 text-blue-400",
      "bg-purple-500/20 text-purple-400",
      "bg-green-500/20 text-green-400",
      "bg-amber-500/20 text-amber-400",
      "bg-pink-500/20 text-pink-400",
      "bg-indigo-500/20 text-indigo-400",
      "bg-rose-500/20 text-rose-400",
      "bg-cyan-500/20 text-cyan-400",
    ];

    const index = seed.charCodeAt(0) % colors.length;
    return theme === "dark" ? darkColors[index] : colors[index];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } w-full min-h-screen max-w-[500px] flex flex-col p-4 gap-4 relative`}
    >
      <div
        className={`w-full mt-16 flex justify-between p-4 rounded-lg shadow-sm ${
          theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"
        } ${confirmDelete ? "blur-sm" : ""}`}
      >
        <div className="w-full flex items-center gap-4">
          <Link
            to={`/user-profile`}
            className={`
          h-12 w-12 rounded-xl flex items-center justify-center
          font-bold text-lg ${getRandomColor(user.name)}
        `}
          >
            {getInitials(user.name)}
          </Link>
          <Link
            to={`/user-profile`}
            className="flex flex-col gap-1 items-start justify-center"
          >
            <span
              className={`text-xs font-medium truncate ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {user?.name}
            </span>
            <span
              className={`text-[10px] ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              +91 {user?.phone}
            </span>
          </Link>
        </div>
        <div className="p-1 flex flex-col align-text-top">
          <button
            onClick={() => navigate("/edit-user")}
            className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            Manage
          </button>
        </div>
      </div>

      <div
        className={`w-full p-4 flex flex-col gap-3 shadow-sm rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"
        }`}
      >
        <h1
          className={`text-[10px] font-medium tracking-widest ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          PREFERENCES
        </h1>

        <div
          className={`rounded-lg ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <button
            onClick={handleAppearanceToggle}
            className={`flex justify-between items-center w-full p-3 text-left ${
              isAppearanceOpen ? (theme === "dark" ? "border-b border-gray-700/50" : "border-b border-gray-200") : null
            }`}
            aria-expanded={isAppearanceOpen}
          >
            <div className="flex items-center gap-3">
              <MdBrightness6
                className={`text-md ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`font-medium text-xs ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Theme
              </span>
            </div>
            <MdKeyboardArrowDown
              className={`text-lg transition-transform duration-200 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } ${isAppearanceOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isAppearanceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <button
                initial={{ y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleThemeToggle}
                className={`flex items-center gap-3 w-full p-3 transition-colors duration-200
                } ${
                  theme === "light" ? "bg-blue-50 dark:bg-blue-900/20 " : ""
                }`}
              >
                <HiOutlineLightBulb
                  className={`text-lg ${
                    theme === "light"
                      ? "text-blue-500"
                      : theme === "dark"
                      ? "text-yellow-400"
                      : "text-yellow-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    theme === "light"
                      ? "text-blue-700 dark:text-blue-300 font-medium"
                      : theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  Light
                </span>
                {theme === "light" && (
                  <span className="ml-auto text-[10px] text-blue-600 dark:text-blue-300">
                    Active
                  </span>
                )}
              </button>
              <button
                onClick={handleThemeToggle}
                className={`flex items-center gap-3 w-full p-3 transition-colors duration-200${
                  theme === "dark" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <MdOutlineDarkMode
                  className={`text-lg ${
                    theme === "dark" ? "text-blue-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-xs ${
                    theme === "dark"
                      ? "text-blue-300 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Dark
                </span>
                {theme === "dark" && (
                  <span className="ml-auto text-[10px] text-blue-300">
                    Active
                  </span>
                )}
              </button>
            </motion.div>
          )}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isAppearanceOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            }`}
          ></div>
        </div>
      </div>

      <div
        className={`w-full p-4 flex flex-col gap-3 shadow-sm rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"
        }`}
      >
        <h1
          className={`text-[10px] font-medium tracking-widest ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ACCOUNTS & SETTINGS
        </h1>

        <div className={"flex flex-col gap-3"}>
          <button
            onClick={handleLogout}
            disabled={loadingStates.logout}
            className={`
                            py-3 px-4 rounded-xl
                            flex items-center justify-center gap-2
                            font-medium text-xs
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
            <span>{loadingStates.logout ? "Logging out..." : "Logout"}</span>
          </button>

          <button
            className={`
                            py-3 px-4 rounded-xl
                            flex items-center justify-center gap-2
                            font-medium text-xs
                            transition-all duration-200
                            ${
                              theme === "dark"
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }
                          `}
          >
            <FiTrash2 />
            Delete Account
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5/6 max-w-[450px] flex gap-4 flex-col p-6 rounded-lg shadow-xl z-50 border-2 border-yellow-400 ${
            theme === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-lg font-medium text-center">
            Confirm Account Deletion
          </h2>
          <p
            className={`text-sm text-center ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            To proceed with deleting your account, please enter the OTP sent to
            your registered mobile number.
          </p>
          <p
            className={`text-sm text-center ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            This action is permanent and cannot be undone.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Enter OTP
            </label>
            <input
              maxLength={6}
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`h-10 p-3 rounded-lg outline-none border text-center ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              placeholder="Enter 6-digit OTP"
              type="text"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button className="flex-1 flex gap-2 justify-center items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200">
              <MdDeleteOutline className="text-lg" />
              Delete Account
            </button>
          </div>
        </div>
      )}

      <div
        className={`w-full p-4 flex flex-col gap-3 shadow-sm rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"
        } ${confirmDelete ? "blur-sm" : ""}`}
      >
        <h1
          className={`text-[10px] font-medium tracking-widest ${
            theme === "dark" ? "text-gray-400" : "text-gray-800"
          }`}
        >
          ABOUT US
        </h1>

        <div
          className={`text-xs tracking-wide ${
            theme === "dark" ? "text-gray-300" : "text-gray-800"
          }`}
        >
          <p className="mb-4">
            OrderSathi is your trusted partner for effortless order and stock
            management. We aim to empower shopkeepers and suppliers by
            simplifying daily operations, reducing paperwork, and improving
            accuracy with instant digital records.
          </p>

          <div
            className={`border-t pt-3 mt-3 ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h3
              className={`text-[10px] font-medium tracking-widest mb-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-800"
              }`}
            >
              DEVELOPER DETAILS
            </h3>
            <p>
              Developed by{" "}
              <Link
                className={` ${
                  theme === "dark" ? "text-gray-300" : "text-zinc-900"
                } font-medium`}
                to={"https://github.com/igtaposh"}
              >
                Taposh Debnath
              </Link>
            </p>
          </div>

          <div
            className={`border-t pt-3 mt-3 ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h3
              className={`text-[10px] font-medium tracking-widest mb-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-800"
              }`}
            >
              APP VERSION
            </h3>
            <p>Current Version: 1.5.0</p>
          </div>
        </div>
      </div>

      <div
        className={`${
          confirmDelete ? "blur-sm" : ""
        } text-xs text-center mt-4 mb-6 ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <p>© 2025 OrderSathi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default NavBar;
