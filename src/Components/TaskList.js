import React from "react";
import { useTasks } from "../Contexts/TaskContext";
import TaskItem from "./TaskItem";
import { getTodayTasks } from "../Utils/calendarUtils";
import "../Styles/TaskList.css";

const TaskList = () => {
  const { tasks } = useTasks();
  const todayTasks = getTodayTasks(tasks);
  const upcomingTasks = tasks
    .filter((task) => !task.completed && !todayTasks.includes(task))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Show only 5 upcoming tasks

  return (
    <section className="task-list-section">
      <div className="task-list-container">
        {/* Today's Tasks */}
        <div className="task-category">
          <div className="category-header">
            <h3>📋 Today's Tasks</h3>
            <span className="task-count">{todayTasks.length}</span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-tasks">
              <div className="empty-icon">🎉</div>
              <p>No tasks for today!</p>
              <small>Enjoy your day or add some tasks.</small>
            </div>
          ) : (
            <div className="tasks-container">
              {todayTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="task-category">
            <div className="category-header">
              <h3>📅 Upcoming Tasks</h3>
              <span className="task-count">{upcomingTasks.length}</span>
            </div>
            <div className="tasks-container">
              {upcomingTasks.map((task) => (
                <TaskItem key={task.id} task={task} compact={true} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-number">
              {tasks.filter((t) => !t.completed).length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {tasks.filter((t) => t.completed).length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {
                tasks.filter((t) => t.priority === "high" && !t.completed)
                  .length
              }
            </div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskList;
