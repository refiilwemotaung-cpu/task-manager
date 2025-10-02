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
  const [checklistItems, setChecklistItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    const savedChecklist = localStorage.getItem("calendar-checklist");
    const savedNotes = localStorage.getItem("calendar-notes");

    if (savedChecklist) {
      setChecklistItems(JSON.parse(savedChecklist));
    }
    if (savedNotes) {
      setNotes(savedNotes);
    }

    // Check notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-checklist", JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem("calendar-notes", notes);
  }, [notes]);

  // Check for due reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders();
    }, 60000);

    return () => clearInterval(interval);
  }, [checklistItems]);

  const checkDueReminders = () => {
    const now = new Date();
    checklistItems.forEach((item) => {
      if (!item.completed && item.dueDate && new Date(item.dueDate) <= now) {
        triggerReminder(item);
      }
    });
  };

  const triggerReminder = (item) => {
    // Mark as triggered
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, triggered: true } : i))
    );

    // Show browser notification
    if ("Notification" in window && permission === "granted") {
      new Notification("🔔 Checklist Reminder", {
        body: `${item.text}\nTime to complete your reminder!`,
        icon: "/favicon.ico",
        tag: item.id,
        requireInteraction: true,
      });
    }

    // Fallback: Alert if notifications not supported
    if (!("Notification" in window) || permission !== "granted") {
      if (document.hasFocus()) {
        alert(`🔔 Reminder: ${item.text}\nTime to complete your reminder!`);
      }
    }
  };

  // Checklist Functions
  const addChecklistItem = (text, dueDate = null) => {
    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      dueDate: dueDate,
      createdAt: new Date().toISOString(),
      triggered: false,
    };

    setChecklistItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateChecklistItem = (id, updates) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteChecklistItem = (id) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleChecklistItem = (id) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const clearCompleted = () => {
    setChecklistItems((prev) => prev.filter((item) => !item.completed));
  };

  // Notes Functions
  const updateNotes = (newNotes) => {
    setNotes(newNotes);
  };

  const getStats = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter((item) => item.completed).length;
    const pending = total - completed;
    const overdue = checklistItems.filter(
      (item) =>
        !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(setPermission);
    }
  };

  const value = {
    // Checklist
    checklistItems,
    notes,
    permission,

    // Checklist Actions
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    clearCompleted,

    // Notes Actions
    updateNotes,

    // Stats & Utils
    getStats,
    requestNotificationPermission,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
