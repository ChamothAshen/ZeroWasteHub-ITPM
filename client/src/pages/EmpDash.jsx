import { useState } from "react";
import { FiEdit, FiTrash, FiMenu } from "react-icons/fi";
import Sidebar from "./EmpSidebar";

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([
    { id: 1, name: "Sumathi", age: 30, gender: "Female", address: "Street 10, City", phone: "9876543210" },
    { id: 2, name: "Paala", age: 40, gender: "Male", address: "Street 15, City", phone: "8765432109" },
    { id: 3, name: "Daya", age: 25, gender: "Other", address: "Street 20, City", phone: "7654321098" },
  ]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleEditEmployee = (id) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    setEditingEmployee({ ...employeeToEdit });
  };

  const handleSaveEditEmployee = () => {
    setEmployees(
      employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Sidebar */}
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
          {/* Employee Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Age</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border">
                    <td className="border p-2 text-center">{employee.id}</td>

                    {editingEmployee?.id === employee.id ? (
                      <>
                        <td className="border p-2">
                          <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} className="border p-1 rounded w-full" />
                        </td>
                        <td className="border p-2">
                          <input type="number" value={editingEmployee.age} onChange={(e) => setEditingEmployee({ ...editingEmployee, age: e.target.value })} className="border p-1 rounded w-full" />
                        </td>
                        <td className="border p-2">
                          <select value={editingEmployee.gender} onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value })} className="border p-1 rounded w-full">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="border p-2">
                          <input type="text" value={editingEmployee.address} onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })} className="border p-1 rounded w-full" />
                        </td>
                        <td className="border p-2">
                          <input type="text" value={editingEmployee.phone} onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })} className="border p-1 rounded w-full" />
                        </td>
                        <td className="border p-2">
                          <button className="text-green-500 font-semibold" onClick={handleSaveEditEmployee}>Save</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border p-2">{employee.name}</td>
                        <td className="border p-2">{employee.age}</td>
                        <td className="border p-2">{employee.gender}</td>
                        <td className="border p-2">{employee.address}</td>
                        <td className="border p-2">{employee.phone}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button className="text-blue-500" onClick={() => handleEditEmployee(employee.id)}>
                            <FiEdit />
                          </button>
                          <button className="text-red-500" onClick={() => setEmployeeToDelete(employee)}>
                            <FiTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete <span className="font-semibold">{employeeToDelete.name}</span>?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setEmployeeToDelete(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={() => {
                setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
                setEmployeeToDelete(null);
              }} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
