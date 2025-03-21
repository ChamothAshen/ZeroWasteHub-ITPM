import { useState } from "react";

export default function Logs({ teams, employees, logs, setLogs }) {
  const [newLog, setNewLog] = useState({
    teamId: "",
    employeeName: "",
    location: "",
    wasteType: "",
    amounts: {},
    date: ""
  });

  const wasteTypes = ["Plastic", "Paper", "Food", "General Waste"];

  const handleAddWasteType = () => {
    if (newLog.wasteType && !newLog.amounts[newLog.wasteType]) {
      setNewLog({
        ...newLog,
        amounts: { 
          ...newLog.amounts, 
          [newLog.wasteType]: 0 
        }
      });
    }
  };

  const handleAmountChange = (type, value) => {
    setNewLog({
      ...newLog,
      amounts: { 
        ...newLog.amounts, 
        [type]: Math.max(0, parseInt(value) || 0) 
      }
    });
  };

  const handleSubmitLog = () => {
    if (
      newLog.teamId &&
      newLog.employeeName &&
      newLog.location &&
      Object.keys(newLog.amounts).length > 0
    ) {
      const logEntry = {
        ...newLog,
        date: new Date().toISOString(),
        status: "Pending Approval",
        id: Date.now() // Better ID generation using timestamp
      };
      
      setLogs([logEntry, ...logs]); // Add new log to top of list
      setNewLog({
        teamId: "",
        employeeName: "",
        location: "",
        wasteType: "",
        amounts: {},
        date: ""
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">New Waste Collection Log</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={newLog.teamId}
            onChange={(e) => setNewLog({...newLog, teamId: e.target.value})}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>Team {team.id}</option>
            ))}
          </select>

          <select
            value={newLog.employeeName}
            onChange={(e) => setNewLog({...newLog, employeeName: e.target.value})}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Location"
            value={newLog.location}
            onChange={(e) => setNewLog({...newLog, location: e.target.value})}
            className="border p-2 rounded"
            required
          />

          <div className="flex gap-2">
            <select
              value={newLog.wasteType}
              onChange={(e) => setNewLog({...newLog, wasteType: e.target.value})}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Waste Type</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={handleAddWasteType}
              className="bg-green-600 text-white px-4 py-2 rounded"
              type="button"
            >
              Add Type
            </button>
          </div>
        </div>

        {Object.keys(newLog.amounts).length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Enter Amounts (kg)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(newLog.amounts).map(([type, amount]) => (
                <div key={type} className="flex items-center gap-2">
                  <label className="flex-1">{type}:</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(type, e.target.value)}
                    className="border p-1 rounded w-20"
                    min="0"
                  />
                  <span>kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitLog}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          disabled={!newLog.teamId || !newLog.employeeName || !newLog.location}
        >
          Submit Log
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Submission History</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Date</th>
                <th className="p-3 text-left text-sm font-semibold">Team</th>
                <th className="p-3 text-left text-sm font-semibold">Employee</th>
                <th className="p-3 text-left text-sm font-semibold">Location</th>
                <th className="p-3 text-left text-sm font-semibold">Waste Collected</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="p-3">Team {log.teamId}</td>
                  <td className="p-3">{log.employeeName}</td>
                  <td className="p-3">{log.location}</td>
                  <td className="p-3">
                    <div className="space-y-1">
                      {Object.entries(log.amounts).map(([type, amount]) => (
                        <div key={type} className="flex justify-between">
                          <span>{type}:</span>
                          <span>{amount} kg</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm 
                      ${log.status === 'Pending Approval' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}