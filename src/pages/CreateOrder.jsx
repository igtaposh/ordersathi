import React, { useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { SupplierContext } from "../context/SupplierContext";
import { ProductContext } from "../context/ProductContext";
import { RiAiGenerate } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiError, BiStore } from "react-icons/bi";
import { MdArrowForward } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import Search from "../components/Search";
import Popup from "../components/Popup";
import { Link, useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { OrderContext } from "../context/OrderContext";

const CreateOrder = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  // Context hooks
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const { products, setProducts } = useContext(ProductContext);
  const { order, setOrder } = useContext(OrderContext);
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

  // State management
  const [orderState, setOrderState] = useState({
    orderId: null,
    isPopupOpen: true,
    showSupplierList: false,
    quantities: {},
    isCreatingOrder: false,
    isDownloadingPDF: { shopkeeper: false, supplier: false },
    message: { type: "", text: "" },
    showSupplierPopup: true,
    selectedSupplier: "",
    searchQuery: "",
    activeFilters: [],
    isScrollingUp: false,
  });

  // Destructure state for easier access
  const {
    orderId,
    quantities,
    isCreatingOrder,
    isDownloadingPDF,
    message,
    showSupplierPopup,
    selectedSupplier,
    searchQuery,
    activeFilters,
    isPopupOpen,
    showSupplierList,
    isScrollingUp,
  } = orderState;

  // Memoized state updates
  const updateOrderState = useCallback((updates) => {
    setOrderState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get("/supplier");
        if (res.status === 200) {
          setSuppliers(res.data);
        }
      } catch (error) {
        updateOrderState({
          message: {
            type: "error",
            text: "Error fetching suppliers. Please refresh the page.",
          },
        });
      }
    };
    fetchSuppliers();
  }, [setSuppliers, updateOrderState]);

  // Handle supplier selection
  const handleSupplierSelect = useCallback(
    (value) => {
      updateOrderState({
        selectedSupplier: value,
        searchQuery: "",
        activeFilters: [],
        quantities: {},
      });
    },
    [updateOrderState]
  );

  // Filter products based on search
  const filteredProducts = products.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      p.name.toLowerCase().includes(searchLower) ||
      p.type.toLowerCase().includes(searchLower)
    );
  });

  // Handle search filters update
  const handleFiltersUpdate = useCallback(
    (filters) => {
      updateOrderState({
        activeFilters: filters.activeFilters || [],
        searchQuery: filters.searchQuery || "",
      });
    },
    [updateOrderState]
  );

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (productId, value) => {
      updateOrderState({
        quantities: { ...quantities, [productId]: value },
      });
    },
    [quantities, updateOrderState]
  );

  // Calculate order totals
  const selectedProducts = Object.entries(quantities)
    .filter(([productId, qty]) => {
      // Only include products that exist in filtered products and have quantity > 0
      const product = filteredProducts.find((p) => p._id === productId);
      return parseFloat(qty) > 0 && product;
    })
    .map(([productId, quantity]) => {
      const product = filteredProducts.find((p) => p._id === productId);
      return {
        product,
        quantity: parseInt(quantity),
      };
    });

  const totalAmount = selectedProducts.reduce(
    (sum, { product, quantity }) => sum + (product?.rate || 0) * quantity,
    0
  );

  const totalWeight = selectedProducts.reduce((sum, { product, quantity }) => {
    if (!product?.weight) return sum;
    const weightMatch = product.weight.match(/(\d+(?:\.\d+)?)/);
    const weightValue = weightMatch ? parseFloat(weightMatch[1]) : 0;
    return sum + weightValue * quantity;
  }, 0);

  // Handle order submission
  const handleSubmit = async () => {
    if (!selectedSupplier) {
      updateOrderState({
        message: { type: "error", text: "Please select a supplier" },
      });
      return;
    }

    const productsToSend = Object.entries(quantities)
      .filter(([_, qty]) => parseFloat(qty) > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: parseInt(quantity),
      }));

    if (productsToSend.length === 0) {
      updateOrderState({
        message: { type: "error", text: "Please enter at least one quantity" },
      });
      return;
    }

    updateOrderState({
      isCreatingOrder: true,
      message: { type: "", text: "" },
    });

    try {
      const res = await axiosInstance.post("/order/new", {
        supplierId: selectedSupplier,
        products: productsToSend,
      });
      setOrder(res.data.order);
      console.log(order);
      updateOrderState({
        orderId: res.data.order._id,
        message: { type: "success", text: "Order created successfully!" },
        quantities: {},
        isCreatingOrder: false,
      });
    } catch (err) {
      updateOrderState({
        message: {
          type: "error",
          text:
            err.response?.data?.msg ||
            "Error creating order. Please try again.",
        },
        isCreatingOrder: false,
      });
    }
  };

  function formatDate() {
    const data = new Date(order.createdAt);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return data.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  }

  // Handle PDF download
  const handlePDFDownload = async (type) => {
    if (!orderId) {
      updateOrderState({
        message: { type: "error", text: "No order to download yet" },
      });
      return;
    }

    updateOrderState({
      isDownloadingPDF: { ...isDownloadingPDF, [type]: true },
    });

    try {
      const res = await axiosInstance.get(
        `/order/${orderId}/pdf?type=${type}`,
        { responseType: "blob" }
      );

      // Handle download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${suppliers
          .find((s) => s._id === selectedSupplier)
          .name.replace(/\s+/g, "-")
          .toUpperCase()}-${
          type === "supplier" ? "ORDER" : type.toUpperCase()
        }-LIST-${formatDate().toUpperCase()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      updateOrderState({
        message: {
          type: "success",
          text: `${type} PDF downloaded successfully!`,
        },
        isDownloadingPDF: { ...isDownloadingPDF, [type]: false },
      });
    } catch (err) {
      updateOrderState({
        message: {
          type: "error",
          text: err.response?.data?.msg || `Failed to download ${type} PDF`,
        },
        isDownloadingPDF: { ...isDownloadingPDF, [type]: false },
      });
    }
  };

  // First, remove or modify the existing handleSupplierSelect function
  // Replace the handleSupplierSelection function with this updated version:
  const handleSupplierSelection = async (supplierId) => {
    console.log(supplierId);
    try {
      // Update supplier selection state
      updateOrderState({
        selectedSupplier: supplierId,
        searchQuery: "",
        activeFilters: [],
        quantities: {}, // Reset quantities when supplier changes
      });

      if (supplierId) {
        // Fetch products for selected supplier
        const res = await axiosInstance.get(`/product/${supplierId}`);
        if (res.status === 200) {
          setProducts(res.data); // Update products with supplier-specific products
        }
      } else {
        setProducts([]); // Clear products if no supplier selected
      }
    } catch (error) {
      updateOrderState({
        message: {
          type: "error",
          text: "Error fetching supplier products. Please try again.",
        },
      });
      setProducts([]); // Clear products on error
    }
  };

  // Scroll detection effect
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      updateOrderState({ isScrollingUp });
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`max-w-[500px] w-screen min-h-screen mx-auto py-2 px-4 relative transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Supplier Selection Popup */}
      {isPopupOpen && (
        <Popup
          onClose={() => {
            updateOrderState({
              isPopupOpen: false,
            });
          }}
        >
          {/* Your popup content */}
          <div
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-6 rounded-xl flex flex-col items-center gap-4 shadow-xl border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
        `}
          >
            {/* Icon */}
            <div
              className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
          `}
            >
              <BiStore
                className={`text-2xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </div>
            {/* Title */}
            <div className="text-center">
              <h3
                className={`
              text-md font-semibold mb-1
              ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
            `}
              >
                Select a Supplier
              </h3>
              <p
                className={`text-xs my-2 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-600"
                }`}
              >
                Choose a supplier to continue with your order
              </p>
            </div>
            {/* Supplier Selection */}

            <div
              className={`w-full flex flex-col gap-2 px-2 py-1 rounded-md outline-none border text-xs transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }
    ${!selectedSupplier && "text-gray-400"}
  `}
            >
              <div
                onClick={() => {
                  updateOrderState({ showSupplierList: !showSupplierList });
                }}
                className={`p-2 cursor-pointer flex items-center justify-between transition-all duration-200  ${
                  showSupplierList
                    ? theme === "dark"
                      ? "rounded-none border-b-2 border-gray-600 pb-4"
                      : "rounded-none border-b-2 border-gray-200 pb-4"
                    : "border-none pb-0 rounded-lg"
                }`}
              >
                <span>
                  {selectedSupplier
                    ? suppliers.find(
                        (supplier) => supplier._id === selectedSupplier
                      )?.name
                    : "Select Supplier"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showSupplierList ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div
                className={`
    overflow-auto transition-all duration-200 ease-in-out
    ${showSupplierList ? "max-h-28 opacity-100" : "max-h-0 opacity-0"}
  `}
              >
                <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier._id}
                      onClick={() => {
                        handleSupplierSelection(supplier._id);
                      }}
                      className={`
            p-2 rounded-lg cursor-pointer
            transition-all duration-200
            ${
              selectedSupplier === supplier._id
                ? theme === "dark"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-purple-100 text-purple-600"
                : theme === "dark"
                ? "hover:bg-gray-600/30"
                : "hover:bg-gray-100"
            }
          `}
                    >
                      {supplier.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Continue Button */}
            <button
              onClick={() => {
                if (selectedSupplier) {
                  updateOrderState({
                    isPopupOpen: false,
                  });
                }
              }}
              disabled={!selectedSupplier}
              className={`
      w-full py-3 rounded-lg
      flex items-center justify-center gap-2
      text-xs font-medium
      transition-all duration-200
      ${
        !selectedSupplier
          ? theme === "dark"
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          : theme === "dark"
          ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
          : "bg-purple-500 text-white hover:bg-purple-600"
      }
   `}
            >
              <span>Continue to Products</span>
              <MdArrowForward className="text-lg" />
            </button>

            {/* Go Back Button */}
            <button
              onClick={() => {
                navigate(-1);
              }}
              className={`
                w-full py-2.5 rounded-lg
                flex items-center justify-center gap-2
                text-xs font-medium
                transition-all duration-200
                ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }
              `}
            >
              <span>Go Back</span>
            </button>
          </div>
        </Popup>
      )}

      {/* Main Content - only show if supplier is selected */}
      <div
        className={`
      mt-16 mb-16 flex flex-col gap-4 rounded-xl text-xs
      transition-colors duration-20
    `}
      >
        {/* Replace old search with new Search component */}
        <Search
          onFiltersUpdate={handleFiltersUpdate}
          enableDate={false}
          enableSupplier={false}
        />
        <div
          className={`
  w-full
  transition-colors duration-200
  
`}
        >
          <div className="w-full flex items-center justify-between mb-4">
            <span
              className={`text-[10px] font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Selected Supplier:{" "}
              {suppliers.find((s) => s._id === selectedSupplier)?.name || ""}{" "}
              <span className="text-gray-500">
                ({filteredProducts.length} Products)
              </span>
            </span>
          </div>
          {/* Products List */}
          <div className="flex flex-col gap-2 items-center justify-between transition-colors duration-200">
            {filteredProducts.length === 0 ? (
              <div
                className={`
        text-center text-md
        ${theme === "dark" ? "text-gray-400" : "text-gray-700"}
      `}
              >
                {searchQuery
                  ? "No products found matching your search"
                  : "No products found"}
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className={`p-2 w-full flex
            transition-colors gap-1  duration-200 border rounded-lg items-center ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-white border-gray-900/20 text-gray-800"
            } `}
                >
                  <Link
                    to={`/product-profile/${p._id}`}
                    className="w-1/5 flex items-center justify-center"
                  >
                    <div
                      className={`
          h-12 w-12 rounded-xl flex items-center justify-center
          font-bold text-lg ${getRandomColor(p.name)}
        `}
                    >
                      {getInitials(p.name)}
                    </div>
                  </Link>
                  <div className="flex flex-col w-3/5 gap-1">
                    <Link
                      to={`/product-profile/${p._id}`}
                      className={`w-3/4 flex items-center ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {p.name}
                    </Link>
                    <div className="flex gap-1">
                      <p
                        className={`px-2 text-[10px] text-white rounded-lg text-center  bg-green-800 ${
                          theme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {p.type || "N/A"}
                      </p>
                      <p
                        className={`px-2 text-[10px] text-white rounded-lg text-center  bg-green-800 ${
                          theme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        ₹{p.rate || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/5 flex justify-center items-center">
                    <input
                      type="number"
                      min="0"
                      value={quantities[p._id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(p._id, e.target.value)
                      }
                      className={`
                w-full max-w-[60px] p-1
                border rounded text-center outline-none
                transition-colors duration-200
                ${
                  theme === "dark"
                    ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-blue-400"
                    : "bg-gray-50 border-gray-900/20 text-gray-900 "
                }
              `}
                      disabled={isCreatingOrder}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Display */}
        {/* message.text */}
        {message.text && (
          <Popup>
            <div
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-6 rounded-xl flex flex-col items-center gap-4 shadow-xl border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }
        `}
            >
              {/* Icon */}
              <div
                className={`
                      w-16 h-16 rounded-full
                      flex items-center justify-center
                      ${
                        message.type === "error"
                          ? theme === "dark"
                            ? "bg-red-500/10"
                            : "bg-red-50"
                          : theme === "dark"
                          ? "bg-green-500/10"
                          : "bg-green-50"
                      }
                    `}
              >
                {message.type === "error" ? (
                  <BiError
                    className={`text-3xl ${
                      theme === "dark" ? "text-red-400" : "text-red-500"
                    }`}
                  />
                ) : (
                  <GrStatusGood
                    className={`text-3xl ${
                      theme === "dark" ? "text-green-400" : "text-green-500"
                    }`}
                  />
                )}
              </div>
              <div
                className={`w-full p-2 text-center rounded-lg text-xs font-medium border transition-colors duration-200 ${
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
              {orderId && (
                <div className="flex flex-col w-full justify-center items-center gap-2">
                  {/* Shopkeeper PDF Button */}
                  {message.type === "success" && (
                    <>
                      <button
                        onClick={() => handlePDFDownload("shopkeeper")}
                        disabled={isDownloadingPDF.shopkeeper}
                        className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-md transition-all duration-200 font-medium ${
                          isDownloadingPDF.shopkeeper
                            ? "text-gray-400 bg-[#5e2b9dc1] cursor-not-allowed"
                            : "text-gray-300 bg-[#5e2b9d]"
                        }`}
                      >
                        {isDownloadingPDF.shopkeeper ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <IoMdDownload />
                            <span>Download (Shopkeeper Version)</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handlePDFDownload("supplier")}
                        disabled={isDownloadingPDF.supplier}
                        className={`w-full flex items-center justify-center gap-2 text-xs p-3 rounded-md transition-all duration-200 font-medium ${
                          isDownloadingPDF.supplier
                            ? "text-gray-400 bg-[#5e2b9dc1] cursor-not-allowed"
                            : "text-gray-300 bg-[#5e2b9d]"
                        }`}
                      >
                        {isDownloadingPDF.supplier ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <IoMdDownload />
                            <span>Download (Supplier Version)</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  updateOrderState({ message: { type: "", text: "" } });
                }}
                className={`w-full
                           flex-1 py-2.5 rounded-md
                           text-[10px] font-medium
                           transition-colors duration-200
                           hover:scale-[0.98] active:scale-[0.97]
      
      ${
        message.type === "success"
          ? theme === "dark"
            ? "text-green-400 bg-green-500/20"
            : "text-green-600 bg-green-500/20"
          : theme === "dark"
          ? "text-red-400 bg-red-500/10"
          : "text-red-600 bg-red-500/10"
      }
      
                        `}
              >
                <span>Close</span>
              </button>
            </div>
          </Popup>
        )}
      </div>
      {/* Order Preview */}
      <div
        className={`
    fixed w-full max-w-[500px] left-1/2 -translate-x-1/2
    ${
      selectedProducts.length > 0
        ? isScrollingUp
          ? "-bottom-32"
          : "bottom-0"
        : "-bottom-32"
    }
    transition-all duration-500 ease-in-out z-50
  `}
      >
        {/* Gradient overlay for better visibility */}
        <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Main container */}
        <div
          className={`
    px-4 py-2 backdrop-blur-md shadow-xl
    border-t
    ${
      theme === "dark"
        ? "bg-gray-800/95 border-gray-700"
        : "bg-white/95 border-gray-200"
    }
  `}
        >
          <div className="flex flex-col items-center justify-between gap-2">
            {/* Order details */}
            <div className="flex-1 grid grid-cols-3 gap-2 w-full">
              <div
                className={`
          flex flex-col items-center p-2 rounded-lg
          ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}
        `}
              >
                <span
                  className={`text-[10px] ${
                    theme === "dark" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Amount
                </span>
                <span
                  className={`text-xs font-semibold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  ₹{totalAmount.toFixed(2) * 1}
                </span>
              </div>

              <div
                className={`
          flex flex-col items-center p-2 rounded-lg
          ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}
        `}
              >
                <span
                  className={`text-[10px] ${
                    theme === "dark" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Items
                </span>
                <span
                  className={`text-xs font-semibold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {selectedProducts.length}
                </span>
              </div>

              <div
                className={`
          flex flex-col items-center p-2 rounded-lg
          ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}
        `}
              >
                <span
                  className={`text-[10px] ${
                    theme === "dark" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Weight
                </span>
                <span
                  className={`text-xs font-semibold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {totalWeight.toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Create order button */}
            <button
              onClick={handleSubmit}
              disabled={isCreatingOrder || !selectedSupplier}
              className={`
         w-full h-12 px-2
          rounded-lg font-medium text-xs
          flex items-center justify-center gap-1
          transition-all duration-200
          ${
            isCreatingOrder || !selectedSupplier
              ? theme === "dark"
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-100 text-gray-400"
              : theme === "dark"
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 active:scale-95"
              : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
          }
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        `}
            >
              <span>
                {isCreatingOrder ? (
                  <AiOutlineLoading3Quarters className="text-lg animate-spin" />
                ) : (
                  <RiAiGenerate className="text-lg" />
                )}
              </span>
              <span>{isCreatingOrder ? "Creating..." : "Create Order"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
