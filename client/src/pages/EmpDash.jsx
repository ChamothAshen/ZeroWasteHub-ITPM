import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiMenu, FiPlus } from "react-icons/fi";
import Sidebar from "./EmpSidebar";

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    phone: "",
  });

  // Fetch Employees from Backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5173/api/employee");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Validation function
  const validateFields = (employee) => {
    const newErrors = { name: "", age: "", phone: "" };
    const namePattern = /^[A-Za-z]+ [A-Za-z]+$/; // Ensures "First Last" format

    if (!namePattern.test(employee.name)) {
      newErrors.name = "Name should be in 'First Last' format.";
    }

    if (employee.age < 18 || employee.age > 60) {
      newErrors.age = "Age should be between 18 and 60.";
    }

    const phonePattern = /^[0-9]{10}$/; // Validates 10-digit phone number
    if (!phonePattern.test(employee.phone)) {
      newErrors.phone = "Phone number should be a valid 10-digit number.";
    }

    setErrors(newErrors);

    // If no errors, return true, otherwise false
    return !Object.values(newErrors).some((error) => error);
  };

  // Add New Employee
  const handleAddNewEmployee = () => {
    setNewEmployee({ name: "", age: "", gender: "Male", address: "", phone: "" });
  };

  const handleSaveNewEmployee = async () => {
    if (!validateFields(newEmployee)) return;

    try {
      const response = await fetch("http://localhost:5173/api/employee/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        fetchEmployees();
        setNewEmployee(null);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Edit Employee
  const handleEditEmployee = (id) => {
    const employeeToEdit = employees.find((emp) => emp._id === id);
    setEditingEmployee({ ...employeeToEdit });
  };

  const handleSaveEditEmployee = async () => {
    if (!validateFields(editingEmployee)) return;

    try {
      const response = await fetch(`http://localhost:5173/api/employee/${editingEmployee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEmployee),
      });

      if (response.ok) {
        fetchEmployees();
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:5173/api/employee/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button className="md:hidden text-green-600 text-2xl" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2 className="text-3xl font-semibold">Employees</h2>
          <button onClick={handleAddNewEmployee} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <FiPlus /> Add New Employee
          </button>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
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
                {employees.map((employee, index) => (
                  <tr key={employee._id} className="border">
                    <td className="border p-2 text-center">{index + 1}</td>

                    {editingEmployee?._id === employee._id ? (
                      <>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={editingEmployee.name}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                            className="border p-1 rounded w-full"
                          />
                          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={editingEmployee.age}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, age: e.target.value })}
                            className="border p-1 rounded w-full"
                          />
                          {errors.age && <div className="text-red-500 text-sm">{errors.age}</div>}
                        </td>
                        <td className="border p-2">
                          <select
                            value={editingEmployee.gender}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value })}
                            className="border p-1 rounded w-full"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={editingEmployee.address}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={editingEmployee.phone}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                            className="border p-1 rounded w-full"
                          />
                          {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                        </td>
                        <td className="border p-2">
                          <button className="text-green-500 font-semibold" onClick={handleSaveEditEmployee}>
                            Save
                          </button>
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
                          <button className="text-blue-500" onClick={() => handleEditEmployee(employee._id)}>
                            <FiEdit />
                          </button>
                          <button className="text-red-500" onClick={() => handleDeleteEmployee(employee._id)}>
                            <FiTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {newEmployee && (
                  <tr className="border bg-gray-100">
                    <td className="border p-2 text-center">New</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                      {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={newEmployee.age}
                        onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                      {errors.age && <div className="text-red-500 text-sm">{errors.age}</div>}
                    </td>
                    <td className="border p-2">
                      <select
                        value={newEmployee.gender}
                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
                        className="border p-1 rounded w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={newEmployee.address}
                        onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                      {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                    </td>
                    <td className="border p-2">
                      <button className="text-green-500 font-semibold" onClick={handleSaveNewEmployee}>
                        Save
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
