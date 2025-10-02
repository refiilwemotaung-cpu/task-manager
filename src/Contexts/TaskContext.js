import React, { createContext, useContext, useState, useEffect } from "react";
import { formatDate, getTodayTasks } from "../Utils/calendarUtils";

const TaskContext = createContext();

const defaultCategories = [
  { id: "work", name: "Work", color: "#3B82F6", icon: "💼" },
  { id: "personal", name: "Personal", color: "#10B981", icon: "🏠" },
  { id: "health", name: "Health", color: "#EF4444", icon: "💪" },
  { id: "learning", name: "Learning", color: "#8B5CF6", icon: "📚" },
  { id: "shopping", name: "Shopping", color: "#F59E0B", icon: "🛒" },
  { id: "other", name: "Other", color: "#6B7280", icon: "📝" },
];

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("calendar-tasks");
    const savedCategories = localStorage.getItem("calendar-categories");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("calendar-categories", JSON.stringify(categories));
  }, [categories]);

  // In the addTask function, update to include scheduledHour
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      completed: false,
      dueDate: task.dueDate || formatDate(new Date()),
      category: task.category || "other",
      scheduledHour: task.scheduledHour || null, // Add scheduled hour
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const moveTaskToDate = (taskId, newDate) => {
    const dateStr = formatDate(newDate);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: dateStr } : task
      )
    );
  };

  const getTodaysTasks = () => {
    return getTodayTasks(tasks);
  };

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date);
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const getTasksByCategory = (categoryId) => {
    return tasks.filter((task) => task.category === categoryId);
  };

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedCategory } : cat))
    );
  };

  const deleteCategory = (id) => {
    if (defaultCategories.find((cat) => cat.id === id)) {
      return false;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.category === id ? { ...task, category: "other" } : task
      )
    );

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return true;
  };

  const getCategory = (categoryId) => {
    return (
      categories.find((cat) => cat.id === categoryId) ||
      categories.find((cat) => cat.id === "other")
    );
  };

  const startDrag = (task) => {
    setDraggedTask(task);
  };

  const endDrag = () => {
    setDraggedTask(null);
  };

  const handleDrop = (date) => {
    if (draggedTask) {
      moveTaskToDate(draggedTask.id, date);
      endDrag();
    }
  };

  const value = {
    tasks,
    categories,
    draggedTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTaskToDate,
    getTodaysTasks,
    getTasksForDate,
    getTasksByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    startDrag,
    endDrag,
    handleDrop,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
