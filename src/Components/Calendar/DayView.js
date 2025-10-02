import React, { useState } from "react";
import { useTasks } from "../../Contexts/TaskContext";
import {
  isCurrentDay,
  formatDate,
  getTasksForDate,
} from "../../Utils/calendarUtils";
import "../../Styles/DayView.css";

const DayView = ({ currentDate }) => {
  const {
    getTasksForDate: getTasks,
    handleDrop,
    startDrag,
    addTask,
  } = useTasks();
  const tasks = getTasks(currentDate);
  const isToday = isCurrentDay(currentDate);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00
  const [expandedHour, setExpandedHour] = useState(null);
  const [quickAddData, setQuickAddData] = useState({});

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e) => {
    e.preventDefault();
    handleDrop(currentDate);
  };

  const getTasksForHour = (hour) => {
    // Assign tasks to hours based on their creation time or manual assignment
    return tasks.filter((task) => {
      if (!task.scheduledHour) {
        // If no scheduled hour, distribute evenly
        const taskHour = parseInt(task.id) % 24;
        return taskHour === hour;
      }
      return task.scheduledHour === hour;
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "var(--error-color)",
      medium: "var(--warning-color)",
      low: "var(--success-color)",
    };
    return colors[priority] || colors.medium;
  };

  const handleQuickAdd = (
    hour,
    title,
    category = "work",
    priority = "medium"
  ) => {
    const newTask = addTask({
      title,
      description: "",
      priority,
      dueDate: formatDate(currentDate),
      category,
      scheduledHour: hour,
    });

    // Collapse the form after adding
    setExpandedHour(null);
    setQuickAddData({});
  };

  const handleCustomAdd = (hour, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");

    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: formData.get("description") || "",
      priority: formData.get("priority") || "medium",
      dueDate: formatDate(currentDate),
      category: formData.get("category") || "work",
      scheduledHour: hour,
    });

    // Reset and collapse
    setExpandedHour(null);
    setQuickAddData({});
  };

  const handleInputChange = (hour, field, value) => {
    setQuickAddData((prev) => ({
      ...prev,
      [hour]: {
        ...prev[hour],
        [field]: value,
      },
    }));
  };

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const formatHour24 = (hour) => {
    return hour.toString().padStart(2, "0") + ":00";
  };

  const quickTasks = [
    { title: "Meeting", category: "work", priority: "high", icon: "💼" },
    { title: "Workout", category: "health", priority: "medium", icon: "💪" },
    { title: "Study", category: "learning", priority: "medium", icon: "📚" },
    { title: "Lunch", category: "personal", priority: "low", icon: "🍴" },
    { title: "Call", category: "work", priority: "high", icon: "📞" },
    { title: "Review", category: "work", priority: "medium", icon: "📋" },
  ];

  return (
    <div className="day-view">
      <div className="day-header">
        <div className="day-info">
          <h2 className="day-title">
            {formatDate(currentDate, "EEEE, MMMM d, yyyy")}
          </h2>
          <div className="day-meta">
            {isToday && <span className="day-today-badge">Today</span>}
            <span className="day-tasks-count">{tasks.length} tasks</span>
          </div>
        </div>
      </div>

      <div
        className="day-body"
        onDragOver={handleDragOver}
        onDrop={handleDropOnDate}
      >
        <div className="time-slots">
          {timeSlots.map((hour) => {
            const hourTasks = getTasksForHour(hour);
            const isExpanded = expandedHour === hour;
            const currentQuickData = quickAddData[hour] || {};

            return (
              <div key={hour} className="day-time-slot">
                <div className="time-label">
                  <span className="time-12hr">{formatHour(hour)}</span>
                  <span className="time-24hr">{formatHour24(hour)}</span>
                </div>
                <div className="time-content">
                  {/* Tasks for this hour */}
                  {hourTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`day-task-item ${task.priority} ${
                        task.completed ? "completed" : ""
                      }`}
                      draggable
                      onDragStart={() => startDrag(task)}
                      style={{
                        borderLeftColor: getPriorityColor(task.priority),
                      }}
                    >
                      <div className="day-task-main">
                        <div className="day-task-title">{task.title}</div>
                        <div className="day-task-time">{formatHour(hour)}</div>
                      </div>
                      {task.description && (
                        <div className="day-task-description">
                          {task.description}
                        </div>
                      )}
                      <div className="day-task-footer">
                        <span className="day-task-priority">
                          {task.priority}
                        </span>
                        {task.completed && (
                          <span className="day-task-completed">✓ Done</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Task Section */}
                  <div className="add-task-section">
                    {!isExpanded ? (
                      <button
                        className="add-task-btn"
                        onClick={() => setExpandedHour(hour)}
                        title={`Add task at ${formatHour(hour)}`}
                      >
                        + Add Task
                      </button>
                    ) : (
                      <div className="add-task-expanded">
                        <div className="quick-add-buttons">
                          {quickTasks.map((quickTask, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`quick-add-btn ${quickTask.priority}`}
                              onClick={() =>
                                handleQuickAdd(
                                  hour,
                                  quickTask.title,
                                  quickTask.category,
                                  quickTask.priority
                                )
                              }
                              title={`Add ${quickTask.title}`}
                            >
                              {quickTask.icon} {quickTask.title}
                            </button>
                          ))}
                        </div>

                        <form
                          onSubmit={(e) => handleCustomAdd(hour, e)}
                          className="custom-add-form"
                        >
                          <input
                            type="text"
                            name="title"
                            placeholder="Custom task..."
                            className="custom-input"
                            required
                            autoFocus
                          />

                          <div className="form-row">
                            <select
                              name="priority"
                              className="form-select small"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>

                            <select
                              name="category"
                              className="form-select small"
                            >
                              <option value="work">💼 Work</option>
                              <option value="personal">🏠 Personal</option>
                              <option value="health">💪 Health</option>
                              <option value="learning">📚 Learning</option>
                              <option value="shopping">🛒 Shopping</option>
                              <option value="other">📝 Other</option>
                            </select>
                          </div>

                          <textarea
                            name="description"
                            placeholder="Description (optional)"
                            rows="2"
                            className="form-textarea small"
                          />

                          <div className="form-actions">
                            <button type="submit" className="submit-btn small">
                              Add Task
                            </button>
                            <button
                              type="button"
                              className="cancel-btn small"
                              onClick={() => {
                                setExpandedHour(null);
                                setQuickAddData({});
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  {hourTasks.length === 0 && !isExpanded && (
                    <div className="time-slot-empty">
                      <span>No tasks scheduled</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
