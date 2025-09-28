import React from "react";
import "../Styles/ViewToggle.css";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: "day", label: "Day", icon: "📅" },
    { id: "week", label: "Week", icon: "📆" },
    { id: "month", label: "Month", icon: "🗓️" },
  ];

  return (
    <div className="view-toggle">
      {views.map((view) => (
        <button
          key={view.id}
          className={`view-btn ${currentView === view.id ? "active" : ""}`}
          onClick={() => onViewChange(view.id)}
        >
          <span className="view-icon">{view.icon}</span>
          <span className="view-label">{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
