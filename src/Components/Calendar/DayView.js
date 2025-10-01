import React from "react";
import { useTasks } from "../../Contexts/TaskContext";
import {
  isCurrentDay,
  formatDate,
  getTasksForDate,
} from "../../Utils/calendarUtils";
import "../../Styles/DayView.css";

const DayView = ({ currentDate }) => {
  const { getTasksForDate: getTasks, handleDrop, startDrag } = useTasks();
  const tasks = getTasks(currentDate);
  const isToday = isCurrentDay(currentDate);
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e) => {
    e.preventDefault();
    handleDrop(currentDate);
  };

  const getTasksForHour = (hour) => {
    // Simplified: assign tasks to hours based on their creation time or priority
    return tasks.filter((task, index) => {
      const taskHour = (index % 12) + 8; // Distribute tasks between 8 AM and 7 PM
      return taskHour === hour;
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
            const timeLabel =
              hour === 12
                ? "12 PM"
                : hour > 12
                ? `${hour - 12} PM`
                : `${hour} AM`;

            return (
              <div key={hour} className="day-time-slot">
                <div className="time-label">{timeLabel}</div>
                <div className="time-content">
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
                        <div className="day-task-time">{timeLabel}</div>
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
                  {hourTasks.length === 0 && (
                    <div className="time-slot-empty">
                      <span>No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All Day Tasks Section */}
        {tasks.length > 0 && (
          <div className="all-day-section">
            <h3 className="all-day-title">All Day Tasks</h3>
            <div className="all-day-tasks">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`all-day-task ${task.priority} ${
                    task.completed ? "completed" : ""
                  }`}
                  draggable
                  onDragStart={() => startDrag(task)}
                >
                  <div className="all-day-task-title">{task.title}</div>
                  <div className="all-day-task-priority">{task.priority}</div>
                </div>
              ))}
              {tasks.length > 5 && (
                <div className="more-tasks">+{tasks.length - 5} more tasks</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
