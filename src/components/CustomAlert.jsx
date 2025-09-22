import React from "react";
import { useTheme } from "../context/ThemeContext";
import { CgClose } from "react-icons/cg";
import { MdGppGood, MdOutlineGppBad } from "react-icons/md";

function CustomAlert({ msg, msgType, onClose, isOpen, btnLink }) {
  const { theme } = useTheme();
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-[1000] w-[93%] max-w-[469px] rounded-md px-2 py-3 transition-all duration-200 flex gap-1 justify-between items-center shadow-md ${
        isOpen ? "top-5" : "-top-20"
      }
            ${
              theme === "dark"
                ? "bg-gray-800"
                : "bg-white border text-gray-700 border-gray-900/20"
            } ${
        msgType === "success"
          ? "border-l-green-500 border-l-4"
          : "border-l-red-500 border-l-4"
      }
            
         `}
    >
      <div className="flex items-center gap-2 w-[80%]">
        <span>
          {msgType === "success" ? (
            <MdGppGood className="text-green-500" size={30} />
          ) : (
            <MdOutlineGppBad className="text-red-500" size={30} />
          )}
        </span>
        <span className="flex flex-col text-xs ">
          <p
            className={`${
              msgType === "success"
                ? theme === "dark"
                  ? "text-green-500"
                  : "text-green-700"
                : theme === "dark"
                ? "text-red-500"
                : "text-red-700"
            } uppercase`}
          >
            {msgType} !
          </p>
          <p
            className={`${
              msgType === "success"
                ? theme === "dark"
                  ? "text-green-500"
                  : "text-green-700"
                : theme === "dark"
                ? "text-red-500"
                : "text-red-700"
            } text-[10px]`}
          >
            {msg}
          </p>
        </span>
      </div>
      <div className="flex items-center gap-2 w-3/4 justify-end">
        {msgType === "success" && (
          <button
            onClick={() => (window.location.href = btnLink)}
            className={`border px-3 py-2 rounded-md cursor-pointer text-[10px] flex items-center gap-1 ${
              theme === "dark"
                ? "text-green-500 border-green-500"
                : "text-green-700 border-green-700"
            }`}
          >
            View Product
          </button>
        )}
        <span
          onClick={onClose}
          className={`${
            theme === "dark" ? "text-gray-500" : "text-gray-600"
          } cursor-pointer p-1`}
        >
          <CgClose size={20} />
        </span>
      </div>
    </div>
  );
}

export default CustomAlert;
