import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PickupScheduler = () => {
  const [formData, setFormData] = useState({
    location: '',
    datetime: '',
    team: '',
    details: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [teamLeaders] = useState(['@john.doe', '@jane.smith', '@mike.ross']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'details' && value.includes('@')) {
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  const handleMentionSelect = (leader) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details + leader + ' '
    }));
    setShowMentionList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotification = {
      id: uuidv4(),
      message: `New pickup scheduled at ${formData.location}`,
      timestamp: new Date().toLocaleString(),
      team: formData.team,
      details: formData.details
    };

    setNotifications(prev => [newNotification, ...prev]);
    setFormData({
      location: '',
      datetime: '',
      team: '',
      details: ''
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h2 style={styles.heading}>Schedule Pickup</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date & Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Assign Team</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select Team</option>
              <option>Alpha Team</option>
              <option>Bravo Team</option>
              <option>Charlie Team</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Details & Instructions</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Mention team leaders using @"
            />
            {showMentionList && (
              <div style={styles.mentionList}>
                {teamLeaders.map(leader => (
                  <div
                    key={leader}
                    style={styles.mentionItem}
                    onClick={() => handleMentionSelect(leader)}
                  >
                    {leader}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" style={styles.button}>
            Schedule Pickup
          </button>
        </form>
      </div>

      <div style={styles.dashboard}>
        <h3 style={styles.subHeading}>Recent Notifications</h3>
        <div style={styles.notifications}>
          {notifications.map(notification => (
            <div key={notification.id} style={styles.notification}>
              <p style={styles.notificationText}>{notification.message}</p>
              <div style={styles.notificationMeta}>
                <span style={styles.teamBadge}>{notification.team}</span>
                <time style={styles.timestamp}>{notification.timestamp}</time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem'
  },
  formSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  dashboard: {
    width: '320px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '2rem'
  },
  subHeading: {
    color: '#34495e',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'relative'
  },
  label: {
    fontWeight: '600',
    color: '#4a5568'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    minHeight: '100px',
    resize: 'vertical'
  },
  mentionList: {
    position: 'absolute',
    bottom: '100%',
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 10
  },
  mentionItem: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f7fafc'
    }
  },
  button: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  notification: {
    backgroundColor: '#f8f9ff',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #4a90e2'
  },
  notificationText: {
    margin: '0 0 0.5rem 0',
    color: '#2d3748'
  },
  notificationMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  teamBadge: {
    backgroundColor: '#e2e8f0',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  timestamp: {
    color: '#718096',
    fontSize: '0.875rem'
  }
};

export default PickupScheduler;