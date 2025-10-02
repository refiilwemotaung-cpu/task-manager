import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./Contexts/ThemeContext";
import { TaskProvider } from "./Contexts/TaskContext";
import { PomodoroProvider } from "./Contexts/PomodoroContext";
import { ReminderProvider } from "./Contexts/ReminderContext";
import Header from "./Components/Header";
import CalendarView from "./Components/Calendar/CalendarView";
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";
import PomodoroSidebar from "./Components/PomodoroSidebar";
import RemindersPanel from "./Components/RemindersPanel";
import "./Styles/App.css";

function AppContent() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState("month");
  const isDayView = currentView === "day";

  return (
    <div className="app" data-theme={theme}>
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="app-layout">
            {/* Left Sidebar - All Features */}
            <div className="sidebar">
              <PomodoroSidebar />
              <RemindersPanel />
              {/* Only show TaskForm when NOT in Day view (since Day view has inline adding) */}
              {!isDayView && <TaskForm />}
              <TaskList />
            </div>

            {/* Main Calendar Area */}
            <div className="calendar-main">
              <CalendarView
                currentView={currentView}
                onViewChange={setCurrentView}
              />
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
