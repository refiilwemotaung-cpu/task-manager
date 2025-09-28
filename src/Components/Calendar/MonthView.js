import React from "react";
import { useTasks } from "../../Contexts/TaskContext";
import {
  getMonthView,
  isCurrentMonth,
  isCurrentDay,
  formatDate,
  getTasksForDate,
} from "../../Utils/calendarUtils";
import "../../Styles/MonthView.css";

const MonthView = ({ currentDate }) => {
  const { getTasksForDate: getTasks, handleDrop, startDrag } = useTasks();
  const monthDays = getMonthView(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e, date) => {
    e.preventDefault();
    handleDrop(date);
  };

  return (
    <div className="month-view">
      {/* Weekday Headers */}
      <div className="month-header">
        {weekDays.map((day) => (
          <div key={day} className="month-header-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="month-grid">
        {monthDays.map((date, index) => {
          const tasks = getTasks(date);
          const isCurrentMonthDay = isCurrentMonth(date, currentDate);
          const isToday = isCurrentDay(date);
          const dayTasks = tasks.slice(0, 3); // Show max 3 tasks per day

          return (
            <div
              key={index}
              className={`month-cell ${
                isCurrentMonthDay ? "current-month" : "other-month"
              } ${isToday ? "today" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDate(e, date)}
            >
              <div className="month-cell-header">
                <span className="date-number">{formatDate(date, "d")}</span>
                {isToday && <span className="today-badge">Today</span>}
              </div>

              <div className="month-tasks">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-badge ${task.priority} ${
                      task.completed ? "completed" : ""
                    }`}
                    draggable
                    onDragStart={() => startDrag(task)}
                  >
                    <span className="task-badge-dot"></span>
                    <span className="task-badge-text">{task.title}</span>
                  </div>
                ))}
                {tasks.length > 3 && (
                  <div className="more-tasks">+{tasks.length - 3} more</div>
                )}
              </div>

              {tasks.length === 0 && (
                <div className="empty-state">No tasks</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
