
import { FiUsers, FiTruck, FiClock, FiFileText, FiMenu, FiX } from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed md:relative md:w-64 bg-green-700 text-white p-6 min-h-screen transition-transform z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <button className="md:hidden text-white text-2xl" onClick={() => setSidebarOpen(false)}>
          <FiX />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FiUsers /> <span>Employees</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FiTruck /> <span>Pickups</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FiClock /> <span>Teams</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FiFileText /> <span>Logs</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
