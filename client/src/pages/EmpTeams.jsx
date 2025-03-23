import { useState } from "react";
import Sidebar from "./EmpSidebar"; // Import Sidebar component
import { FiEdit, FiTrash, FiPlus, FiCheck, FiX } from "react-icons/fi";

export default function EmpTeams() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teams, setTeams] = useState([
    { id: 1, leader: "Sarth", members: ["Sumathi", "Paala", "Daya"] },
    { id: 2, leader: "Ashoka", members: ["Raj", "Kavi", "Arun"] },
  ]);

  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({ leader: "", members: [""] });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Handle edit
  const handleEditTeam = (id) => {
    const teamToEdit = teams.find((team) => team.id === id);
    setEditingTeam({ ...teamToEdit }); // Create a copy for editing
  };

  const handleSaveEditTeam = () => {
    setTeams(teams.map((team) => (team.id === editingTeam.id ? editingTeam : team)));
    setEditingTeam(null);
  };

  // Handle delete with confirmation
  const handleDeleteTeam = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
    setShowDeleteConfirm(null);
  };

  // Handle adding new teams
  const handleAddTeam = () => {
    if (newTeam.leader && newTeam.members[0]) {
      setTeams([...teams, { id: teams.length + 1, ...newTeam }]);
      setNewTeam({ leader: "", members: [""] });
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Import Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        <h2 className="text-2xl font-bold mb-4">Manage Teams</h2>

        {/* Add New Team */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Add New Team</h3>
          <input
            type="text"
            placeholder="Team Leader"
            value={newTeam.leader}
            onChange={(e) => setNewTeam({ ...newTeam, leader: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <h4 className="font-semibold">Team Members (max 5):</h4>
          {newTeam.members.map((member, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Member ${index + 1}`}
              value={member}
              onChange={(e) => {
                const updatedMembers = [...newTeam.members];
                updatedMembers[index] = e.target.value;
                setNewTeam({ ...newTeam, members: updatedMembers });
              }}
              className="border p-2 rounded w-full my-1"
            />
          ))}
          {newTeam.members.length < 5 && (
            <button
              onClick={() => setNewTeam({ ...newTeam, members: [...newTeam.members, ""] })}
              className="text-green-500 flex items-center mt-2"
            >
              <FiPlus className="mr-1" /> Add Member
            </button>
          )}
          <button onClick={handleAddTeam} className="bg-green-600 text-white px-4 py-2 rounded mt-3">
            Add Team
          </button>
        </div>

        {/* Teams List */}
        {teams.map((team) => (
          <div key={team.id} className="mb-4 p-4 border rounded-lg shadow-md flex justify-between items-center bg-white">
            {editingTeam?.id === team.id ? (
              <div className="space-y-2 w-full">
                <h3 className="text-xl font-semibold">Editing Team {team.id}</h3>
                <input
                  type="text"
                  value={editingTeam.leader}
                  onChange={(e) => setEditingTeam({ ...editingTeam, leader: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <h4 className="font-semibold">Edit Members:</h4>
                {editingTeam.members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    value={member}
                    onChange={(e) => {
                      const updatedMembers = [...editingTeam.members];
                      updatedMembers[index] = e.target.value;
                      setEditingTeam({ ...editingTeam, members: updatedMembers });
                    }}
                    className="border p-2 rounded w-full my-1"
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button className="text-green-500" onClick={handleSaveEditTeam}>
                    <FiCheck /> Save
                  </button>
                  <button className="text-gray-500" onClick={() => setEditingTeam(null)}>
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Team {team.id}</h3>
                  <p><span className="font-semibold">Leader:</span> {team.leader}</p>
                  <p><span className="font-semibold">Members:</span> {team.members.join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-500" onClick={() => handleEditTeam(team.id)}>
                    <FiEdit />
                  </button>
                  <button className="text-red-500" onClick={() => handleDeleteTeam(team.id)}>
                    <FiTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Are you sure?</h3>
              <p className="mb-4">This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => confirmDelete(showDeleteConfirm)}>
                  Yes, Delete
                </button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowDeleteConfirm(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
