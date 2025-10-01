import React from "react";
import { useTasks } from "../../Contexts/TaskContext";
import {
  getWeekView,
  isCurrentDay,
  formatDate,
  getTasksForDate,
} from "../../Utils/calendarUtils";
import "../../Styles/WeekView.css";

const WeekView = ({ currentDate }) => {
  const { getTasksForDate: getTasks, handleDrop, startDrag } = useTasks();
  const weekDays = getWeekView(currentDate);
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e, date) => {
    e.preventDefault();
    handleDrop(date);
  };

  const getTasksForTimeSlot = (tasks, timeSlot) => {
    // Simplified: show tasks in their respective time slots
    // In a real app, you'd have actual time data for tasks
    return tasks.filter((task, index) => {
      // Distribute tasks across time slots for visualization
      return index % 3 === timeSlot % 3;
    });
  };

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-column-header"></div>
        {weekDays.map((date, index) => {
          const isToday = isCurrentDay(date);
          const dayTasks = getTasks(date);
          return (
            <div
              key={index}
              className={`week-day-header ${isToday ? "today" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDate(e, date)}
            >
              <div className="week-day-name">{formatDate(date, "EEE")}</div>
              <div className="week-day-date">{formatDate(date, "d")}</div>
              <div className="week-day-month">{formatDate(date, "MMM")}</div>
              {dayTasks.length > 0 && (
                <div className="week-day-task-count">{dayTasks.length}</div>
              )}
              {isToday && <div className="week-today-indicator"></div>}
            </div>
          );
        })}
      </div>

      <div className="week-body">
        <div className="time-column">
          {timeSlots.map((time) => (
            <div key={time} className="time-slot-label">
              {time === 12
                ? "12 PM"
                : time > 12
                ? `${time - 12} PM`
                : `${time} AM`}
            </div>
          ))}
        </div>

        <div className="week-grid">
          {weekDays.map((date, dayIndex) => {
            const dayTasks = getTasks(date);
            return (
              <div key={dayIndex} className="week-day-column">
                {timeSlots.map((time, timeIndex) => {
                  const timeSlotTasks = getTasksForTimeSlot(dayTasks, time);
                  return (
                    <div
                      key={timeIndex}
                      className="week-time-slot"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnDate(e, date)}
                    >
                      {timeSlotTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`week-task-item ${task.priority} ${
                            task.completed ? "completed" : ""
                          }`}
                          draggable
                          onDragStart={() => startDrag(task)}
                        >
                          <div className="week-task-title">{task.title}</div>
                          {task.priority === "high" && (
                            <div className="week-task-priority">🔥</div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
