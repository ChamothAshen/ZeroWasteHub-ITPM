import ProfileSidebar from '../components/ProfileSidebar';
import { useSelector } from 'react-redux';
import { FaTrash, FaRecycle, FaChartBar, FaTruck, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);

  const stats = [
    { label: "Total Waste Collected", value: "24,780kg", icon: <FaRecycle className="text-green-600 text-3xl" /> },
    { label: "Recycling Points", value: 240, icon: <FaChartBar className="text-blue-600 text-3xl" /> },
    { label: "Pending Requests", value: 18, icon: <FaClipboardList className="text-yellow-600 text-3xl" /> },
    { label: "Next Pickup", value: "June 15, 2023", icon: <FaTruck className="text-purple-600 text-3xl" /> },
  ];

  const quickLinks = [
    { label: "Manage Waste", path: "/waste-management", icon: <FaTrash className="text-red-600 text-2xl" /> },
    { label: "Recycling Details", path: "/recycling-details", icon: <FaRecycle className="text-green-600 text-2xl" /> },
    { label: "Pickup Schedule", path: "/pickup-schedule", icon: <FaTruck className="text-blue-600 text-2xl" /> },
    { label: "Request Logs", path: "/request-logs", icon: <FaClipboardList className="text-yellow-600 text-2xl" /> },
  ];

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ProfileSidebar currentUser={currentUser} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-extrabold">
            Welcome, {currentUser?.username || "User"}!
          </h1>
          <p className="text-green-200 text-lg mt-2">Waste Management Dashboard</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-6 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <div className="p-4 bg-gray-100 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                {link.icon}
                <span className="mt-3 text-sm font-medium text-gray-700">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard Insights</h2>
          <p className="text-gray-600">
            Stay updated with the latest insights and trends in waste management. Explore detailed reports and analytics to optimize your operations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;