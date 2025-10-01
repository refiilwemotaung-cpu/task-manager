import React, { useState } from "react";
import { usePomodoro } from "../Contexts/PomodoroContext";
import "../Styles/PomodoroTimer.css";

const PomodoroTimer = () => {
  const {
    isRunning,
    timeLeft,
    sessionType,
    sessionsCompleted,
    totalFocusTime,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    switchSession,
  } = usePomodoro();

  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getSessionColor = () => {
    switch (sessionType) {
      case "work":
        return "var(--error-color)";
      case "shortBreak":
        return "var(--success-color)";
      case "longBreak":
        return "var(--primary-color)";
      default:
        return "var(--primary-color)";
    }
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case "work":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Focus Time";
    }
  };

  const progress =
    (timeLeft /
      (sessionType === "work"
        ? 25 * 60
        : sessionType === "shortBreak"
        ? 5 * 60
        : 15 * 60)) *
    100;

  // Drag and drop handlers
  const handleMouseDown = (e) => {
    if (!isExpanded) return;

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isExpanded) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - 400;
    const maxY = window.innerHeight - 500;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isExpanded) {
    return (
      <div
        className="pomodoro-minimized"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onClick={() => setIsExpanded(true)}
      >
        <div className="mini-timer">
          <span className="mini-time">{formatTime(timeLeft)}</span>
          <span className="mini-session">{getSessionLabel()}</span>
        </div>
        <div className="mini-controls">
          {!isRunning ? (
            <button
              className="mini-btn start-btn"
              onClick={(e) => {
                e.stopPropagation();
                startTimer();
              }}
              title="Start timer"
            >
              ▶
            </button>
          ) : (
            <button
              className="mini-btn pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                pauseTimer();
              }}
              title="Pause timer"
            >
              ⏸
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="pomodoro-timer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="pomodoro-header">
        <h3>🍅 Pomodoro Timer</h3>
        <div className="header-controls">
          <button
            className="control-btn minimize-btn"
            onClick={() => setIsExpanded(false)}
            title="Minimize timer"
          >
            _
          </button>
          <button
            className="control-btn close-btn"
            onClick={() => {
              setIsExpanded(false);
              pauseTimer();
              resetTimer();
            }}
            title="Close timer"
          >
            ×
          </button>
        </div>
      </div>

      <div className="timer-display">
        <div className="time-circle">
          <svg className="progress-ring" width="200" height="200">
            <circle
              stroke={getSessionColor()}
              strokeWidth="8"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
              style={{
                strokeDasharray: 565.48,
                strokeDashoffset: 565.48 - (565.48 * progress) / 100,
              }}
            />
          </svg>
          <div className="time-text">
            <div className="time-main">{formatTime(timeLeft)}</div>
            <div className="session-label">{getSessionLabel()}</div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="control-btn start-btn" onClick={startTimer}>
            ▶ Start
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={pauseTimer}>
            ⏸ Pause
          </button>
        )}
        <button className="control-btn reset-btn" onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>

      <div className="session-selector">
        <button
          className={`session-btn ${sessionType === "work" ? "active" : ""}`}
          onClick={() => switchSession("work")}
        >
          Work
        </button>
        <button
          className={`session-btn ${
            sessionType === "shortBreak" ? "active" : ""
          }`}
          onClick={() => switchSession("shortBreak")}
        >
          Short Break
        </button>
        <button
          className={`session-btn ${
            sessionType === "longBreak" ? "active" : ""
          }`}
          onClick={() => switchSession("longBreak")}
        >
          Long Break
        </button>
      </div>

      <div className="pomodoro-stats">
        <div className="stat">
          <span className="stat-value">{sessionsCompleted}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat">
          <span className="stat-value">{Math.floor(totalFocusTime / 60)}</span>
          <span className="stat-label">Focus Minutes</span>
        </div>
      </div>

      <div className="drag-handle" title="Drag to move">
        ⋮⋮
      </div>
    </div>
  );
};

export default PomodoroTimer;
