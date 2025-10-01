import React from "react";
import { useReminders } from "../Contexts/ReminderContext";
import { formatDate } from "../Utils/calendarUtils";
import "../Styles/RemindersPanel.css";

const RemindersPanel = () => {
  const {
    reminders,
    getUpcomingReminders,
    deleteReminder,
    permission,
    requestNotificationPermission,
  } = useReminders();
  const upcomingReminders = getUpcomingReminders();

  const formatReminderTime = (dueTime) => {
    const date = new Date(dueTime);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `in ${diffMins} min`;
    } else if (diffHours < 24) {
      return `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    } else {
      return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }
  };

  if (reminders.length === 0) {
    return (
      <div className="reminders-panel">
        <div className="reminders-header">
          <h3>🔔 Reminders</h3>
        </div>
        <div className="empty-reminders">
          <div className="empty-icon">⏰</div>
          <p>No reminders set</p>
          <small>Add reminders to your tasks</small>
        </div>
      </div>
    );
  }

  return (
    <div className="reminders-panel">
      <div className="reminders-header">
        <h3>🔔 Reminders</h3>
        <span className="reminders-count">{upcomingReminders.length}</span>
      </div>

      {permission !== "granted" && (
        <div className="permission-banner">
          <p>Enable notifications for reminders</p>
          <button
            className="permission-btn small"
            onClick={requestNotificationPermission}
          >
            Enable
          </button>
        </div>
      )}

      <div className="reminders-list">
        {upcomingReminders.map((reminder) => (
          <div key={reminder.id} className="reminder-item">
            <div className="reminder-content">
              <div className="reminder-title">{reminder.taskTitle}</div>
              <div className="reminder-time">
                {formatDate(new Date(reminder.dueTime), "MMM d, h:mm a")}
                <span className="reminder-countdown">
                  ({formatReminderTime(reminder.dueTime)})
                </span>
              </div>
              {reminder.message && (
                <div className="reminder-message">{reminder.message}</div>
              )}
            </div>
            <button
              className="delete-reminder-btn"
              onClick={() => deleteReminder(reminder.id)}
              title="Delete reminder"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {reminders.filter((r) => r.triggered).length > 0 && (
        <div className="triggered-reminders">
          <details>
            <summary>
              Completed Reminders ({reminders.filter((r) => r.triggered).length}
              )
            </summary>
            <div className="triggered-list">
              {reminders
                .filter((r) => r.triggered)
                .map((reminder) => (
                  <div key={reminder.id} className="reminder-item triggered">
                    <div className="reminder-content">
                      <div className="reminder-title">{reminder.taskTitle}</div>
                      <div className="reminder-time">
                        {formatDate(
                          new Date(reminder.dueTime),
                          "MMM d, h:mm a"
                        )}
                      </div>
                    </div>
                    <button
                      className="delete-reminder-btn"
                      onClick={() => deleteReminder(reminder.id)}
                      title="Delete reminder"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default RemindersPanel;
