import React, { createContext, useContext, useState, useEffect } from "react";
import { formatDate, getTodayTasks } from "../Utils/calendarUtils.js";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("calendar-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      completed: false,
      dueDate: task.dueDate || formatDate(new Date()),
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
    draggedTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTaskToDate,
    getTodaysTasks,
    getTasksForDate,
    startDrag,
    endDrag,
    handleDrop,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
