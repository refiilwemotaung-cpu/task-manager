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

  if (!isExpanded) {
    return (
      <div className="pomodoro-minimized" onClick={() => setIsExpanded(true)}>
        <div className="mini-timer">
          <span className="mini-time">{formatTime(timeLeft)}</span>
          <span className="mini-session">{getSessionLabel()}</span>
        </div>
        <button className="expand-btn">⚡</button>
      </div>
    );
  }

  return (
    <div
      className="pomodoro-timer"
      style={{ borderLeftColor: getSessionColor() }}
    >
      <div className="pomodoro-header">
        <h3>🍅 Pomodoro Timer</h3>
        <button className="close-btn" onClick={() => setIsExpanded(false)}>
          ×
        </button>
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
    </div>
  );
};

export default PomodoroTimer;
