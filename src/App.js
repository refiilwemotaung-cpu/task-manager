import React from "react";
import { ThemeProvider, useTheme } from "./Contexts/ThemeContext";
import { TaskProvider } from "./Contexts/TaskContext";
import { PomodoroProvider } from "./Contexts/PomodoroContext";
import { ReminderProvider } from "./Contexts/ReminderContext";
import Header from "./Components/Header";
import CalendarView from "./Components/Calendar/CalendarView";
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";
import PomodoroTimer from "./Components/PomodoroTimer";
import RemindersPanel from "./Components/RemindersPanel";
import "./Styles/App.css";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="app" data-theme={theme}>
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="app-layout">
            {/* Left Sidebar - All Features */}
            <div className="sidebar">
              <PomodoroTimer />
              <RemindersPanel />
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
        <PomodoroProvider>
          <ReminderProvider>
            <AppContent />
          </ReminderProvider>
        </PomodoroProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
