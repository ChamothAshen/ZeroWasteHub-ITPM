import ProfileSidebar from '../components/ProfileSidebar';
import { useSelector } from 'react-redux';
import { FaRecycle, FaLeaf, FaTrash, FaTruck, FaUsers, FaUserCog, FaCalendarCheck, FaChartLine, FaExclamationTriangle, FaBell, FaClipboardCheck, FaDatabase, FaFileAlt, FaCog } from 'react-icons/fa';

function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Sample data for the admin dashboard - replace with actual data from your backend
  const systemStats = {
    totalUsers: 458,
    activeUsers: 327,
    pendingRequests: 18,
    totalWasteCollected: "24,780kg",
    recyclingRate: "68%"
  };

  // Sample system alerts
  const systemAlerts = [
    { id: 1, type: "warning", message: "High volume of pickup requests in East Zone", time: "2 hours ago" },
    { id: 2, type: "error", message: "System sync failed with collection vehicles #12, #15", time: "Yesterday" },
    { id: 3, type: "success", message: "Monthly recycling target achieved", time: "3 days ago" }
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, user: "John Doe", action: "Submitted new bin request", date: "10 mins ago", status: "pending" },
    { id: 2, user: "Sarah Kim", action: "Updated pickup schedule", date: "1 hour ago", status: "completed" },
    { id: 3, user: "Mike Johnson", action: "Canceled waste collection", date: "3 hours ago", status: "canceled" }
  ];

  // Sample regional data
  const regionalData = [
    { region: "North", collectionRate: 92, recyclingRate: 71, users: 112 },
    { region: "South", collectionRate: 88, recyclingRate: 64, users: 145 },
    { region: "East", collectionRate: 76, recyclingRate: 58, users: 98 },
    { region: "West", collectionRate: 94, recyclingRate: 75, users: 103 }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ProfileSidebar currentUser={currentUser} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-green-100">System overview and management</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                <FaBell className="text-white" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                <FaCog className="text-white" />
              </button>
            </div>
          </div>
          
          {/* System Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-green-100">Total Users</p>
              <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-green-100">Active Users</p>
              <p className="text-2xl font-bold">{systemStats.activeUsers}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-green-100">Pending Requests</p>
              <p className="text-2xl font-bold">{systemStats.pendingRequests}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-green-100">Total Waste Collected</p>
              <p className="text-2xl font-bold">{systemStats.totalWasteCollected}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-green-100">Recycling Rate</p>
              <p className="text-2xl font-bold">{systemStats.recyclingRate}</p>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main metrics and reports - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert and Actions Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">System Alerts</h2>
                <button className="text-sm text-green-600 hover:text-green-800">View All</button>
              </div>
              <div className="space-y-3">
                {systemAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`flex items-center p-3 rounded-lg ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                      alert.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                      'bg-green-50 border-l-4 border-green-500'
                    }`}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      alert.type === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {alert.type === 'warning' && <FaExclamationTriangle />}
                      {alert.type === 'error' && <FaExclamationTriangle />}
                      {alert.type === 'success' && <FaChartLine />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800 font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaFileAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Regional Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Regional Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recycling Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {regionalData.map((region, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{region.collectionRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${region.collectionRate}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{region.recyclingRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${region.recyclingRate}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Waste Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Waste Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-100 text-blue-600 rounded-full mb-3">
                    <FaRecycle className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Plastic</h3>
                  <p className="text-2xl font-bold text-gray-700">34%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-green-100 text-green-600 rounded-full mb-3">
                    <FaLeaf className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Paper</h3>
                  <p className="text-2xl font-bold text-gray-700">28%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-amber-100 text-amber-600 rounded-full mb-3">
                    <FaTrash className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Glass</h3>
                  <p className="text-2xl font-bold text-gray-700">18%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-red-100 text-red-600 rounded-full mb-3">
                    <FaTrash className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Metal</h3>
                  <p className="text-2xl font-bold text-gray-700">20%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar content - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* User Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">User Management</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">New Users</span>
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                  <p className="text-xl font-bold">24</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Retention</span>
                    <span className="text-xs text-green-600">+5%</span>
                  </div>
                  <p className="text-xl font-bold">87%</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-3 rounded-lg text-left transition duration-300">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded mr-3">
                      <FaUsers className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Manage Users</span>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">458</span>
                </button>
                <button className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-3 rounded-lg text-left transition duration-300">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded mr-3">
                      <FaUserCog className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">User Permissions</span>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">6</span>
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-sm text-green-600 hover:text-green-800">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center text-green-600 font-semibold">
                      {activity.user.split(' ').map(name => name[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.user} <span className="font-normal">{activity.action}</span></p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{activity.date}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Administrative Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition duration-300">
                  <FaClipboardCheck className="text-green-600 text-xl mx-auto" />
                  <span className="block mt-2 text-sm text-gray-700">Approve Requests</span>
                </button>
                <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition duration-300">
                  <FaTruck className="text-green-600 text-xl mx-auto" />
                  <span className="block mt-2 text-sm text-gray-700">Manage Fleet</span>
                </button>
                <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition duration-300">
                  <FaDatabase className="text-green-600 text-xl mx-auto" />
                  <span className="block mt-2 text-sm text-gray-700">System Backup</span>
                </button>
                <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition duration-300">
                  <FaFileAlt className="text-green-600 text-xl mx-auto" />
                  <span className="block mt-2 text-sm text-gray-700">Generate Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;