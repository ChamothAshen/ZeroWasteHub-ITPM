import { useState } from "react";
import { FiUsers, FiBarChart2, FiSettings, FiEdit, FiTrash, FiMenu, FiX, FiClipboard, FiTruck, FiTrello } from "react-icons/fi";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [employees, setEmployees] = useState([
    { id: 1, name: "Sumathi", team: "Team10", shifts: "" },
    { id: 2, name: "Paala", team: "Team15", shifts: "" },
    { id: 3, name: "Daya", team: "Team10", shifts: "" },
  ]);
  const [teams, setTeams] = useState([
    { id: 1, leader: "Sarth", members: ["Sumathi", "Paala", "Daya"] },
    { id: 2, leader: "Ashoka", members: ["Raj", "Kavi", "Arun"] },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", team: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  const handleEditEmployee = (id) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    setEditingEmployee(employeeToEdit);
  };

  const handleSaveEditEmployee = () => {
    setEmployees(
      employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.team) {
      setEmployees([...employees, { id: employees.length + 1, ...newEmployee, shifts: "" }]);
      setNewEmployee({ name: "", team: "" });
    }
  };

  const handleEditTeam = (id) => {
    const teamToEdit = teams.find((team) => team.id === id);
    setEditingTeam(teamToEdit);
  };

  const handleSaveEditTeam = () => {
    setTeams(
      teams.map((team) => (team.id === editingTeam.id ? editingTeam : team))
    );
    setEditingTeam(null);
  };

  const handleDeleteTeam = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  const handleAddTeam = () => {
    // Implement team addition logic here
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Sidebar */}
      <aside className={`fixed md:relative md:w-64 bg-green-700 text-white p-6 min-h-screen transition-transform z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <button className="md:hidden text-white text-2xl" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 hover:text-gray-300" onClick={() => setActiveTab("employees")}>
                <FiUsers /> <span>Employees</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 hover:text-gray-300" onClick={() => setActiveTab("teams")}>
                <FiTrello /> <span>Teams</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
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

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button className="md:hidden text-green-600 text-2xl" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold capitalize">{activeTab}</h2>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === "employees" && (
            <>
              <div className="mb-4">
                <input type="text" placeholder="Employee Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="border p-2 rounded mr-2" />
                <input type="text" placeholder="Team" value={newEmployee.team} onChange={(e) => setNewEmployee({ ...newEmployee, team: e.target.value })} className="border p-2 rounded mr-2" />
                <button onClick={handleAddEmployee} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">#</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Team</th>
                      <th className="border p-2">Shifts</th>
                      <th className="border p-2">Edit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border">
                        <td className="border p-2 text-center">{employee.id}</td>
                        <td className="border p-2">
                          {editingEmployee?.id === employee.id ? (
                            <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} className="border p-1 rounded w-full" />
                          ) : (
                            employee.name
                          )}
                        </td>
                        <td className="border p-2">
                          {editingEmployee?.id === employee.id ? (
                            <input type="text" value={editingEmployee.team} onChange={(e) => setEditingEmployee({ ...editingEmployee, team: e.target.value })} className="border p-1 rounded w-full" />
                          ) : (
                            employee.team
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          <input type="datetime-local" className="border p-1 rounded-md w-full" />
                        </td>
                        <td className="border p-2 flex justify-center gap-2">
                          {editingEmployee?.id === employee.id ? (
                            <button className="text-green-500" onClick={handleSaveEditEmployee}>Save</button>
                          ) : (
                            <button className="text-blue-500" onClick={() => handleEditEmployee(employee.id)}><FiEdit /></button>
                          )}
                          <button className="text-red-500" onClick={() => handleDeleteEmployee(employee.id)}><FiTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "teams" && (
            <div>
              {teams.map((team) => (
                <div key={team.id} className="mb-4 p-4 border rounded-lg shadow-md flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Team {team.id}</h3>
                    <p>Leader: {editingTeam?.id === team.id ? (
                      <input type="text" value={editingTeam.leader} onChange={(e) => setEditingTeam({ ...editingTeam, leader: e.target.value })} className="border p-1 rounded w-full" />
                    ) : (
                      team.leader
                    )}</p>
                    <p>Members: {team.members.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    {editingTeam?.id === team.id ? (
                      <button className="text-green-500" onClick={handleSaveEditTeam}>Save</button>
                    ) : (
                      <button className="text-blue-500" onClick={() => handleEditTeam(team.id)}><FiEdit /></button>
                    )}
                    <button className="text-red-500" onClick={() => handleDeleteTeam(team.id)}><FiTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
