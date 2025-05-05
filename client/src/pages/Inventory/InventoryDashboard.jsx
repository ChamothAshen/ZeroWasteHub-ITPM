import React from "react";
import { FaRecycle, FaTrash, FaUtensils, FaBox, FaLeaf } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/Sidebar"; // Import the Sidebar component
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Data for the grouped bar chart
  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Plastic",
        data: [120, 130, 110, 140, 150, 160, 170, 180, 190, 200, 210, 220],
        backgroundColor: "rgba(54, 162, 235, 0.7)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Paper",
        data: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
        backgroundColor: "rgba(75, 192, 192, 0.7)", // Teal
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Food",
        data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
        backgroundColor: "rgba(255, 159, 64, 0.7)", // Orange
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "General Waste",
        data: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310],
        backgroundColor: "rgba(255, 99, 132, 0.7)", // Red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Glass", // Renamed for clarity
        data: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260],
        backgroundColor: "rgba(102, 166, 54, 0.7)", // Green
        borderColor: "rgba(102, 166, 54, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // More common position
        labels: {
          font: {
            size: 12,
          },
          color: "#4B5563", // Darker gray for better readability
        },
      },
      title: {
        display: true,
        text: "Monthly Inventory Trends (2023)", // More descriptive title
        color: "#374151", // Even darker gray
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 10,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          color: "#6B7280",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          color: "#4B5563",
        },
        grid: {
          borderColor: "#E5E7EB", // Lighter grid lines
          drawBorder: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
          color: "#6B7280",
          font: {
            weight: "bold",
          },
        },
        beginAtZero: true,
        ticks: {
          color: "#4B5563",
        },
        grid: {
          borderColor: "#E5E7EB",
          drawBorder: false,
        },
      },
    },
  };

  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:3000/api/inventory/getTodayWeight");
        const dataObj = {};
        res.data.data.forEach(item => {
          dataObj[item.category] = item.totalWeight;
        });
        setCategoryData(dataObj);
      } catch (error) {
        console.error("Failed to fetch today's data:", error);
        setError("Failed to load today's data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              className="md:hidden text-gray-600 text-2xl focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Inventory Dashboard
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading today's data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              className="md:hidden text-gray-600 text-2xl focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Inventory Dashboard
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header with Menu Button */}
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <button
            className="md:hidden text-gray-600 text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Inventory Dashboard
          </h1>
        </header>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Today's Inventory Snapshot
        </h2>
        {/* Top Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-blue-500 mb-2">
              <FaBox className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Plastic</h3>
            <p className="text-xl font-bold text-gray-800">{categoryData["Plastic"] || 0} kg</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-green-500 mb-2">
              <FaLeaf className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Paper</h3>
            <p className="text-xl font-bold text-gray-800">{categoryData["Paper"] || 0} kg</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-orange-500 mb-2">
              <FaUtensils className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Food</h3>
            <p className="text-xl font-bold text-gray-800">{categoryData["Food"] || 0} kg</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-red-500 mb-2">
              <FaTrash className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">General Waste</h3>
            <p className="text-xl font-bold text-gray-800">{categoryData["General Waste"] || 0} kg</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-green-600 mb-2">
              <FaRecycle className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Glass</h3>
            <p className="text-xl font-bold text-gray-800">{categoryData["Recycling"] || 0} kg</p>
          </div>
        </div>

        {/* Large Box for Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Monthly Inventory Overview
          </h2>
          <div className="h-[400px] md:h-[500px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;