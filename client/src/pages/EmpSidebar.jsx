import { FiUsers, FiTruck, FiFileText, FiX, FiSettings } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed md:relative w-64 bg-gradient-to-b from-green-700 to-green-800 text-white p-4 min-h-screen transition-all duration-300 ease-in-out z-50 ${
        sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b border-green-600">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-green-700 p-1 rounded-md">
            <FiTruck />
          </span>
          <span>Employee Dashboard</span>
        </h1>
        <button 
          className="md:hidden text-white hover:bg-green-600 p-1 rounded-md transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <a 
              href="EmployeeDashboard" 
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                location.pathname.includes('EmployeeDashboard') 
                  ? "bg-green-600 text-white shadow-md" 
                  : "hover:bg-green-600/50 text-green-100"
              }`}
            >
              <span className="text-lg"><FiUsers /></span>
              <span className="font-medium">Employees</span>
            </a>
          </li>
          <li>
            <a 
              href="EmpPickups" 
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                location.pathname.includes('EmpPickups') 
                  ? "bg-green-600 text-white shadow-md" 
                  : "hover:bg-green-600/50 text-green-100"
              }`}
            >
              <span className="text-lg"><FiTruck /></span>
              <span className="font-medium">Pickups</span>
            </a>
          </li>
          <li>
            <a 
              href="EmpLogs" 
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                location.pathname.includes('EmpLogs') 
                  ? "bg-green-600 text-white shadow-md" 
                  : "hover:bg-green-600/50 text-green-100"
              }`}
            >
              <span className="text-lg"><FiFileText /></span>
              <span className="font-medium">Logs</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-600">
        <a 
          href="Settings" 
          className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-green-600/50 text-green-100"
        >
          <span className="text-lg"><FiSettings /></span>
          <span className="font-medium">Settings</span>
        </a>
      </div>
    </aside>
  );
}