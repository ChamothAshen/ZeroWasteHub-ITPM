import { useState } from "react";
import Sidebar from "./EmpSidebar"; // Import Sidebar component
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaUserTag, FaClipboard, FaPaperPlane } from "react-icons/fa";

export default function EmpPickups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickup, setPickup] = useState({
    dateTime: "",
    location: "",
    team: "",
    teamLeader: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pickup scheduled successfully!");
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex">
      {/* Import Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        <h2 className="text-2xl font-bold mb-4">Schedule a Pickup</h2>
        <div className="p-6 bg-white shadow-md rounded-lg max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Date & Time Picker */}
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

            {/* Location Address */}
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

            {/* Team Selection */}
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

            {/* Team Leader Mention */}
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

            {/* Instructions */}
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

            {/* Save & Send Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded flex items-center justify-center gap-2"
            >
              <FaPaperPlane /> Save & Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
