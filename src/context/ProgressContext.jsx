import React, { createContext, useState, useEffect } from "react";

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [points, setPoints] = useState(() => {
    const raw = localStorage.getItem("sst_points");
    return raw ? parseInt(raw, 10) : 0;
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const raw = localStorage.getItem("sst_unlockedLevels");
    return raw ? JSON.parse(raw) : [1];
  });

  useEffect(() => {
    localStorage.setItem("sst_points", String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem("sst_unlockedLevels", JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  const addPoints = (n) => setPoints((p) => p + n);
  const unlockLevel = (id) => {
    setUnlockedLevels((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const resetProgress = () => {
    setPoints(0);
    setUnlockedLevels([1]);
    localStorage.removeItem("sst_points");
    localStorage.removeItem("sst_unlockedLevels");
  };

  return (
    <ProgressContext.Provider
      value={{ points, addPoints, unlockedLevels, unlockLevel, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
