import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const SupplierCard = ({ supplier }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Get initials from supplier name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random color based on name
  const getRandomColor = () => {
    const colors = [
      ["bg-blue-500/20 text-blue-600", "bg-blue-500/20 text-blue-400"],
      ["bg-purple-500/20 text-purple-600", "bg-purple-500/20 text-purple-400"],
      ["bg-green-500/20 text-green-600", "bg-green-500/20 text-green-400"],
      ["bg-amber-500/20 text-amber-600", "bg-amber-500/20 text-amber-400"],
      ["bg-pink-500/20 text-pink-600", "bg-pink-500/20 text-pink-400"],
      ["bg-indigo-500/20 text-indigo-600", "bg-indigo-500/20 text-indigo-400"],
      ["bg-rose-500/20 text-rose-600", "bg-rose-500/20 text-rose-400"],
      ["bg-cyan-500/20 text-cyan-600", "bg-cyan-500/20 text-cyan-400"],
    ];

    const index = supplier.name.charCodeAt(0) % colors.length;
    return theme === "dark" ? colors[index][1] : colors[index][0];
  };

  return (
    <div
      onClick={() => navigate(`/supplier-profile/${supplier._id}`)}
      className={`
        flex w-full rounded-lg text-sm gap-3 p-3 border 
        cursor-pointer transition-all duration-200 
        hover:scale-[1.01] hover:shadow-lg
        ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-750"
            : "bg-white border-gray-900/20 text-gray-800"
        }
      `}
    >
      <div className="flex-shrink-0">
        <div
          className={`
          h-12 w-12 rounded-xl
          flex items-center justify-center
          font-bold text-lg
          ${getRandomColor()}
        `}
        >
          {getInitials(supplier.name)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`
          font-medium truncate 
          ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
        `}
        >
          {supplier.name}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`
            px-2 py-1 rounded text-xs
            ${
              theme === "dark"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }
          `}
          >
            {supplier.address || "No Address"}
          </span>

          {supplier.contact && (
            <span
              className={`
              px-2 py-1 rounded text-xs
              ${
                theme === "dark"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-600"
              }
            `}
            >
              {supplier.contact}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
