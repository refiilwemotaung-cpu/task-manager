import React from "react";
import { usePomodoro } from "../Contexts/PomodoroContext";
import "../Styles/PomodoroSidebar.css";

const PomodoroSidebar = () => {
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

  return (
    <div
      className="pomodoro-sidebar"
      style={{ borderLeftColor: getSessionColor() }}
    >
      <div className="pomodoro-sidebar-header">
        <h3>🍅 Pomodoro Timer</h3>
        <div
          className="session-badge"
          style={{ backgroundColor: getSessionColor() }}
        >
          {getSessionLabel()}
        </div>
      </div>

      <div className="timer-display-sidebar">
        <div className="time-main-sidebar">{formatTime(timeLeft)}</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: getSessionColor(),
            }}
          ></div>
        </div>
      </div>

      <div className="timer-controls-sidebar">
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

      <div className="session-selector-sidebar">
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

      <div className="pomodoro-stats-sidebar">
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

export default PomodoroSidebar;
