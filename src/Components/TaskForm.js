import React, { useState } from "react";
import { useTasks } from "../Contexts/TaskContext";
import { useTheme } from "../Contexts/ThemeContext";
import { formatDate } from "../Utils/calendarUtils";
import "../Styles/TaskForm.css";

const TaskForm = () => {
  const { addTask } = useTasks();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: formatDate(new Date()),
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addTask({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    // Reset form but keep the date
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: formData.dueDate, // Keep the same date for quick adding
    });

    // Collapse form after submission
    setIsExpanded(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuickAdd = (title, priority = "medium") => {
    addTask({
      title,
      description: "",
      priority,
      dueDate: formatDate(new Date()),
    });
  };

  return (
    <section className="task-form-section">
      <div className="form-container">
        <div className="form-header">
          <h2>Add Task</h2>
          <button
            type="button"
            className={`expand-btn ${isExpanded ? "expanded" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="quick-add-buttons">
          <button
            onClick={() => handleQuickAdd("Meeting", "high")}
            className="quick-btn high"
          >
            📅 Meeting
          </button>
          <button
            onClick={() => handleQuickAdd("Workout", "medium")}
            className="quick-btn medium"
          >
            💪 Workout
          </button>
          <button
            onClick={() => handleQuickAdd("Read", "low")}
            className="quick-btn low"
          >
            📚 Read
          </button>
        </div>

        {isExpanded && (
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                required
                className="form-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details (optional)"
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span className="btn-icon">+</span>
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default TaskForm;
