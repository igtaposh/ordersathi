import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ProductCard = ({ product }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Random pastel color generator
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

    const index = product.name.charCodeAt(0) % colors.length;
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

  return (
    <div
      onClick={() => navigate(`/product-profile/${product._id}`)}
      className={`
        flex w-full justify-between rounded-md text-sm gap-2 p-2 border
        cursor-pointer transition-all duration-200 hover:shadow-md
        ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-750"
            : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
        }
      `}
    >
      <div className="w-1/5 flex items-center justify-center">
        <div
          className={`
          h-12 w-12 rounded-xl flex items-center justify-center
          font-bold text-lg ${getRandomColor(product.name)}
        `}
        >
          {getInitials(product.name)}
        </div>
      </div>

      <div className="w-4/5 gap-2 flex flex-col">
        <div className="flex">
          <p
            className={`
            w-3/4 capitalize font-medium
            ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
          `}
          >
            {product.name}
          </p>

          <p
            className="
            w-1/4 px-2 h-5 text-[10px] text-white
            rounded-lg text-center bg-green-800
          "
          >
            ₹{product.rate || "---"}
          </p>
        </div>

        <div className="flex text-center items-center gap-2 text-[8px]">
          <p className="px-2 bg-gray-500 text-white rounded-lg">
            ₹{product.mrp || "---"}
          </p>
          <p className="px-2 bg-gray-500 text-white rounded-lg">
            {product.weight < 1
              ? `${product.weight * 1000}g`
              : `${product.weight}kg`}
          </p>
          <p className="px-2 bg-gray-500 text-white rounded-lg">
            {product.supplierId?.name || "---"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
