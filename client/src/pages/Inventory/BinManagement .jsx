import React, { useState } from "react";
import { FaRecycle, FaTrash, FaUtensils, FaBox, FaLeaf } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/Sidebar"; // Import the Sidebar component
import SmartBinRequestsTable from "../Inventory/SmartBinRequestsTable.jsx"; // Import the SmartBinRequestsTable component
import WasteBinCounts from "./WasteBinCounts.jsx";

const BinManagement = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Data for the grouped bar chart

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

  const [tools, setTools] = useState([
    { id: 1, name: "Hammer", category: "Hand Tools", quantity: 10 },
    { id: 2, name: "Drill", category: "Power Tools", quantity: 5 },
    { id: 3, name: "Screwdriver", category: "Hand Tools", quantity: 20 },
  ]);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for new tool form
  const [newTool, setNewTool] = useState({
    name: "",
    category: "",
    quantity: "",
  });

  // Handle add button click
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTool({ name: "", category: "", quantity: "" });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTool({ ...newTool, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newToolWithId = { ...newTool, id: tools.length + 1 };
    setTools([...tools, newToolWithId]);
    handleCloseModal();
  };

  // Handle delete tool
  const handleDelete = (id) => {
    setTools(tools.filter((tool) => tool.id !== id));
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
            Bin & Tools Dashboard
          </h1>
        </header>

        {/* Top Boxes */}

        <WasteBinCounts />

        {/* Large Box for Chart or Data Visualization */}

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Request Bins
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <SmartBinRequestsTable />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tools & Others
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Add Button */}
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleAdd}
            >
              Add Tool
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr
                    key={tool.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {tool.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {tool.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {tool.quantity}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(tool.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Adding New Tool */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Tool</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newTool.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={newTool.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={newTool.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BinManagement;
