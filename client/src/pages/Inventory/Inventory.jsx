import React, { useState, useEffect } from "react";
import { FiMenu, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    category: "",
    weights: "",
    quantity: "",
    binSize: "",
    date: "",
  });

  const [tableData, setTableData] = useState([]);
  const categories = ["Plastic", "Paper", "Food", "General Waste", "Recycling"];

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/Inventory/getInv"
        );
        setTableData(res.data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/Inventory/addInv",
        formData
      );
      setTableData((prev) => [...prev, res.data]);
      setFormData({
        company: "",
        category: "",
        weights: "",
        quantity: "",
        binSize: "",
        date: "",
      });
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };
  //CREATE DELETe FUNCTION
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/Inventory/deleteInv/${id}`);
      setTableData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button
            className="md:hidden text-green-600 text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold capitalize">{activeTab}</h2>
        </header>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Add Garbage Details Per Day
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
              className="p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="weights"
              value={formData.weights}
              onChange={handleChange}
              placeholder="Weights"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="binSize"
              value={formData.binSize}
              onChange={handleChange}
              placeholder="Bin Size"
              className="p-2 border rounded"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="col-span-2 bg-green-600 text-white py-2 rounded"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Company
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Weights(kg)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Bin Size
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Edit
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.company}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.weights}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.binSize}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => navigate(`/inventory/update/${item._id}`)} // replace with your route
                      >
                        <FiEdit />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
