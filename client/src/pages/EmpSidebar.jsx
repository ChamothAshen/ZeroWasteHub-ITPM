import { FiUsers, FiLayers, FiTruck, FiClipboard } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-600 text-white min-h-screen p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/EmployeeDashboard" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition">
              <FiUsers size={18} />
              <span>Employees</span>
            </Link>
          </li>
          <li>
            <Link to="/EmpTeams" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition">
              <FiLayers size={18} />
              <span>Teams</span>
            </Link>
          </li>
          <li>
            <Link to="/pickups" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition">
              <FiTruck size={18} />
              <span>Pickups</span>
            </Link>
          </li>
          <li>
            <Link to="/EmpLogs" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded transition">
              <FiClipboard size={18} />
              <span>Logs</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
