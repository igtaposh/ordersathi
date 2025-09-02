import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { ProductContext } from "../context/ProductContext";
import { SupplierContext } from "../context/SupplierContext";
import { useTheme } from "../context/ThemeContext";
import createOrder from "../assets/create-order.png";
import productsPNG from "../assets/products.png";
import stockReport from "../assets/stock-report.png";
import supplierPNG from "../assets/suppliers.png";
import bg from "../assets/bg.png";
import products2 from "../assets/products2.png";
import suppliers2 from "../assets/suppliers2.png";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Navigation and context hooks
  const { theme } = useTheme();
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const { products, setProducts } = useContext(ProductContext);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Loading states for different data sections
  const [loadingStates, setLoadingStates] = useState({
    stats: true,
    topSuppliers: true,
    topProducts: true,
    recentOrders: true,
  });

  // Message state for success/error feedback
  const [message, setMessage] = useState({ type: "", text: "" });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Scroll event listener to track scroll position
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
  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get("/supplier");
        if (res.status !== 200) {
          throw new Error("Failed to fetch suppliers");
        }
        const data = res.data;
        setSuppliers(data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Error fetching suppliers. Please refresh the page.",
        });
      }
    };
    fetchSuppliers();
  }, [setSuppliers]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product");
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        const data = res.data;
        setProducts(data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Error fetching products. Please try again.",
        });
      }
    };
    fetchProducts();
  }, [setProducts]);

  return (
    <motion.div
      className={`w-full min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`max-w-[500px] w-full flex items-center justify-start p-4 fixed top-0 z-[60]  ${
          scrollPosition >= 135
            ? `shadow-md transition-all duration-300 ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`
            : ""
        }`}
      >
        <Link to={"/profile"} className="w-full flex items-center ">
          <img
            className={`h-6 w-6 rounded-full  ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}
            src="https://avatar.iran.liara.run/public"
            alt=""
          />
        </Link>
      </div>
      <div className={`h-48 w-full relative overflow-hidden bg-[#5e2b9d] `}>
        <img
          className="absolute inset-0 w-52 top-2 opacity-50  left-1/2 translate-x-[-50%] object-cover"
          src={bg}
          alt="Background"
        />
      </div>
      <div
        className={`min-h-screen h-full flex flex-col gap-2 w-full p-4 pb-32 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="w-full flex items-center justify-between gap-2">
          <Link
            to={"/create-product"}
            className={`w-full flex flex-col gap-2 p-2 items-center justify-center text-center rounded-lg scale-90 ${
              theme === "dark" ? "bg-gray-800" : "text-gray-900 bg-gray-200"
            }`}
          >
            <span
              className={`relative text-3xl w-12 h-12 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <span className="absolute -bottom-2.5 left-2 w-8 flex items-center justify-center">
                <img src={products2} alt="" />
              </span>
            </span>
            <p className="libre-franklin-regular text-[8px] font-mono font-medium tracking-normal">
              Add New Product
            </p>
          </Link>
          <Link
            to={"/create-supplier"}
            className={`w-full flex flex-col gap-2 p-2 items-center justify-center text-center rounded-lg scale-90 ${
              theme === "dark" ? "bg-gray-800" : "text-gray-900 bg-gray-200"
            }`}
          >
            <span
              className={`relative text-3xl w-12 h-12 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <span className="absolute -bottom-2.5 -left-1 w-16 flex items-center justify-center">
                <img src={suppliers2} alt="" />
              </span>
            </span>
            <p className="libre-franklin-regular text-[8px] font-mono font-medium tracking-normal">
              Add New Supplier
            </p>
          </Link>
          <Link
            to={"/create-order"}
            className={`w-full flex flex-col gap-2 p-2 items-center justify-center text-center rounded-lg scale-90 ${
              theme === "dark" ? "bg-gray-800" : "text-gray-900 bg-gray-200"
            }`}
          >
            <span
              className={`relative text-3xl w-12 h-12 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <span className="absolute -bottom-2 -left-0.5 w-12 flex items-center justify-center">
                <img src={createOrder} alt="" />
              </span>
            </span>
            <p className="media libre-franklin-regular text-[8px]  font-medium tracking-normal">
              Create Order List
            </p>
          </Link>
          <Link
            to={"/create-stock-report"}
            className={`w-full flex flex-col gap-2 p-2 items-center justify-center text-center rounded-lg scale-90 ${
              theme === "dark" ? "bg-gray-800" : "text-gray-900 bg-gray-200"
            }`}
          >
            <span
              className={`relative text-3xl w-12 h-12 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <span className="absolute -bottom-1 left-0.5 w-12 flex items-center justify-center ">
                <img src={stockReport} alt="" />
              </span>
            </span>
            <p className="libre-franklin-regular text-[8px] font-mono font-medium tracking-normal">
              Create Stock Report
            </p>
          </Link>
        </div>
        <div
          className={`w-full h-16 flex items-center justify-between gap-3 rounded-md p-2 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          <Link
            className={`w-full h-full flex items-center justify-center text-center rounded-lg relative overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            }`}
            to={"/products"}
          >
            <div className="w-full h-full flex flex-col p-2 z-50">
              <p className="libre-franklin-regular text-md text-start">
                Products ({products.length})
              </p>
              <p className=" text-start libre-franklin-regular text-[8px]">
                In Inventory
              </p>
            </div>
            <span className="absolute -bottom-2 -right-4 w-20 flex items-center justify-center opacity-50">
              <img src={productsPNG} alt="" />
            </span>
          </Link>
          <Link
            className={`w-full h-full flex items-center justify-center text-center rounded-lg relative overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            }`}
            to={"/suppliers"}
          >
            <div className="w-full h-full flex flex-col p-2 z-50">
              <p className="libre-franklin-regular text-md text-start">
                Suppliers ({suppliers.length})
              </p>
              <p className=" text-start libre-franklin-regular text-[8px]">
                In Total
              </p>
            </div>
            <span className="absolute -bottom-1 -right-3 w-24 flex items-center justify-center opacity-50">
              <img src={supplierPNG} alt="" />
            </span>
          </Link>
        </div>
        <div
          className={`w-full h-[1px] mb-2 ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-full p-2 rounded-md text-xs  ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <p>About OrderSathi</p>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <p>
            <b className="">OrderSathi</b> is a fast, simple, and free order &
            stock management app for shopkeepers, suppliers, and small
            businesses.
          </p>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <ul>
            <p>🎯 Why Use It?</p>
            <li>• Easy order creation & management</li>
            <li>• No more manual paperwork or errors</li>
            <li>• Generate professional PDF reports instantly</li>
            <li>• Access your data anytime, anywhere</li>
          </ul>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <ul>
            <p>📋 What You Can Do</p>
            <li>• Create and manage product orders</li>
            <li>• Track suppliers & products</li>
            <li>• Download order/stock reports as PDFs</li>
            <li>• Keep a digital record of your business</li>
          </ul>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <ul>
            <p>💡 Tips for Best Use</p>
            <li>• Keep supplier/product lists updated</li>
            <li>• Use PDFs to share orders or reports</li>
            <li>• Update stock regularly for accuracy</li>
            <li>• Use on mobile or desktop</li>
          </ul>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <ul>
            <p>⚙️ How It Works</p>
            <li>• Sign up & log in</li>
            <li>• Add suppliers & products</li>
            <li>• Create your order list</li>
            <li>• Download/share PDFs</li>
            <li>• Track stock & view reports</li>
          </ul>
        </div>
        <div
          className={`text-xs p-2 w-full flex items-center justify-between gap-3 rounded-md ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <ul>
            <p>💰 100% Free</p>
            <li>
              No charges, subscriptions, or hidden fees. Built to support small
              businesses.
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
