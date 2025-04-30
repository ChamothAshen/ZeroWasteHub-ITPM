import React, { useState, useEffect } from "react";
import { FiMenu, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import InventoryForm from "../Inventory/InventoryForm.jsx";

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
  /*   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 */

  //CREATE DELETe FUNCTION
  const handleDeleteCompany = async (companyId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/Inventory/deleteInv/${companyId}`
      );
      setTableData((prev) => prev.filter((item) => item._id !== companyId));
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const handleDeleteEntry = async (companyId, entryId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/Inventory/deleteEntry/${companyId}/${entryId}`
      );
      setTableData((prev) =>
        prev.map((item) =>
          item._id === companyId
            ? {
                ...item,
                entries: item.entries.filter((entry) => entry._id !== entryId),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to delete entry:", error);
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
          <div>
            <InventoryForm />
          </div>
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
                  <React.Fragment key={item._id}>
                    {/* Group header: Company name */}
                    <tr className="bg-green-100">
                      <td
                        colSpan={8}
                        className="py-3 px-4 font-semibold text-green-800"
                      >
                        {item.company}
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteCompany(item._id)}
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>

                    {/* Entries for the company */}
                    {Array.isArray(item.entries) && item.entries.length > 0 ? (
                      item.entries.map((entry, idx) => (
                        <tr
                          key={`${item._id}-${entry._id || idx}`}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700"></td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {entry.category}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {entry.weights}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {entry.quantity}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {entry.binSize}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            <button
                              className="text-green-600 hover:text-green-800"
                              onClick={() =>
                                navigate(`/inventory/update/${item._id}`)
                              }
                            >
                              <FiEdit />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() =>
                                handleDeleteEntry(item._id, entry._id)
                              }
                            >
                              <FiTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700"></td>
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
                            onClick={() =>
                              navigate(`/inventory/update/${item._id}`)
                            }
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
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
