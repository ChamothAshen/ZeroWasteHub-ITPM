import { useState } from "react";
import Sidebar from "./EmpSidebar";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaUserTag,
  FaClipboard,
  FaPaperPlane,
} from "react-icons/fa";

export default function EmpPickups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickup, setPickup] = useState({
    dateTime: "",
    location: "",
    team: "",
    teamLeader: "",
    instructions: "",
  });

  const [submittedPickups, setSubmittedPickups] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5173/api/pickups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pickup),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pickup scheduled successfully!");
        setSubmittedPickups((prev) => [...prev, pickup]);
        setPickup({
          dateTime: "",
          location: "",
          team: "",
          teamLeader: "",
          instructions: "",
        });
      } else {
        alert("Failed to schedule pickup: " + data.message);
      }
    } catch (error) {
      alert("Error connecting to server.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6 transition-all grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Schedule a Pickup</h2>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  <FaCalendarAlt className="inline mr-2" /> Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={pickup.dateTime}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <FaMapMarkerAlt className="inline mr-2" /> Location Address
                </label>
                <input
                  type="text"
                  name="location"
                  value={pickup.location}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <FaUsers className="inline mr-2" /> Select Team
                </label>
                <select
                  name="team"
                  value={pickup.team}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Choose a team</option>
                  <option value="Team10">Team10</option>
                  <option value="Team15">Team15</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <FaUserTag className="inline mr-2" /> Team Leader
                </label>
                <input
                  type="text"
                  name="teamLeader"
                  value={pickup.teamLeader}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="@TeamLeader"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <FaClipboard className="inline mr-2" /> Instructions
                </label>
                <textarea
                  name="instructions"
                  value={pickup.instructions}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                  placeholder="Additional instructions"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                <FaPaperPlane /> {loading ? "Sending..." : "Save & Send"}
              </button>
            </form>
          </div>
        </div>

        {/* Submitted Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Scheduled Pickups</h2>
          {submittedPickups.length === 0 ? (
            <p className="text-gray-600">No pickups scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {submittedPickups.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <p><strong>Date/Time:</strong> {item.dateTime}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Team:</strong> {item.team}</p>
                  <p><strong>Leader:</strong> {item.teamLeader}</p>
                  <p><strong>Instructions:</strong> {item.instructions}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
