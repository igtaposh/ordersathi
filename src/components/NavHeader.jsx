import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

function NavHeader() {
  // Use React Router hooks for better navigation handling
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = window.location.pathname;
  const { id } = useParams();

  const goBack = () => {
    location === '/products' || location === '/suppliers' ? navigate('/') : navigate(-1)
    
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setScrollPosition(scrollTop);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [setScrollPosition]);

  return (
    <div
      className={`fixed z-[100] w-full max-w-[500px] flex top-0 justify-start items-center p-2 ${
        location === "/user-profile"
          ? null
          : scrollPosition >= 35
          ? `duration-100 ease-in shadow-md ${
              theme === "dark"
                ? "border-b-2 bg-gray-900 border-b-gray-800"
                : "border-b-2 bg-white border-b-gray-300 "
            }`
          : "transition-none duration-0 shadow--none"
      }`}
    >
      <div className="w-full flex justify-start items-center gap-4 p-1 sm:gap-3 md:gap-4">
        <button
          onClick={() => goBack()}
          className={`p-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-800/50 text-gray-200"
              : "bg-gray-100 border border-gray-200 text-gray-700"
          } backdrop-blur-sm`}
        >
          <IoArrowBack size={18} />
        </button>
        <p
          className={`text-xs opacity-70 tracking-wider font-medium ${
            theme === "dark" ? "text-gray-200" : "text-black"
          }`}
        >
          {(location === "/user-profile" && "User Profile") ||
            (location === "/create-product" && "Create Product") ||
            (location === "/create-supplier" && "Create Supplier") ||
            (location === "/create-order" && "Create Order Report") ||
            (location === "/create-stock-report" && "Create Stock Report") ||
            (location === "/suppliers" && "Suppliers") ||
            (location === "/products" && "Products") ||
            (location === "/statistics" && "Statistics") ||
            (location === "/history" && "History") ||
            (location === `/product-profile/${id}` && "Product Profile") ||
            (location === `/supplier-profile/${id}` && "Supplier Profile") ||
            (location === `/edit-product/${id}` && "Update Product") ||
            (location === `/edit-product/${id}` && "Update Product") ||
            (location === "/edit-user" && "Update User")}
        </p>
      </div>
    </div>
  );
}

export default NavHeader;
