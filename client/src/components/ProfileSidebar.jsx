import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHistory, FaCog, FaBell, FaAddressCard, FaTrash, FaBullseye } from 'react-icons/fa';

const ProfileSidebar = ({ currentUser }) => {
  const location = useLocation();

  // Define sidebar menu items
  const menuItems = [
    {
      name: 'Profile',
      icon: <FaUser className="text-lg" />,
      path: '/profileui'
    },
    {
      name: 'Smart Bin Request Form',
      icon: <FaTrash className="text-lg" />,
      path: '/pages/RequestSmartBinForm'
    },

    {
      name: 'Collect Request Form',
      icon: <FaTrash className="text-lg" />,
      path: '/pages/CollectRequestForm'
    },
    {
      name: 'History',
      icon: <FaBell className="text-lg" />,
      path: '/pages/ProfileData/UserDetailShow'
    },
    // Show "Smart Bin History" only if the currentUser is not an admin
    {
      name: 'Smart Bin History',
      icon: <FaBell className="text-lg" />,
      path: '/pages/profileData/UserSmartBinDetailShow'
    },
    // Show "Wastebot" only if the currentUser is an admin
    currentUser?.isAdmin && {
      name: 'Wastebot',
      icon: <FaTrash className="text-lg" />,
      path: '/wastebot'
    },
    currentUser?.isAdmin && {
      name: 'Employee Management Dashboard',
      icon: <FaTrash className="text-lg" />,
      path: '/EmployeeDashboard'
    },

    currentUser?.isAdmin && {
      name: 'Inventory Management Dashboard',
      icon: <FaTrash className="text-lg" />,
      path: '/inveDash'
    },
    // Add the shootable (target) icon here
  ].filter(Boolean); // Filter out any null values if currentUser.isAdmin is false

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-white text-green-800 shadow-lg">
      {/* Header with profile summary */}
      <div className="p-6 border-b border-green-100">
        <h2 className="text-xl font-semibold text-green-600">DashProfile</h2>
        <div className="mt-6 flex items-center">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-green-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ""; // Clear the src
                e.target.classList.add("hidden");
                e.target.nextSibling.classList.remove("hidden");
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
          )}
          <div className="ml-3">
            <p className="font-medium text-green-600">
              {currentUser?.username || "User"}
            </p>
            <p className="text-xs text-green-400">
              {currentUser?.isAdmin ? "Admin" : "Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 hover:bg-green-50 transition duration-200 ${isActive(item.path) ? "bg-green-100 border-l-4 border-green-600" : ""
                  }`}
              >
                <span className={`mr-3 ${isActive(item.path) ? "text-green-600" : "text-green-500"}`}>
                  {item.icon}
                </span>
                <span className={isActive(item.path) ? "text-green-700 font-medium" : "text-green-600"}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
