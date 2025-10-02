import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isToday,
} from "date-fns";

export const getMonthView = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
};

export const getWeekView = (date) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });
};

export const getDayView = (date) => {
  return [date];
};

export const navigateDate = (date, direction, viewType) => {
  switch (viewType) {
    case "month":
      return direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
    case "week":
      return direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1);
    case "day":
      return direction === "next" ? addDays(date, 1) : subDays(date, 1);
    default:
      return date;
  }
};

export const formatDate = (date, formatStr = "yyyy-MM-dd") => {
  return format(date, formatStr);
};

export const isCurrentMonth = (date, currentMonth) => {
  return isSameMonth(date, currentMonth);
};

export const isCurrentDay = (date) => {
  return isToday(date);
};

export const getTodayTasks = (tasks) => {
  const today = new Date();
  const todayStr = formatDate(today);

  return tasks
    .filter((task) => task.dueDate === todayStr && !task.completed)
    .sort((a, b) => {
      // Sort by priority: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

export const getTasksForDate = (tasks, date) => {
  const dateStr = formatDate(date);
  return tasks.filter((task) => task.dueDate === dateStr);
};

export const groupTasksByDate = (tasks) => {
  const grouped = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      if (!grouped[task.dueDate]) {
        grouped[task.dueDate] = [];
      }
      grouped[task.dueDate].push(task);
    }
  });
  return grouped;
};

// Add to existing calendarUtils.js

export const getTasksForHour = (tasks, hour) => {
  return tasks.filter((task) => task.scheduledHour === hour);
};

export const formatHour = (hour) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

export const formatHour24 = (hour) => {
  return hour.toString().padStart(2, "0") + ":00";
};
