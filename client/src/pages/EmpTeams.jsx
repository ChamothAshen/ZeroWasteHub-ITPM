import { useState } from "react";
import { FaTrash, FaPlus, FaEdit, FaSave } from "react-icons/fa";
import Sidebar from "./EmpSidebar";

const EmpTeams = () => {
  const [teams, setTeams] = useState([
    { id: 101, leader: "Alice", members: ["John", "Sara", "Bob", "Eve", "Tom"] },
    { id: 102, leader: "Michael", members: ["Jake", "Lily", "Emma", "Noah", "Sophia"] },
  ]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const updateLeader = (teamId, newLeader) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, leader: newLeader } : team
    ));
  };

  const updateMember = (teamId, memberIndex, newName) => {
    setTeams(teams.map(team =>
      team.id === teamId ? {
        ...team,
        members: team.members.map((m, i) => i === memberIndex ? newName : m)
      } : team
    ));
  };

  const addTeam = () => {
    setTeams([...teams, { id: Date.now(), leader: "", members: [] }]);
  };

  const addMember = (teamId) => {
    setTeams(teams.map(team =>
      team.id === teamId && team.members.length < 5
        ? { ...team, members: [...team.members, `Member ${team.members.length + 1}`] }
        : team
    ));
  };

  const confirmDelete = (teamId) => {
    setTeamToDelete(teamId);
    setShowDeleteDialog(true);
  };

  const executeDelete = () => {
    setTeams(teams.filter(team => team.id !== teamToDelete));
    setShowDeleteDialog(false);
    setTeamToDelete(null);
  };

  const toggleEdit = (teamId) => {
    setEditingTeamId(editingTeamId === teamId ? null : teamId);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="w-64 bg-white shadow-xl" />

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Team</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this team? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">Team Management</h1>
            <button
              onClick={addTeam}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus className="text-sm md:text-base" />
              <span className="text-sm md:text-base">Add New Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map(team => (
              <div key={team.id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-700">Team #{team.id}</h3>
                    <button
                      onClick={() => toggleEdit(team.id)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      {editingTeamId === team.id ? (
                        <FaSave className="text-lg" />
                      ) : (
                        <FaEdit className="text-lg" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => confirmDelete(team.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Leader</label>
                    <input
                      type="text"
                      value={team.leader}
                      onChange={(e) => updateLeader(team.id, e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      readOnly={editingTeamId !== team.id}
                      style={{
                        backgroundColor: editingTeamId === team.id ? '#fff' : '#f3f4f6',
                        cursor: editingTeamId === team.id ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Members</label>
                    <div className="space-y-2">
                      {team.members.map((member, index) => (
                        <input
                          key={index}
                          type="text"
                          value={member}
                          onChange={(e) => updateMember(team.id, index, e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          readOnly={editingTeamId !== team.id}
                          style={{
                            backgroundColor: editingTeamId === team.id ? '#fff' : '#f3f4f6',
                            cursor: editingTeamId === team.id ? 'text' : 'not-allowed'
                          }}
                          placeholder={`Member ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {editingTeamId === team.id && team.members.length < 5 && (
                    <button
                      onClick={() => addMember(team.id)}
                      className="w-full mt-3 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlus className="text-sm" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpTeams;
