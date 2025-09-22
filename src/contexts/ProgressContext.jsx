import { createContext, useState, useEffect } from "react";

// Creamos el contexto
export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({
    materialsViewed: [],   // IDs de materiales que ya vio
    quizzesCompleted: {},  // { quizId: score }
    percentage: 0,         // % de avance total
  });

  // Ejemplo: cargar progreso guardado en localStorage o API
  useEffect(() => {
    const stored = localStorage.getItem("progress");
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  // Funciones para actualizar el progreso
  const markMaterialAsViewed = (materialId) => {
    if (!progress.materialsViewed.includes(materialId)) {
      setProgress((prev) => ({
        ...prev,
        materialsViewed: [...prev.materialsViewed, materialId],
      }));
    }
  };

  const completeQuiz = (quizId, score) => {
    setProgress((prev) => ({
      ...prev,
      quizzesCompleted: { ...prev.quizzesCompleted, [quizId]: score },
    }));
  };

  return (
    <ProgressContext.Provider
      value={{ progress, markMaterialAsViewed, completeQuiz }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
