import React, { useContext, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  MdBrightness6,
  MdOutlineDarkMode,
  MdKeyboardArrowDown,
  MdDeleteOutline,
  MdOutlineClose,
} from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { motion } from "framer-motion";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Popup from "../components/Popup.jsx";
import { BiError } from "react-icons/bi";
import axiosInstance from "../api/axiosInstance.js";
import { setAuthToken } from "../api/axiosInstance";

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useContext(AuthContext);

  const { theme, toggleTheme } = useTheme();
  const [otp, setOtp] = useState();
  const [phone, setPhone] = useState();
  const [stepTwo, setStepTwo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const handleAppearanceToggle = () => {
    setIsAppearanceOpen(!isAppearanceOpen);
  };

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loadingStates, setLoadingStates] = useState({
    updating: false,
    deleting: false,
    loading: false,
    confirmDelete: false,
  });

  const handleLogout = async () => {
    setMessage({ type: "", text: "" }); // Clear any existing messages
    setLogout(true);
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        // Clear user data
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Logout failed. Please try again.";
      setMessage({ type: "error", text: errorMessage });
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
  const handleSendOtp = async () => {
    // Clear any existing messages
    setMessage({ type: "", text: "" });

    // Validate phone number format
    if (
      !phone ||
      phone.length !== 10 ||
      !/^[6-9]\d{9}$/.test(phone) ||
      phone !== user.phone
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
      });
      return;
    }
    console.log(message);

    setLoading(true);

    try {
      // Send OTP request to backend
      const response = await axiosInstance.post("/auth/send-otp", {
        phone,
      });
      setStepTwo(true);
      setLoading(false);
      console.log(response);
      setMessage({
        type: "success",
        text: `OTP successfully sent! Please check your phone ****${user?.phone.slice(
          -4
        )} and enter the code below.`,
      });
    } catch (err) {
      // Handle API errors gracefully
      setLoading(false);
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again.";

      setMessage({ type: "error", text: errorMessage });
    }
  };
  const handleVerifyOtp = async () => {
    setMessage({
      type: "",
      text: "",
    });
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        phone,
        otp,
      });
      HandleDeleteAccount();
    } catch (err) {
      console.log(err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      });
      setLoading(false);
    }
  };

  const HandleDeleteAccount = async () => {
    setMessage({
      type: "",
      text: "",
    });
    setLoadingStates({
      loading: true,
    });
    try {
      const res = await axiosInstance.delete("/auth/delete-account");
      // Clear user data
      setMessage({
        type: "success",
        text: res.data.msg || "Account Deleted Successfully !",
      });
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to delete Account. Please try again.",
      });
    } finally {
      setLoadingStates({
        loading: false,
      });
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } w-full min-h-screen max-w-[500px] flex flex-col p-4 gap-4 relative`}
    >
      <div
        className={`w-full mt-16 flex justify-between p-4 rounded-lg shadow- ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        } `}
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
              className={`text-sm font-medium truncate ${
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
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20 "
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
              isAppearanceOpen
                ? theme === "dark"
                  ? "border-b border-gray-700/50"
                  : "border-b border-gray-200"
                : null
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
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
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
            disabled={logout}
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
            {logout ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FiLogOut />
            )}
            <span>{logout ? "Logging out..." : "Logout"}</span>
          </button>

          <button
            onClick={() => {
              setLoadingStates({
                confirmDelete: true,
              });
            }}
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
            <MdDeleteOutline size={15} />
            Delete Account
          </button>
        </div>
      </div>

      {loadingStates.confirmDelete && (
        <Popup>
          <div
            className={`relative px-6 py-8 rounded-xl flex flex-col gap-4 items-center border-2 overflow-hidden ${
              theme === "dark"
                ? "bg-gray-900 text-gray-100 border-gray-800"
                : "bg-gray-50 text-gray-800"
            }`}
          >
            <button
              onClick={() => {
                setLoadingStates({
                  confirmDelete: false,
                });
              }}
              className="absolute top-2.5 right-2.5 text-gray-700"
            >
              <MdOutlineClose size={24} />
            </button>

            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600/50">
              <BiError size={25} />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-md font-semibold text-center">
                Confirm Account Deletion
              </h2>
              <p
                className={`text-xs text-center ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                To continue, please verify your identity by confirming your
                registered mobile number. An OTP will be sent for verification.
              </p>
            </div>

            <div
              className={`w-full flex-col gap-4 ${
                stepTwo ? "flex" : "hidden"
              } `}
            >
              <div
                className={`rounded-lg p-2 outline-none border text-[10px] tracking-wider placeholder:text-xs ${
                  message.type === "success"
                    ? "bg-green-500/20 border-green-600/60 text-green-900"
                    : "bg-red-500/20 border-red-500/40 text-red-400"
                }`}
              >
                <p className={`text-center`}>{message.text}</p>
              </div>
              <input
                maxLength={6}
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`h-12 rounded-lg px-4 outline-none border text-sm tracking-wider text-center placeholder:text-xs ${
                  theme === "dark"
                    ? "bg-gray-800/60 border-gray-600/60 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter 6-digit OTP"
                type="tel"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={otp?.length !== 6}
                className={`w-full py-2.5 rounded-lg font-medium text-xs transition flex gap-2 justify-center items-center ${
                  otp?.length === 6
                    ? "bg-red-100 text-red-600/50 "
                    : "cursor-not-allowed opacity-60 bg-red-100 text-red-600/50"
                }`}
              >
                {loadingStates.loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  <MdDeleteOutline size={16} />
                )}
                <span>
                  {loadingStates.loading ? "Deleting..." : "Delete Account"}
                </span>
              </button>
            </div>

            <div
              className={`w-full flex-col gap-4 ${stepTwo ? "hidden" : "flex"}`}
            >
              {message.type === "error" ? (
                <div
                  className={`rounded-lg py-2 px-3 outline-none border text-[10px] tracking-wider placeholder:text-xs ${
                    theme === "dark"
                      ? "bg-red-500/30 border-red-500/60 text-red-300"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <p className={`text-center`}>{message.text}</p>
                </div>
              ) : (
                <div
                  className={`rounded-lg p-2 outline-none border text-xs tracking-wider placeholder:text-xs ${
                    theme === "dark"
                      ? "bg-gray-800/60 border-gray-600/60 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <p className={`text-center text-[10px]`}>
                    Confirm your phone number to receive OTP
                    <br />
                    Your number ends with ****{user?.phone.slice(-4)}
                  </p>
                </div>
              )}
              <input
                maxLength={10}
                id="mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`h-12 rounded-lg px-4 outline-none border text-xs tracking-wider text-center placeholder:text-xs ${
                  theme === "dark"
                    ? "bg-gray-800/60 border-gray-600/60 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter 10-digit mobile number"
                type="tel"
              />
              <button
                onClick={handleSendOtp}
                disabled={phone?.length !== 10}
                className={`w-full py-3 rounded-lg font-medium text-xs flex justify-center items-center gap-2 transition ${
                  phone?.length === 10
                    ? "bg-green-600/50 text-white"
                    : "cursor-not-allowed bg-green-600/30 text-green-600 "
                }`}
              >
                {loading ? (
                  <span className="flex gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Sending OTP....
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        </Popup>
      )}

      <div
        className={`w-full p-4 flex flex-col gap-3 shadow-sm rounded-lg ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        } `}
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
        className={`text-xs text-center mt-4 mb-6 ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <p>© 2025 OrderSathi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default NavBar;
