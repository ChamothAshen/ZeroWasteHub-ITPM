import { useState } from "react";
import { FiEdit, FiTrash, FiSave, FiX } from "react-icons/fi";
import Sidebar from "./EmpSidebar";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([
    { id: "T1001", name: "John Doe", shift: "2025-03-22T09:00" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ id: "", name: "", shift: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deletionError, setDeletionError] = useState("");

  const handleEdit = (id) => setEditingId(id);
  const handleSave = (id) => setEditingId(null);

  const confirmDelete = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
    setDeletionError("");
  };

  const executeDelete = (enteredId) => {
    if (enteredId === employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } else {
      setDeletionError("Entered ID does not match. Please type the employee ID to confirm deletion.");
    }
  };

  const handleAddEmployee = () => {
    if (!/^T\d+$/.test(newEmployee.id) || newEmployee.name.length > 20 || !newEmployee.shift) {
      alert("Invalid input: Ensure ID follows T[number], Name max 20 chars, and Shift is set.");
      return;
    }
    setEmployees([...employees, newEmployee]);
    setNewEmployee({ id: "", name: "", shift: "" });
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      <Sidebar />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              You are about to delete employee <strong>{employeeToDelete}</strong>.
              This action cannot be undone. To confirm, please enter the employee ID below:
            </p>
            <input
              type="text"
              placeholder="Enter employee ID"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-red-500"
              onChange={(e) => setEmployeeToDelete(e.target.value)}
            />
            {deletionError && <p className="text-red-500 text-sm mb-4">{deletionError}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDelete(employeeToDelete)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FiTrash size={18} />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full p-8">
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-green-700 mb-6">Employee Dashboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Shifts</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-200 hover:bg-green-100 transition">
                    <td className="px-6 py-4 font-semibold">{emp.id}</td>
                    <td className="px-6 py-4">
                      {editingId === emp.id ? (
                        <input className="border p-2 rounded w-full" defaultValue={emp.name} />
                      ) : (
                        emp.name
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === emp.id ? (
                        <input 
                          type="datetime-local" 
                          className="border p-2 rounded w-full" 
                          defaultValue={emp.shift} 
                        />
                      ) : (
                        new Date(emp.shift).toLocaleString()
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-center space-x-3">
                      {editingId === emp.id ? (
                        <button 
                          onClick={() => handleSave(emp.id)} 
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiSave size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEdit(emp.id)} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => confirmDelete(emp.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex space-x-3">
            <input
              placeholder="Emp ID (T1002)"
              className="border p-3 rounded w-1/4 focus:ring-2 focus:ring-green-500"
              value={newEmployee.id}
              onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
            />
            <input
              placeholder="Name (max 20 chars)"
              className="border p-3 rounded w-1/4 focus:ring-2 focus:ring-green-500"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <input
              type="datetime-local"
              className="border p-3 rounded w-1/4 focus:ring-2 focus:ring-green-500"
              value={newEmployee.shift}
              onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
            />
            <button 
              onClick={handleAddEmployee} 
              className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 flex items-center gap-2 transition-colors"
            >
              <FiSave size={18} />
              Add Employee
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}