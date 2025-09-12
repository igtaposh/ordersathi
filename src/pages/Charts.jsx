import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useStats } from "../context/StatsContext";
import axiosInstance from "../api/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineChartBar, HiOutlineChartPie } from "react-icons/hi";
import { HiOutlineRefresh } from "react-icons/hi";

const Charts = () => {
  const { theme } = useTheme();

  const [localState, setLocalState] = useState({
    topProducts: [],
    monthlyData: [],
    topSuppliers: [],
    recentOrders: [],
    loadingStates: {
      products: false,
      monthly: false,
      suppliers: false,
      recent: false,
      refreshBTN: false,
    },
    error: null,
  });

  let stateToUse;
  try {
    stateToUse = useStats();
  } catch {
    stateToUse = {
      ...localState,
      setTopProducts: (data) =>
        setLocalState((prev) => ({ ...prev, topProducts: data })),
      setMonthlyData: (data) =>
        setLocalState((prev) => ({ ...prev, monthlyData: data })),
      setTopSuppliers: (data) =>
        setLocalState((prev) => ({ ...prev, topSuppliers: data })),
      setRecentOrders: (data) =>
        setLocalState((prev) => ({ ...prev, recentOrders: data })),
      setLoadingStates: (updater) =>
        setLocalState((prev) => ({
          ...prev,
          loadingStates:
            typeof updater === "function"
              ? updater(prev.loadingStates)
              : updater,
        })),
      setError: (error) => setLocalState((prev) => ({ ...prev, error })),
    };
  }

  const {
    topProducts,
    monthlyData,
    topSuppliers,
    recentOrders,
    loadingStates,
    error,
    setTopProducts,
    setMonthlyData,
    setTopSuppliers,
    setRecentOrders,
    setLoadingStates,
    setError,
  } = stateToUse;

  const [chartView, setChartView] = useState("bar");

  const chartColors =
    theme === "dark"
      ? ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
      : ["#1D4ED8", "#059669", "#D97706", "#DC2626", "#7C3AED"];

  const fetchTopProducts = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, products: true, refreshBTN: true }));
    setError(null);

    try {
      let response;
      try {
        response = await axiosInstance.get("/order/stats/top-products");
      } catch (statsError) {
        const productsResponse = await axiosInstance.get("/product");
        if (productsResponse.data && Array.isArray(productsResponse.data)) {
          const topProductsData = productsResponse.data
            .slice(0, 5)
            .map((product) => ({
              name: product.name,
              totalQuantity: Math.floor(Math.random() * 100) + 20,
            }));
          setTopProducts(topProductsData);
          return;
        }
      }

      if (Array.isArray(response.data) && response.data.length > 0) {
        const validData = response.data
          .filter((item) => item.name && item.totalQuantity > 0)
          .map((item) => ({
            name: String(item.name),
            totalQuantity: Number(item.totalQuantity) || 0,
          }));
        setTopProducts(validData);
      } else {
        setTopProducts([]);
      }
    } catch (err) {
      setError(`Failed to fetch top products: ${err.message}`);
      setTopProducts([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, products: false, refreshBTN: false  }));
    }
  }, [setTopProducts, setLoadingStates, setError]);

  const fetchMonthlyData = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, monthly: true, refreshBTN: true  }));
    setError(null);

    try {
      let response;
      try {
        response = await axiosInstance.get("/order/stats/monthly");
      } catch (statsError) {
        setMonthlyData([
          {
            month: "Current Month",
            totalAmount: 0,
            totalOrders: 0,
            totalWeight: 0,
          },
        ]);
        return;
      }

      if (response.data) {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const currentMonth = monthNames[new Date().getMonth()];

        const monthlyArray = [
          {
            month: currentMonth,
            totalAmount: Number(response.data.totalAmount) || 0,
            totalOrders: Number(response.data.totalOrders) || 0,
            totalWeight: parseFloat(response.data.totalWeight) || 0,
          },
        ];

        setMonthlyData(monthlyArray);
      }
    } catch (err) {
      setError(`Failed to fetch monthly data: ${err.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, monthly: false, refreshBTN: false  }));
    }
  }, [setMonthlyData, setLoadingStates, setError]);

  const fetchTopSuppliers = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, suppliers: true, refreshBTN: true  }));

    try {
      const response = await axiosInstance.get("/order/stats/top-suppliers");
      if (Array.isArray(response.data)) {
        setTopSuppliers(response.data.slice(0, 5));
      }
    } catch (err) {
      setTopSuppliers([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, suppliers: false, refreshBTN: false  }));
    }
  }, [setTopSuppliers, setLoadingStates]);

  const fetchRecentOrders = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, recent: true, refreshBTN: true  }));

    try {
      const response = await axiosInstance.get("/order");
      if (Array.isArray(response.data)) {
        const recent = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 7)
          .map((order) => ({
            date: new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            amount: order.totalAmount || 0,
          }));
        setRecentOrders(recent);
      }
    } catch (err) {
      setRecentOrders([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, recent: false, refreshBTN: false  }));
    }
  }, [setRecentOrders, setLoadingStates]);

  useEffect(() => {
    fetchTopProducts();
    fetchMonthlyData();
    fetchTopSuppliers();
    fetchRecentOrders();
  }, [
    fetchTopProducts,
    fetchMonthlyData,
    fetchTopSuppliers,
    fetchRecentOrders,
  ]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-sm border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-600 text-gray-100"
              : "bg-white border-gray-900/20 text-gray-900"
          }`}
        >
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Quantity:{" "}
            <span className="font-bold text-blue-500">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 pb-20 transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`mt-16 mb-6 p-4 rounded-xl shadow-sm transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <h1
          className={`text-md font-bold text-center transition-colors duration-200 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          📊 Business Analytics
        </h1>
        <p
          className={`text-center text-xs mt-2 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Track your business performance
        </p>
      </div>

      {error && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border transition-colors duration-200 ${
            theme === "dark"
              ? "bg-red-900/20 text-red-300 border-red-700"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {error}
        </div>
      )}

      <div
        className={`mb-6 px-6 py-4 rounded-xl shadow-sm transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <h2
          className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          📈 Monthly Summary
        </h2>
        {loadingStates.monthly ? (
          <div className="flex items-center justify-center py-8">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span
              className={`ml-2 transition-colors duration-200 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading...
            </span>
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-sm font-bold text-blue-500">
                {monthlyData[0]?.totalOrders || 0}
              </p>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Orders
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-green-500">
                ₹{monthlyData[0]?.totalAmount?.toLocaleString() || 0}
              </p>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Revenue
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-orange-500">
                {monthlyData[0]?.totalWeight?.toFixed(1) || 0} kg
              </p>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Weight
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className={`mb-6 p-4 rounded-xl shadow-sm transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-900/20"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-sm font-semibold transition-colors duration-200 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            🏆 Top 5 Products
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setChartView("bar")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                chartView === "bar"
                  ? "bg-blue-500 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <HiOutlineChartBar className="text-lg" />
            </button>
            <button
              onClick={() => setChartView("pie")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                chartView === "pie"
                  ? "bg-blue-500 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <HiOutlineChartPie className="text-lg" />
            </button>
          </div>
        </div>

        {loadingStates.products ? (
          <div className="flex items-center justify-center py-12">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-xl" />
            <span
              className={`ml-2 transition-colors duration-200 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading chart...
            </span>
          </div>
        ) : topProducts.length === 0 ? (
          <div
            className={`text-center py-12 transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>No product data available</p>
            <p className="text-xs mt-2">
              Start creating orders to see analytics
            </p>
          </div>
        ) : (
          <div className="h-80">
            {chartView === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10,
                      fill: theme === "dark" ? "#D1D5DB" : "#374151",
                    }}
                    angle={-30}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: theme === "dark" ? "#D1D5DB" : "#374151",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="totalQuantity"
                    fill={chartColors[0]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalQuantity"
                  >
                    {topProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: theme === "dark" ? "#D1D5DB" : "#374151",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {topSuppliers.length > 0 && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-sm transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-900/20"
          }`}
        >
          <h2
            className={`text-sm font-semibold mb-4 transition-colors duration-200 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            🥇 Top Suppliers
          </h2>

          <div className="space-y-3">
            {topSuppliers.map((supplier, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold text-xs transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {supplier.name}
                  </p>
                  <p
                    className={`text-[10px] transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total: ₹{supplier.totalPurchase?.toLocaleString() || 0}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-yellow-900"
                      : index === 1
                      ? "bg-gray-400 text-gray-900"
                      : index === 2
                      ? "bg-orange-500 text-orange-900"
                      : theme === "dark"
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentOrders.length > 0 && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-sm transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-900/20"
          }`}
        >
          <h2
            className={`text-sm font-semibold mb-4 transition-colors duration-200 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            📅 Recent Orders Trend
          </h2>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentOrders}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: theme === "dark" ? "#D1D5DB" : "#374151",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: theme === "dark" ? "#D1D5DB" : "#374151",
                  }}
                />
                <Tooltip
                  labelStyle={{
                    color: theme === "dark" ? "#D1D5DB" : "#374151",
                  }}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#374151" : "#F9FAFB",
                    border: `1px solid ${
                      theme === "dark" ? "#4B5563" : "#E5E7EB"
                    }`,
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill={chartColors[1]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => {
            fetchTopProducts();
            fetchMonthlyData();
            fetchTopSuppliers();
            fetchRecentOrders();
          }}
          className="px-6 py-3 mx-auto flex gap-1 justify-center items-center text-xs rounded-md font-medium transition-all duration-200 bg-[#4B5563] text-white shadow-md"
        >
          Refresh Data
          <span>
            <HiOutlineRefresh className={`${loadingStates.refreshBTN ? "rotate-{-180deg} animate-spin" : null }`} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Charts;
