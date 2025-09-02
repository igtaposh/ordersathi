import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { SupplierContext } from "../context/SupplierContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard"; // Import the new ProductCard component

const Products = () => {
  // Context hooks
  const { products, setProducts } = useContext(ProductContext);
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const { theme } = useTheme();

  // REMOVE old search states
  // const [searchTerm, setSearchTerm] = useState('');
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // NEW: Search/Filter states
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // removed date state
  // const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(""); // new
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle filters update from Search component
  const handleFiltersUpdate = (filters) => {
    setActiveFilters(filters.activeFilters || []);
    setSearchQuery(filters.searchQuery || "");
    // removed date
    // setSelectedDate(filters.selectedDate || null);
    setSelectedSupplier(filters.selectedSupplier || "");
  };

  // Build filteredProducts (search + supplier + sort)
  useEffect(() => {
    let list = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q) ||
          p.supplierId?.name?.toLowerCase().includes(q) ||
          String(p.rate ?? "").includes(searchQuery) ||
          String(p.mrp ?? "").includes(searchQuery)
      );
    }

    // Supplier filter
    if (selectedSupplier) {
      list = list.filter((p) => p.supplierId?._id === selectedSupplier);
    }

    // Sort (default newest; if 'oldest' present → oldest first)
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

    setFilteredProducts(list);
  }, [products, activeFilters, searchQuery, selectedSupplier]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product");
        if (res.status !== 200) throw new Error("Failed to fetch products");
        setProducts(res.data);
      } catch {
        setMessage({
          type: "error",
          text: "Error fetching products. Please try again.",
        });
      }
    };
    fetchProducts();
  }, [setProducts]);
  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get("/supplier");
        if (res.status !== 200) throw new Error("Failed to fetch suppliers");
        setSuppliers(res.data);
      } catch {
        setMessage({
          type: "error",
          text: "Error fetching suppliers. Please refresh the page.",
        });
      }
    };
    fetchSuppliers();
  }, [setSuppliers]);
const isBack = true
  return (
    <motion.div
      
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 1, x: 1000 }}
      className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Message Display */}
      {message.text && (
        <div
          className={`w-full mt-8 p-3 rounded-lg text-xs border transition-colors duration-200 ${
            message.type === "success"
              ? theme === "dark"
                ? "bg-green-900 text-green-200 border-green-700"
                : "bg-green-100 text-green-800 border-green-200"
              : theme === "dark"
              ? "bg-red-900 text-red-200 border-red-700"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
      {/* Products List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`h-full mb-16 rounded-xl mt-16 w-full flex flex-col gap-2  transition-colors duration-200 z-10`}
      >
        <div className="w-full mb-6">
          <Search
            onFiltersUpdate={handleFiltersUpdate}
            enableDate={false}
            enableSupplier
            suppliers={suppliers}
          />
        </div>

        <div
          className={`flex w-full justify-between rounded-lg text-xs mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          <p>Products: {filteredProducts.length}</p>
        </div>
        {filteredProducts.length === 0 ? (
          <div
            className={`p-6 text-xs rounded-lg text-center ${
              theme === "dark"
                ? "bg-gray-750 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {searchQuery || activeFilters.length > 0 || selectedSupplier
              ? "No products found. Try changing filters or search."
              : "No products found. Add your first product above."}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-2"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Products;
