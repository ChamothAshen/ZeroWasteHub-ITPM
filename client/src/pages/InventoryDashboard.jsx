import React from "react";
import { FaRecycle, FaTrash, FaUtensils, FaBox, FaLeaf } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import { Bar } from "react-chartjs-2";
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
    ],
    datasets: [
      {
        label: "Plastic",
        data: [120, 130, 110, 140, 150, 160, 170, 180, 190, 200, 210, 220], // Example data for Plastic
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Paper",
        data: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135], // Example data for Paper
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Food",
        data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105], // Example data for Food
        backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "General Waste",
        data: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310], // Example data for General Waste
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Recycling",
        data: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260], // Example data for Recycling
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Purple
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const chartOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow the chart to stretch to fit the container
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Inventory Overview (2023)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
        stacked: false, // Grouped bars (not stacked)
      },
      y: {
        title: {
          display: true,
          text: "Inventory (kg)",
        },
        beginAtZero: true,
        stacked: false, // Grouped bars (not stacked)
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Menu Button */}
        <header className="flex justify-between items-center mb-8">
          <button
            className="md:hidden text-gray-800 text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Dashboard
          </h1>
        </header>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today Weight Counts 
        </h2>
        {/* Top Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {/* Box 1: Plastic */}
          <div className="w-full h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform hover:scale-105 transition-transform border border-blue-200">
            <FaBox className="text-4xl text-blue-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Plastic</h2>
            <p className="text-2xl font-bold text-gray-900">120 kg</p>
          </div>

          {/* Box 2: Paper */}
          <div className="w-full h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform hover:scale-105 transition-transform border border-green-200">
            <FaLeaf className="text-4xl text-green-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Paper</h2>
            <p className="text-2xl font-bold text-gray-900">80 kg</p>
          </div>

          {/* Box 3: Food */}
          <div className="w-full h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform hover:scale-105 transition-transform border border-orange-200">
            <FaUtensils className="text-4xl text-orange-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Food</h2>
            <p className="text-2xl font-bold text-gray-900">50 kg</p>
          </div>

          {/* Box 4: General Waste */}
          <div className="w-full h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform hover:scale-105 transition-transform border border-red-200">
            <FaTrash className="text-4xl text-red-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">
              General Waste
            </h2>
            <p className="text-2xl font-bold text-gray-900">200 kg</p>
          </div>

          {/* Box 5: Recycling */}
          <div className="w-full h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform hover:scale-105 transition-transform border border-purple-200">
            <FaRecycle className="text-4xl text-purple-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Recycling</h2>
            <p className="text-2xl font-bold text-gray-900">150 kg</p>
          </div>
        </div>

        {/* Large Box for Chart or Data Visualization */}
        <div className="w-full max-w-6xl mx-auto h-[600px] bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Inventory Overview (2023)
          </h2>
          <div className="w-full h-[500px]">
            {" "}
            {/* Fixed height for the chart container */}
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;
