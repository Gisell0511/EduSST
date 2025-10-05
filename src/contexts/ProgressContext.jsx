import React, { createContext, useState, useContext } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({
    completedStages: 1,
    totalStages: 4,
    currentStage: 2,
    totalPoints: 1250,
    completedQuizzes: 3
  });

  const addPoints = (points) => {
    setProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  const completeStage = (stageId) => {
    setProgress(prev => ({
      ...prev,
      completedStages: prev.completedStages + 1,
      currentStage: stageId + 1
    }));
  };

  const addCompletedQuiz = () => {
    setProgress(prev => ({
      ...prev,
      completedQuizzes: prev.completedQuizzes + 1
    }));
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      totalPoints: progress.totalPoints,
      completedQuizzes: progress.completedQuizzes,
      addPoints,
      completeStage,
      addCompletedQuiz
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

export { ProgressContext };