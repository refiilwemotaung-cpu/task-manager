import React from "react";
import { ThemeProvider } from "./Contexts/ThemeContext";
import { TaskProvider } from "./Contexts/TaskContext";
import Header from "./Components/Header";
import CalendarView from "./Components/Calendar/CalendarView";
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";
// import "./Styles/App.css";

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="app" data-theme="light">
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
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
