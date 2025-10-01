import React, { createContext, useContext, useState, useEffect } from "react";

const ReminderContext = createContext();

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminders must be used within a ReminderProvider");
  }
  return context;
};

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    const savedReminders = localStorage.getItem("calendar-reminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }

    if ("Notification" in window) {
      setPermission(Notification.permission);

      if (Notification.permission === "default") {
        Notification.requestPermission().then(setPermission);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const checkDueReminders = () => {
    const now = new Date();
    reminders.forEach((reminder) => {
      if (!reminder.triggered && new Date(reminder.dueTime) <= now) {
        triggerReminder(reminder);
      }
    });
  };

  const triggerReminder = (reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, triggered: true } : r))
    );

    if ("Notification" in window && permission === "granted") {
      new Notification("🔔 Task Reminder", {
        body: `${reminder.taskTitle}\n${
          reminder.message || "Time to complete your task!"
        }`,
        icon: "/favicon.ico",
        tag: reminder.id,
        requireInteraction: true,
      });
    }

    if (!("Notification" in window) || permission !== "granted") {
      if (document.hasFocus()) {
        alert(
          `🔔 Reminder: ${reminder.taskTitle}\n${
            reminder.message || "Time to complete your task!"
          }`
        );
      }
    }
  };

  const addReminder = (taskId, taskTitle, dueTime, message = "") => {
    const newReminder = {
      id: Date.now().toString(),
      taskId,
      taskTitle,
      dueTime: new Date(dueTime).toISOString(),
      message,
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  };

  const updateReminder = (id, updatedReminder) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
  };

  const deleteRemindersForTask = (taskId) => {
    setReminders((prev) =>
      prev.filter((reminder) => reminder.taskId !== taskId)
    );
  };

  const getRemindersForTask = (taskId) => {
    return reminders.filter((reminder) => reminder.taskId === taskId);
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(
        (reminder) => !reminder.triggered && new Date(reminder.dueTime) > now
      )
      .sort((a, b) => new Date(a.dueTime) - new Date(b.dueTime));
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(setPermission);
    }
  };

  const value = {
    reminders,
    permission,
    addReminder,
    updateReminder,
    deleteReminder,
    deleteRemindersForTask,
    getRemindersForTask,
    getUpcomingReminders,
    requestNotificationPermission,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
