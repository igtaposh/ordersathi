import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useParams } from "react-router-dom";
import NavHeader from "./NavHeader";
import { useTheme } from "../context/ThemeContext";
import { TbChartHistogram } from "react-icons/tb";
import { MdOutlineQueryStats } from "react-icons/md";
import { MdDownloading } from "react-icons/md";

const Layout = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = window.location.pathname;
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const { id, type } = useParams();

  // Scroll detection effect
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      setIsScrollingUp(isScrollingUp);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      initial={{ right: "-100%", opacity: 0 }}
      animate={{ right: 0, opacity: 1 }}
      exit={{ right: "-100%", opacity: 0 }}
      className={`max-w-[500px] relative mx-auto top-0 libre-franklin-regular w-full flex flex-col justify-between items-center shadow-sm overflow-hidden ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } `}
    >
      {location === "/profile" ||
      location === `/history/${type}/${id}` ||
      location === "/products" ||
      location === "/suppliers" ||
      location === "/create-product" ||
      location === "/create-supplier" ||
      location === "/create-order" ||
      location === "/create-stock-report" ||
      location === `/product-profile/${id}` ||
      location === `/supplier-profile/${id}` ||
      location === `/user-profile` ||
      location === `/edit-user` ||
      location === `/edit-product/${id}` ||
      location === `/edit-supplier/${id}` ? null : (
        <div
          className={`${
            isScrollingUp ? "bottom-0" : "-bottom-20"
          } fixed  max-w-[500px] w-full flex justify-between items-center px-4 py-2 z-50 transition-all duration-500   ${
            theme === "dark"
              ? "bg-gray-800 border-t border-gray-700"
              : "bg-white border-t-2 border-gray-900/20"
          }`}
        >
          <Link to="/">
            <div
              className={`${
                location === "/dashboard"
                  ? `flex flex-col items-center text-[0.7rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-blue-400 bg-gray-700"
                        : "text-blue-600 bg-gray-200"
                    }`
                  : `flex flex-col items-center text-[0.7rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`
              }`}
            >
              <div
                className={`text-xl transition-colors duration-200 ${
                  location === "/dashboard"
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                <TbChartHistogram />
              </div>
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/statistics">
            <div
              className={`${
                location === "/statistics"
                  ? `flex flex-col items-center font-semibold text-[0.7rem] px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-blue-400 bg-gray-700"
                        : "text-blue-600 bg-gray-200"
                    }`
                  : `flex flex-col items-center justify-center text-[0.7rem] font-semibold px-4 py-2 rounded-xl opacity-95 gap-[2px] transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`
              }`}
            >
              <div
                className={`text-xl transition-colors duration-200 ${
                  location === "/statistics"
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                <MdOutlineQueryStats />
              </div>
              <span>Statistics</span>
            </div>
          </Link>
          <Link to="/history">
            <div
              className={`${
                location === "/history"
                  ? `flex flex-col items-center text-[0.7rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-blue-400 bg-gray-700"
                        : "text-blue-600 bg-gray-200"
                    }`
                  : `flex flex-col items-center text-[0.7rem] font-semibold px-4 py-2 rounded-xl opacity-90 gap-[2px] transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`
              }`}
            >
              <div
                className={`text-xl transition-colors duration-200 ${
                  location === "/history"
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                <MdDownloading />
              </div>
              <span>History</span>
            </div>
          </Link>
        </div>
      )}

      {/* Page Content */}
      {location === "/dashboard" ||
      location === "/history" ||
      location === "/statistics" ? null : (
        <NavHeader />
      )}

      <Outlet />
    </div>
  );
};

export default Layout;
