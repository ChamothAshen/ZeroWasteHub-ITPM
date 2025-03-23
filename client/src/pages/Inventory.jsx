import React, { useState } from "react";
import { FiMenu, FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableData, setTableData] = useState([
    { id: 1, company: "Company A", category: "Category 1", weights: "100kg", Quantity: "10", BinSize: "large", date: "2023-10-01" },
    { id: 2, company: "Company B", category: "Category 2", Quantity: "10", BinSize: "large", weights: "200kg", date: "2023-10-02" },
    { id: 3, company: "Company C", category: "Category 3", Quantity: "10", BinSize: "large", weights: "150kg", date: "2023-10-03" },
    {id: 4, company: "Company C", category: "Category 3", Quantity: "10", BinSize: "large", weights: "150kg", date: "2023-10-03" },
    {id: 5, company: "Company C", category: "Category 3", Quantity: "10", BinSize: "large", weights: "150kg", date: "2023-10-03" },
  ]);
  const [formData, setFormData] = useState({ company: "", category: "", weights: "", Quantity: "", BinSize: "", date: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTableData([...tableData, { id: tableData.length + 1, ...formData }]);
    setFormData({ company: "", category: "", weights: "", Quantity: "", BinSize: "", date: "" });
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button className="md:hidden text-green-600 text-2xl" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold capitalize">{activeTab}</h2>
        </header>
        
        {/* Form for adding new inventory item */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Add Garbage Details Per day</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="p-2 border rounded" required />
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" required />
            <input type="text" name="weights" value={formData.weights} onChange={handleChange} placeholder="Weights" className="p-2 border rounded" required />
            <input type="number" name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded" required />
            <input type="text" name="BinSize" value={formData.BinSize} onChange={handleChange} placeholder="Bin Size" className="p-2 border rounded" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" required />
            <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">Add Item</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Company</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Weights</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Quantity</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase">Bin Size</th>
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
                    <td className="py-3 px-4 text-sm text-gray-700">{item.Quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.BinSize}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button className="text-green-600 hover:text-green-800">
                        <FiEdit />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <button className="text-red-600 hover:text-red-800">
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
