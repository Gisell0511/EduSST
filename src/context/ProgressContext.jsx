// ProgressContext.jsx - CON LOGS DE DIAGNÓSTICO
import React, { createContext, useState, useEffect, useContext } from "react";

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  console.log('🔍 ProgressProvider - INICIANDO'); // ← LOG
  
  const [points, setPoints] = useState(() => {
    const raw = localStorage.getItem("sst_points");
    console.log('🔍 ProgressProvider - puntos iniciales:', raw); // ← LOG
    return raw ? parseInt(raw, 10) : 0;
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const raw = localStorage.getItem("sst_unlockedLevels");
    console.log('🔍 ProgressProvider - niveles iniciales:', raw); // ← LOG
    return raw ? JSON.parse(raw) : [1];
  });

  useEffect(() => {
    localStorage.setItem("sst_points", String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem("sst_unlockedLevels", JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  const addPoints = (n) => {
    console.log('🔍 ProgressProvider - addPoints llamado:', n); // ← LOG
    setPoints((p) => p + n);
  };
  
  const unlockLevel = (id) => {
    console.log('🔍 ProgressProvider - unlockLevel llamado:', id); // ← LOG
    setUnlockedLevels((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  
  const resetProgress = () => {
    setPoints(0);
    setUnlockedLevels([1]);
  };

  const value = {
    points,
    addPoints,
    unlockedLevels, 
    unlockLevel,
    resetProgress
  };

  console.log('🔍 ProgressProvider - value creado:', value); // ← LOG

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  console.log('🔍 useProgress - EJECUTANDO'); // ← LOG
  const context = useContext(ProgressContext);
  console.log('🔍 useProgress - contexto obtenido:', context); // ← LOG
  
  if (!context) {
    console.error('🔍 useProgress - ERROR: Contexto no disponible'); // ← LOG
    throw new Error("useProgress debe usarse dentro de ProgressProvider");
  }
  
  console.log('🔍 useProgress - RETORNANDO contexto'); // ← LOG
  return context;
};