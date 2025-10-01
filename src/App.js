import React from "react";
import { ThemeProvider, useTheme } from "./Contexts/ThemeContext";
import { TaskProvider } from "./Contexts/TaskContext";
import Header from "./Components/Header";
import CalendarView from "./Components/Calendar/CalendarView";
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";
import "./Styles/App.css";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="app" data-theme={theme}>
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="app-layout">
            {/* Left Sidebar - Task Form & Today's Tasks */}
            <div className="sidebar">
              <TaskForm />
              <TaskList />
            </div>

            {/* Main Calendar Area */}
            <div className="calendar-main">
              <CalendarView />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
