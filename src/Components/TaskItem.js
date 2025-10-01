import React from "react";
import "../Styles/TaskItem.css";

const TaskItem = ({ task, compact = false }) => {
  // Your TaskItem component logic here
  return (
    <div className={`task-item ${compact ? "compact" : ""}`}>
      {/* Your task item JSX */}
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskItem; // ← This line is crucial!
