import React, { useState } from "react";
import { useReminders } from "../Contexts/ReminderContext";
import { formatDate } from "../Utils/calendarUtils";
import "../Styles/ReminderForm.css";

const ReminderForm = ({ task, onClose }) => {
  const { addReminder, permission, requestNotificationPermission } =
    useReminders();
  const [formData, setFormData] = useState({
    dueTime: "",
    dueDate: formatDate(new Date()),
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.dueTime) {
      alert("Please set a reminder time");
      return;
    }

    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);

    if (dueDateTime <= new Date()) {
      alert("Reminder time must be in the future");
      return;
    }

    addReminder(
      task.id,
      task.title,
      dueDateTime.toISOString(),
      formData.message
    );

    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const quickTimes = [
    { label: "5 min before", minutes: 5 },
    { label: "15 min before", minutes: 15 },
    { label: "30 min before", minutes: 30 },
    { label: "1 hour before", minutes: 60 },
    { label: "1 day before", minutes: 1440 },
  ];

  const setQuickTime = (minutes) => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const reminderTime = new Date(dueDate.getTime() - minutes * 60000);

    setFormData({
      dueDate: formatDate(reminderTime),
      dueTime: reminderTime.toTimeString().slice(0, 5),
      message: formData.message,
    });
  };

  return (
    <div className="reminder-form-overlay">
      <div className="reminder-form">
        <div className="reminder-header">
          <h3>🔔 Set Reminder</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="task-preview">
          <strong>{task.title}</strong>
          {task.dueDate && (
            <span className="task-due">
              Due: {formatDate(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          )}
        </div>

        {permission !== "granted" && (
          <div className="notification-permission">
            <p>Enable notifications for reminders:</p>
            <button
              className="permission-btn"
              onClick={requestNotificationPermission}
            >
              🔔 Enable Notifications
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reminder-form-content">
          <div className="form-group">
            <label>Quick Reminders</label>
            <div className="quick-times">
              {quickTimes.map((quickTime, index) => (
                <button
                  key={index}
                  type="button"
                  className="quick-time-btn"
                  onClick={() => setQuickTime(quickTime.minutes)}
                >
                  {quickTime.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Reminder Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime">Reminder Time</label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Custom Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add a custom reminder message..."
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              💾 Set Reminder
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
