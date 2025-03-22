import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiCalendar, FiUsers, FiSend } from "react-icons/fi"; 
import Sidebar from "./EmpSidebar";

const PickupScheduler = () => {
  const [formData, setFormData] = useState({
    location: "",
    datetime: "",
    team: "",
    details: "",
  });

  const [notifications, setNotifications] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [teamLeaders] = useState(["@john.doe", "@jane.smith", "@mike.ross"]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "details") setShowMentionList(value.includes("@"));
  };

  const handleMentionSelect = (leader) => {
    setFormData((prev) => ({ ...prev, details: `${prev.details}${leader} ` }));
    setShowMentionList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotification = {
      id: uuidv4(),
      message: `New pickup scheduled at ${formData.location}`,
      timestamp: new Date().toLocaleString(),
      team: formData.team,
      details: formData.details,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setFormData({ location: "", datetime: "", team: "", details: "" });
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="pickup-container">
          {/* Left: Form Section */}
          <div className="form-section">
            <h2>Schedule Pickup</h2>
            <form onSubmit={handleSubmit}>
              {/* Location */}
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter pickup location"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="form-group">
                <label>Date & Time</label>
                <div className="input-icon">
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleInputChange}
                    required
                  />
                  <FiCalendar className="icon" />
                </div>
              </div>

              {/* Assign Team */}
              <div className="form-group">
                <label>Assign Team</label>
                <div className="input-icon">
                  <select name="team" value={formData.team} onChange={handleInputChange} required>
                    <option value="">Select Team</option>
                    <option>Alpha Team</option>
                    <option>Bravo Team</option>
                    <option>Charlie Team</option>
                  </select>
                  <FiUsers className="icon" />
                </div>
              </div>

              {/* Details & Instructions */}
              <div className="form-group">
                <label>Details & Instructions</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Mention team leaders using @"
                />
                {showMentionList && (
                  <div className="mention-list">
                    {teamLeaders.map((leader) => (
                      <div key={leader} className="mention-item" onClick={() => handleMentionSelect(leader)}>
                        {leader}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="schedule-btn">
                <FiSend className="btn-icon" />
                Schedule Pickup
              </button>
            </form>
          </div>

          {/* Right: Recent Notifications */}
          <div className="dashboard">
            <h3>Recent Notifications</h3>
            <div className="notifications">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification">
                  <p>{notification.message}</p>
                  <div className="notification-meta">
                    <span className="team-badge">{notification.team}</span>
                    <time>{notification.timestamp}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          .wrapper {
            display: flex;
            min-height: 100vh;
            background-color: #f0f2f5;
          }

          .main-content {
            flex-grow: 1;
            padding: 2rem;
          }

          .pickup-container {
            display: flex;
            gap: 2rem;
            max-width: 1100px;
            margin: auto;
          }

          .form-section {
            flex: 1;
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .dashboard {
            width: 300px;
            background: #fff;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 80vh;
            overflow-y: auto;
          }

          h2, h3 {
            color: #2c3e50;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          label {
            font-weight: 600;
            color: #4a5568;
            font-size: 0.9rem;
          }

          input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 1rem;
          }

          .input-icon {
            position: relative;
          }

          .input-icon input, .input-icon select {
            padding-right: 40px;
          }

          .icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #718096;
          }

          .mention-list {
            background: white;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: absolute;
            width: 100%;
            z-index: 10;
          }

          .mention-item {
            padding: 8px;
            cursor: pointer;
          }

          .mention-item:hover {
            background: #f7fafc;
          }

          .schedule-btn {
            background:rgb(5, 52, 16);
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .schedule-btn:hover {
            background:rgb(0, 160, 75);
          }

          .btn-icon {
            font-size: 1.2rem;
          }
        `}
      </style>
    </div>
  );
};

export default PickupScheduler;
