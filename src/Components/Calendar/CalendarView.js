import React, { useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import ViewToggle from "../ViewToggle";
import { navigateDate, formatDate } from "../../Utils/calendarUtils";
import "../../Styles/CalendarView.css";

const CalendarView = () => {
  const { isDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  const handlePrevious = () => {
    setCurrentDate(navigateDate(currentDate, "prev", currentView));
  };

  const handleNext = () => {
    setCurrentDate(navigateDate(currentDate, "next", currentView));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderText = () => {
    switch (currentView) {
      case "month":
        return formatDate(currentDate, "MMMM yyyy");
      case "week":
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${formatDate(weekStart, "MMMM d")} - ${formatDate(
            weekEnd,
            "d, yyyy"
          )}`;
        } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
          return `${formatDate(weekStart, "MMM d")} - ${formatDate(
            weekEnd,
            "MMM d, yyyy"
          )}`;
        } else {
          return `${formatDate(weekStart, "MMM d, yyyy")} - ${formatDate(
            weekEnd,
            "MMM d, yyyy"
          )}`;
        }
      case "day":
        return formatDate(currentDate, "EEEE, MMMM d, yyyy");
      default:
        return formatDate(currentDate, "MMMM yyyy");
    }
  };

  const renderCalendar = () => {
    switch (currentView) {
      case "month":
        return <MonthView currentDate={currentDate} />;
      case "week":
        return <WeekView currentDate={currentDate} />;
      case "day":
        return <DayView currentDate={currentDate} />;
      default:
        return <MonthView currentDate={currentDate} />;
    }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-controls">
          <button className="today-btn" onClick={handleToday}>
            Today
          </button>
          <div className="navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              aria-label="Next"
            >
              ›
            </button>
          </div>
          <h2 className="calendar-title">{getHeaderText()}</h2>
        </div>

        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>

      <div className="calendar-content">{renderCalendar()}</div>
    </div>
  );
};

export default CalendarView;
