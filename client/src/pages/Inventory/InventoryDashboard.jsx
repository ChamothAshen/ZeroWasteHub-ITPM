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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
        text: "Monthly Inventory Trends", // More descriptive title
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
        const res = await axios.get(
          "http://localhost:3000/api/inventory/getTodayWeight"
        );
        const dataObj = {};
        res.data.data.forEach((item) => {
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

  // Add state for monthly chart data
  const [monthlyChartData, setMonthlyChartData] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setMonthlyLoading(true);
      setMonthlyError(null);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/Inventory/getMonthlyWeight"
        );
        const { data } = response.data;

        // Define all months
        const allMonths = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // Ensure all months are included in the labels
        const labels = allMonths;

        // Get unique categories from the data
        const categories = [
          ...new Set(
            data.flatMap((item) => item.categories.map((cat) => cat.category))
          ),
        ];

        // Create datasets for each category
        const datasets = categories.map((category) => ({
          label: category,
          data: labels.map((month) => {
            const monthData = data.find((item) => item.monthName === month);
            if (monthData) {
              const categoryData = monthData.categories.find(
                (cat) => cat.category === category
              );
              return categoryData ? categoryData.totalWeight : 0;
            }
            return 0; // Default to 0 if the month has no data
          }),
          backgroundColor: getCategoryColor(category), // Assign colors dynamically
          borderColor: getCategoryBorderColor(category),
          borderWidth: 1,
        }));

        setMonthlyChartData({ labels, datasets });
      } catch (error) {
        console.error("Failed to fetch monthly data:", error);
        setMonthlyError("Failed to load monthly data.");
      } finally {
        setMonthlyLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  // Helper functions for dynamic colors
  const getCategoryColor = (category) => {
    const colors = {
      Plastic: "rgba(54, 162, 235, 0.7)", // Blue
      "E-Waste": "rgba(153, 102, 255, 0.7)", // Purple
      Paper: "rgba(75, 192, 192, 0.7)", // Teal
      Food: "rgba(255, 159, 64, 0.7)", // Orange
      "General Waste": "rgba(255, 99, 132, 0.7)", // Red
      Recycling: "rgba(102, 166, 54, 0.7)", // Green
    };
    return colors[category] || "rgba(201, 203, 207, 0.7)"; // Default color
  };

  const getCategoryBorderColor = (category) => {
    const colors = {
      Plastic: "rgba(54, 162, 235, 1)", // Blue
      "E-Waste": "rgba(153, 102, 255, 1)", // Purple
      Paper: "rgba(75, 192, 192, 1)", // Teal
      Food: "rgba(255, 159, 64, 1)", // Orange
      "General Waste": "rgba(255, 99, 132, 1)", // Red
      Recycling: "rgba(102, 166, 54, 1)", // Green
    };
    return colors[category] || "rgba(201, 203, 207, 1)"; // Default color
  };

  const generatePDF = async () => {
    const chartElement = document.getElementById("monthly-inventory-chart");
    if (!chartElement) {
      console.error("Chart element not found!");
      return;
    }

    try {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save("Monthly_Inventory_Overview.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

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

  // Render the monthly chart
  if (monthlyLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading monthly data...</p>
      </div>
    );
  }

  if (monthlyError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{monthlyError}</p>
      </div>
    );
  }

  // Add the monthly chart to the existing layout
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
            <p className="text-xl font-bold text-gray-800">
              {categoryData["Plastic"] || 0} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-green-500 mb-2">
              <FaLeaf className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Paper</h3>
            <p className="text-xl font-bold text-gray-800">
              {categoryData["Paper"] || 0} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-orange-500 mb-2">
              <FaUtensils className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Food</h3>
            <p className="text-xl font-bold text-gray-800">
              {categoryData["Food"] || 0} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-red-500 mb-2">
              <FaTrash className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">
              General Waste
            </h3>
            <p className="text-xl font-bold text-gray-800">
              {categoryData["General Waste"] || 0} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow duration-200">
            <div className="text-green-600 mb-2">
              <FaRecycle className="text-3xl" />
            </div>
            <h3 className="text-md font-semibold text-gray-700">Glass</h3>
            <p className="text-xl font-bold text-gray-800">
              {categoryData["Recycling"] || 0} kg
            </p>
          </div>
        </div>

        {/* Monthly Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Monthly Inventory Overview
            </h2>
            <button
              onClick={generatePDF}
              className="bg-blue-500 text-white px-4 py-2 
              bg-gradient-to-r from-green-600 to-teal-500 rounded-lg shadow-lg p-8 text-white mb-8"
            >
              Download PDF
            </button>
          </div>
          <div id="monthly-inventory-chart" className="h-[400px] md:h-[500px]">
            {monthlyChartData && (
              <Bar data={monthlyChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;
