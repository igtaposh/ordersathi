import React, { useState, useContext, useEffect } from "react";
import { SupplierContext } from "../context/SupplierContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import SupplierCard from "../components/SupplierCard";
import { motion } from "framer-motion";

const Suppliers = () => {
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const { theme } = useTheme();

  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get("/supplier");
        if (res.status === 200) {
          setSuppliers(res.data);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Error fetching suppliers. Please refresh the page.",
        });
      }
    };
    fetchSuppliers();
  }, [setSuppliers]);

  const handleFiltersUpdate = (filters) => {
    setActiveFilters(filters.activeFilters || []);
    setSearchQuery(filters.searchQuery || "");
  };

  useEffect(() => {
    let list = [...suppliers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.contact?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
      );
    }

    const sortByDate = (a, b, asc = false) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return asc ? da - db : db - da;
    };

    if (activeFilters.includes("oldest")) {
      list.sort((a, b) => sortByDate(a, b, true));
    } else {
      list.sort((a, b) => sortByDate(a, b, false));
    }

    setFilteredSuppliers(list);
  }, [suppliers, activeFilters, searchQuery]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className={`max-w-[500px] w-screen min-h-screen mx-auto pb-16 p-4 transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {message.text && (
        <div
          className={`w-full mt-8 p-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${
            message.type === "success"
              ? theme === "dark"
                ? "bg-green-900/20 text-green-300 border-green-700"
                : "bg-green-50 text-green-700 border-green-200"
              : theme === "dark"
              ? "bg-red-900/20 text-red-300 border-red-700"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <motion.div
        className="mt-14 mb-16 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="w-full mb-6">
          <Search
            onFiltersUpdate={handleFiltersUpdate}
            enableDate={false}
            enableSupplier={false}
          />
        </div>

        <div
          className={`flex w-full justify-between text-xs mb-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <p>Suppliers: {filteredSuppliers.length}</p>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div
            className={`p-6 text-xs rounded-lg text-center ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {searchQuery || activeFilters.length > 0
              ? "No suppliers found. Try changing filters or search."
              : "No suppliers found. Add your first supplier."}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-3"
          >
            {filteredSuppliers.map((supplier) => (
              <SupplierCard key={supplier._id} supplier={supplier} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Suppliers;
