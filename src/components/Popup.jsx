import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

function Popup({ children, onClose }) {
  const { theme } = useTheme();

  // Disable scrolling when popup is mounted
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Add styles to prevent scrolling and maintain position
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    // Cleanup function to re-enable scrolling when popup is unmounted
    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <>
      {/* Backdrop with pointer events disabled */}
      <div
        className="fixed inset-0 bg-zinc-900/40 z-[999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popup content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[95%] max-w-md z-[1000] 
          p-6 rounded-xl
          flex flex-col items-center gap-6
        `}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </motion.div>
    </>
  );
}

export default Popup;
