import React, { createContext, useContext, useState, useEffect } from "react";

const PomodoroContext = createContext();

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};

export const PomodoroProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState("work"); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  const settings = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (window.Notification && Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: `${
          sessionType === "work"
            ? "Work session complete! Time for a break."
            : "Break over! Back to work."
        }`,
        icon: "/favicon.ico",
      });
    }

    if (sessionType === "work") {
      setSessionsCompleted((prev) => prev + 1);
      setTotalFocusTime((prev) => prev + settings.work);

      if ((sessionsCompleted + 1) % 4 === 0) {
        setSessionType("longBreak");
        setTimeLeft(settings.longBreak);
      } else {
        setSessionType("shortBreak");
        setTimeLeft(settings.shortBreak);
      }
    } else {
      setSessionType("work");
      setTimeLeft(settings.work);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[sessionType]);
  };

  const switchSession = (type) => {
    setIsRunning(false);
    setSessionType(type);
    setTimeLeft(settings[type]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const value = {
    isRunning,
    timeLeft,
    sessionType,
    sessionsCompleted,
    totalFocusTime,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    switchSession,
    settings,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};
