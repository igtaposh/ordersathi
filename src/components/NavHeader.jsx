import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import { IoArrowBack } from "react-icons/io5";

function NavHeader() {
  // Use React Router hooks for better navigation handling
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = window.location.pathname;
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const { id } = useParams();

  const goBack = () => {
    location === "/products" || location === "/suppliers"
      ? navigate("/")
      : navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrollingUp(true);
      } else {
        setIsScrollingUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed z-[100] w-full max-w-[500px] justify-start items-center p-2 duration-300 transition-all top-0 ${
        isScrollingUp
          ? `top-0 flex shadow-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white "
            }`
          : ""
      } `}
    >
      <div className="w-full flex justify-between items-center gap-4 px-2 py-1 ">
        <button
          onClick={() => goBack()}
          className={`p-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-800/50 text-gray-200"
              : "bg-gray-100 border border-gray-200 text-gray-700"
          } backdrop-blur-sm`}
        >
          <IoArrowBack size={20} />
        </button>
        <p
          className={`text-sm opacity-70 tracking-wider font-medium ${
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
            (location === `/product-profile/${id}` && "Product Profile") ||
            (location === `/supplier-profile/${id}` && "Supplier Profile") ||
            (location === `/edit-product/${id}` && "Update Product") ||
            (location === `/edit-product/${id}` && "Update Product") ||
            (location === "/edit-user" && "Update User")}
        </p>
        <div className="w-16"></div>
      </div>
    </div>
  );
}

export default NavHeader;
