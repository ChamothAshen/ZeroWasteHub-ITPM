import {
  FiUsers,
  FiTruck,
  FiFileText,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed md:relative md:w-64 bg-green-700 text-white p-6 min-h-screen transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">Employee Dashboard</h1>
        <button
          aria-label="Close sidebar"
          className="md:hidden text-white text-2xl hover:text-gray-300"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX />
        </button>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-5">
          <NavItem icon={<FiUsers />} label="Employees" href="EmployeeDashboard" />
          <NavItem icon={<FiTruck />} label="Pickups" href="EmpPickups" />
          <NavItem icon={<FiFileText />} label="Logs" href="EmpLogs" />
        </ul>
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, href }) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-600 hover:text-white"
      >
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </a>
    </li>
  );
}
