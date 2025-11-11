import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../config/api';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({
    completedStages: 1,
    totalStages: 4,
    currentStage: 2,
    totalPoints: 1250,
    completedQuizzes: 3,
    unlockedLevels: [1] // ✅ AGREGAR ESTA PROPIEDAD FALTANTE
  });

  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgressFromBackend();
  }, []);

  const loadProgressFromBackend = async () => {
    try {
      setLoading(true);
      
      // ✅ CARGAR UNLOCKED LEVELS DESDE LOCALSTORAGE
      const savedUnlockedLevels = JSON.parse(localStorage.getItem('sst_unlockedLevels') || '[1]');
      
      // ✅ INTENTAR CARGAR ESTADÍSTICAS DEL USUARIO
      try {
        const statsResponse = await api.getUserStats();
        console.log('📊 Respuesta de getUserStats:', statsResponse);
        
        if (statsResponse.success && statsResponse.data) {
          const userStats = statsResponse.data;
          
          setProgress({
            completedStages: userStats.completedCategories || userStats.completedLevels || 1,
            totalStages: userStats.totalCategories || userStats.totalLevels || 3,
            currentStage: userStats.currentCategory || userStats.currentLevel || 1,
            totalPoints: userStats.totalPoints || userStats.points || 1250,
            completedQuizzes: userStats.completedQuizzes || userStats.quizzesCompleted || 3,
            unlockedLevels: savedUnlockedLevels // ✅ MANTENER UNLOCKED LEVELS
          });
          
          console.log('✅ Progreso cargado desde backend:', userStats);
        } else {
          console.log('❌ getUserStats no devolvió datos, usando locales');
          setProgress(prev => ({
            ...prev,
            unlockedLevels: savedUnlockedLevels
          }));
        }
      } catch (error) {
        console.log('🔶 Endpoint getUserStats no disponible, usando datos locales');
        setProgress(prev => ({
          ...prev,
          unlockedLevels: savedUnlockedLevels
        }));
      }
      
    } catch (error) {
      console.log('❌ Error general cargando progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AGREGAR FUNCIÓN PARA DESBLOQUEAR NIVELES
  const unlockLevel = (levelId) => {
    const newUnlockedLevels = [...new Set([...progress.unlockedLevels, levelId])];
    
    setProgress(prev => ({
      ...prev,
      unlockedLevels: newUnlockedLevels
    }));
    
    // Guardar en localStorage
    localStorage.setItem('sst_unlockedLevels', JSON.stringify(newUnlockedLevels));
    
    console.log(`🔓 Nivel ${levelId} desbloqueado. Niveles desbloqueados:`, newUnlockedLevels);
  };

  const addPoints = async (points) => {
    try {
      setProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points
      }));
      
      // ✅ OPCIONAL: Intentar sincronizar con backend
      try {
        // await api.updateUserPoints(points);
      } catch (error) {
        console.log('No se pudo sincronizar puntos con backend');
      }
      
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const completeStage = (stageId) => {
    setProgress(prev => ({
      ...prev,
      completedStages: prev.completedStages + 1,
      currentStage: stageId + 1
    }));
  };

  const addCompletedQuiz = async (quizData = null) => {
    try {
      setProgress(prev => ({
        ...prev,
        completedQuizzes: prev.completedQuizzes + 1
      }));
      
      if (quizData) {
        try {
          // await api.checkAnswer(quizData);
        } catch (error) {
          console.log('No se pudo registrar quiz en backend');
        }
      }
      
    } catch (error) {
      console.error('Error adding completed quiz:', error);
    }
  };

  const completeQuiz = async (quizId, score, totalQuestions) => {
    try {
      // Registrar quiz completado localmente
      await addCompletedQuiz({
        quizId: quizId,
        score: score,
        totalQuestions: totalQuestions,
        completedAt: new Date().toISOString()
      });
      
      // Calcular y agregar puntos
      const pointsEarned = Math.round((score / totalQuestions) * 100);
      await addPoints(pointsEarned);

      // ✅ DESBLOQUEAR SIGUIENTE NIVEL SI APROBÓ (70% o más)
      if (score / totalQuestions >= 0.7) {
        const currentLevel = parseInt(quizId);
        if (currentLevel < 3) { // Solo si no es el último nivel
          const nextLevel = currentLevel + 1;
          unlockLevel(nextLevel);
        }
      }

      // ✅ ENVIAR RESULTADOS AL BACKEND
      try {
        const submitResult = await api.submitQuiz(quizId, {
          score: score,
          totalQuestions: totalQuestions,
          percentage: Math.round((score / totalQuestions) * 100),
          completed: true
        });
        
        if (submitResult.success) {
          console.log('✅ Resultados enviados al backend');
          
          setTimeout(() => {
            loadProgressFromBackend();
          }, 1000);
        }
      } catch (error) {
        console.log('❌ No se pudieron enviar resultados al backend');
      }

      return { success: true, pointsEarned };
      
    } catch (error) {
      console.error('Error completing quiz:', error);
      return { success: false, message: 'Error al guardar resultados' };
    }
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      totalPoints: progress.totalPoints,
      completedQuizzes: progress.completedQuizzes,
      unlockedLevels: progress.unlockedLevels, // ✅ EXPORTAR UNLOCKED LEVELS
      quizHistory,
      loading,
      addPoints,
      completeStage,
      addCompletedQuiz,
      completeQuiz,
      unlockLevel, // ✅ EXPORTAR LA FUNCIÓN
      refreshProgress: loadProgressFromBackend
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