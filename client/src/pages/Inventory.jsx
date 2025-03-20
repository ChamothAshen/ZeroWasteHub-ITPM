import React, { useState } from "react";
import { FiMenu, FiEdit, FiTrash } from "react-icons/fi";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dummy data for the table
  const [tableData, setTableData] = useState([
    { id: 1, company: "Company A", category: "Category 1", weights: "100kg", date: "2023-10-01" },
    { id: 2, company: "Company B", category: "Category 2", weights: "200kg", date: "2023-10-02" },
    { id: 3, company: "Company C", category: "Category 3", weights: "150kg", date: "2023-10-03" },
  ]);

  // State for managing the modal and editing item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Open modal and set the item to edit
  const handleEdit = (id) => {
    const itemToEdit = tableData.find((item) => item.id === id);
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  };

  // Close modal and reset editing item
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Save changes to the table data
  const handleSave = () => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    closeModal();
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Delete an item from the table
  const handleDelete = (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button className="md:hidden text-green-600 text-2xl" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold capitalize">{activeTab}</h2>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Company</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Weights</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Edit</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Delete</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{item.company}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.weights}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleEdit(item.id)}
                      >
                        <FiEdit />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item.id)}
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

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  name="company"
                  value={editingItem.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editingItem.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Weights</label>
                <input
                  type="text"
                  name="weights"
                  value={editingItem.weights}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingItem.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}