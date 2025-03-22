import { useState } from "react";
import { FiUsers, FiLayers, FiTruck, FiClipboard, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-green-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>

        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/EmployeeDashboard"
                className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition"
              >
                <FiUsers size={18} />
                <span>Employees</span>
              </Link>
            </li>
            <li>
              <Link
                to="/EmpTeams"
                className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition"
              >
                <FiLayers size={18} />
                <span>Teams</span>
              </Link>
            </li>
            <li>
              <Link
                to="/EmpPickups"
                className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition"
              >
                <FiTruck size={18} />
                <span>Pickups</span>
              </Link>
            </li>
            <li>
              <Link
                to="/EmpLogs"
                className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition"
              >
                <FiClipboard size={18} />
                <span>Logs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}