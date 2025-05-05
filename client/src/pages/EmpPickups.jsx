import { useState, useEffect } from "react";
import Sidebar from "./EmpSidebar";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaUserTag,
  FaClipboard,
  FaPaperPlane,
  FaClock
} from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function EmpPickups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickup, setPickup] = useState({
    dateTime: "",
    date: "",
    time: "",
    location: "",
    team: "",
    teamLeader: "",
    instructions: "",
  });

  const [submittedPickups, setSubmittedPickups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle date and time combination
  useEffect(() => {
    if (pickup.date && pickup.time) {
      // Combine date and time into a single ISO string
      const dateTimeString = `${pickup.date}T${pickup.time}:00`;
      setPickup(prev => ({ ...prev, dateTime: dateTimeString }));
    }
  }, [pickup.date, pickup.time]);

  // ✅ Fetch existing pickups on component mount
  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await fetch("http://localhost:5173/api/pickups");
        const data = await res.json();
        if (res.ok) {
          setSubmittedPickups(data);
        } else {
          console.error("Failed to fetch pickups:", data.message);
        }
      } catch (err) {
        console.error("Error fetching pickups:", err);
      }
    };

    fetchPickups();
  }, []);

  const handleChange = (e) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for date and time
    if (!pickup.date || !pickup.time) {
      confirmAlert({
        title: "Missing Information",
        message: "Please select both date and time",
        buttons: [{ label: "OK" }]
      });
      return;
    }

    confirmAlert({
      // ...existing code...
      title: "Confirm Submission",
      message: "Are you sure you want to save this pickup?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
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
                confirmAlert({
                  title: "Success",
                  message: "Pickup scheduled successfully!",
                  buttons: [
                    {
                      label: "OK",
                    },
                  ],
                });
                setSubmittedPickups((prev) => [...prev, data]);
                setPickup({
                  dateTime: "",
                  date: "",
                  time: "",
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
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not specified";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateTimeString;
    }
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
              {/* Separate date and time inputs for better control */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    <FaCalendarAlt className="inline mr-2" /> Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={pickup.date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    <FaClock className="inline mr-2" /> Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      value={pickup.time}
                      onChange={handleChange}
                      className="w-full border p-2 rounded appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                      step="900" // 15-minute intervals
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FaClock className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Click to open time selector</p>
                </div>
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

              {/* ...existing code... */}
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

        {/* Scheduled Pickups */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Scheduled Pickups</h2>
          {submittedPickups.length === 0 ? (
            <p className="text-gray-600">No pickups scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {submittedPickups.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
                >
                  <p className="font-medium text-green-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" /> 
                    {formatDateTime(item.dateTime)}
                  </p>
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