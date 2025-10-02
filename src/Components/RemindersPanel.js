import React, { useState } from "react";
import { useReminders } from "../Contexts/ReminderContext";
import { formatDate } from "../Utils/calendarUtils";
import "../Styles/RemindersPanel.css";

const RemindersPanel = () => {
  const {
    checklistItems,
    notes,
    permission,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    clearCompleted,
    updateNotes,
    getStats,
    requestNotificationPermission,
  } = useReminders();

  const [newItemText, setNewItemText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [activeTab, setActiveTab] = useState("checklist");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const stats = getStats();
  const pendingItems = checklistItems.filter((item) => !item.completed);
  const completedItems = checklistItems.filter((item) => item.completed);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    addChecklistItem(newItemText, dueDate || null);
    setNewItemText("");
    setDueDate("");
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleEditSave = (id) => {
    if (editText.trim()) {
      updateChecklistItem(id, { text: editText.trim() });
    }
    setEditingId(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "";
    const date = new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return formatDate(date, "MMM d");
    }
  };

  return (
    <div className="reminders-panel">
      <div className="panel-header">
        <h2>📝 Quick Notes & Reminders</h2>
        <div className="panel-stats">
          <span className="stat pending">{stats.pending}</span>
          <span className="stat completed">{stats.completed}</span>
        </div>
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === "checklist" ? "active" : ""}`}
          onClick={() => setActiveTab("checklist")}
        >
          📋 Checklist
        </button>
        <button
          className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          📄 Notes
        </button>
      </div>

      {activeTab === "checklist" && (
        <div className="checklist-tab">
          {permission !== "granted" && (
            <div className="permission-banner">
              <p>Enable notifications for due reminders</p>
              <button
                className="permission-btn"
                onClick={requestNotificationPermission}
              >
                🔔 Enable
              </button>
            </div>
          )}

          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="add-item-form">
            <div className="input-group">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add a new reminder..."
                className="item-input"
              />
              <button
                type="submit"
                className="add-btn"
                disabled={!newItemText.trim()}
              >
                +
              </button>
            </div>
            <div className="due-date-group">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="due-date-input"
                placeholder="Set due date (optional)"
              />
            </div>
          </form>

          {/* Pending Items */}
          <div className="items-section">
            <h4 className="section-title">Pending ({pendingItems.length})</h4>
            {pendingItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>No pending reminders</p>
                <small>Add reminders above to get started</small>
              </div>
            ) : (
              <div className="items-list">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className={`checklist-item ${
                      isOverdue(item.dueDate) ? "overdue" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="item-checkbox"
                    />

                    {editingId === item.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-input"
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            onClick={() => handleEditSave(item.id)}
                            className="save-edit-btn"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="cancel-edit-btn"
                          >
                            ✗
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="item-content"
                          onDoubleClick={() => handleEditStart(item)}
                        >
                          <span className="item-text">{item.text}</span>
                          {item.dueDate && (
                            <span
                              className={`due-date ${
                                isOverdue(item.dueDate) ? "overdue" : ""
                              }`}
                            >
                              📅 {formatDueDate(item.dueDate)}
                              {isOverdue(item.dueDate) && " ⚠️"}
                            </span>
                          )}
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => handleEditStart(item)}
                            className="edit-btn"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteChecklistItem(item.id)}
                            className="delete-btn"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="items-section">
              <div className="section-header">
                <h4 className="section-title">
                  Completed ({completedItems.length})
                </h4>
                <button
                  onClick={clearCompleted}
                  className="clear-btn"
                  title="Clear all completed"
                >
                  Clear
                </button>
              </div>
              <div className="items-list completed-list">
                {completedItems.map((item) => (
                  <div key={item.id} className="checklist-item completed">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="item-checkbox"
                    />
                    <div className="item-content">
                      <span className="item-text">{item.text}</span>
                      {item.dueDate && (
                        <span className="due-date">
                          📅 {formatDueDate(item.dueDate)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteChecklistItem(item.id)}
                      className="delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="notes-tab">
          <div className="notes-header">
            <h4>Quick Notes</h4>
            <span className="notes-count">{notes.length} characters</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Write your notes here...&#10;&#10;• Meeting notes&#10;• Ideas&#10;• Shopping list&#10;• Important reminders"
            className="notes-textarea"
            rows="12"
          />
          <div className="notes-actions">
            <button onClick={() => updateNotes("")} className="clear-notes-btn">
              Clear Notes
            </button>
            <div className="notes-tips">
              <small>📝 Auto-saves • 📱 Works on all devices</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersPanel;
