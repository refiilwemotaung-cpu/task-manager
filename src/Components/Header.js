import React from "react";
import { useTheme } from "../Contexts/ThemeContext";
import "../Styles/Header.css";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">📅</span>
            <h1>Calendar Task Manager</h1>
          </div>
          <p className="tagline">Drag, drop, and organize your life</p>
        </div>

        <div className="header-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="theme-icon">{isDarkMode ? "☀️" : "🌙"}</span>
            <span className="theme-text">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
