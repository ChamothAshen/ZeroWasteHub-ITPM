import React from "react";
import { FiUsers, FiTrello, FiClipboard, FiTruck, FiX } from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`fixed md:relative md:w-64 bg-green-700 text-white p-6 min-h-screen transition-transform z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button className="md:hidden text-white text-2xl" onClick={() => setSidebarOpen(false)}>
          <FiX />
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-4">
            <a href="/inveDash" className="flex items-center space-x-2 hover:text-gray-300">
              <FiUsers /> <span>Inventory</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="/bin" className="flex items-center space-x-2 hover:text-gray-300">
              <FiTrello /> <span>Bin Counts</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="/inventory" className="flex items-center space-x-2 hover:text-gray-300">
              <FiClipboard /> <span>Logs</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FiTruck /> <span>Pick Ups</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;