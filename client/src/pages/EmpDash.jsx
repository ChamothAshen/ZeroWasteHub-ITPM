import { useState } from "react";
import { FiEdit, FiTrash, FiMenu } from "react-icons/fi";
import Sidebar from "./EmpSidebar"; // Import the Sidebar component

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([
    { id: 1, name: "Sumathi", team: "Team10", shifts: "" },
    { id: 2, name: "Paala", team: "Team15", shifts: "" },
    { id: 3, name: "Daya", team: "Team10", shifts: "" },
  ]);
  const [newEmployee, setNewEmployee] = useState({ name: "", team: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);

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

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Import Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button className="md:hidden text-green-600 text-2xl" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold">Employees</h2>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Add Employee */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="Team"
              value={newEmployee.team}
              onChange={(e) => setNewEmployee({ ...newEmployee, team: e.target.value })}
              className="border p-2 rounded mr-2"
            />
            <button onClick={handleAddEmployee} className="bg-green-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>

          {/* Employee Table */}
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
                        <input
                          type="text"
                          value={editingEmployee.name}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        employee.name
                      )}
                    </td>
                    <td className="border p-2">
                      {editingEmployee?.id === employee.id ? (
                        <input
                          type="text"
                          value={editingEmployee.team}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, team: e.target.value })}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        employee.team
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      <input type="datetime-local" className="border p-1 rounded-md w-full" />
                    </td>
                    <td className="border p-2 flex justify-center gap-2">
                      {editingEmployee?.id === employee.id ? (
                        <button className="text-green-500" onClick={handleSaveEditEmployee}>
                          Save
                        </button>
                      ) : (
                        <button className="text-blue-500" onClick={() => handleEditEmployee(employee.id)}>
                          <FiEdit />
                        </button>
                      )}
                      <button className="text-red-500" onClick={() => handleDeleteEmployee(employee.id)}>
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
