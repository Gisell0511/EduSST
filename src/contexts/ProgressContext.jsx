import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../config/api';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({
    completedStages: 1,
    totalStages: 4,
    currentStage: 2,
    totalPoints: 1250,
    completedQuizzes: 3
  });

  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Cargar progreso real del backend
    loadProgressFromBackend();
  }, []);

  const loadProgressFromBackend = async () => {
    try {
      setLoading(true);
      
      // ✅ INTENTAR CARGAR ESTADÍSTICAS DEL USUARIO
      try {
        const statsResponse = await api.getUserStats();
        console.log('📊 Respuesta de getUserStats:', statsResponse);
        
        if (statsResponse.success && statsResponse.data) {
          const userStats = statsResponse.data;
          
          // Adaptar según la estructura que devuelve tu backend
          setProgress({
            completedStages: userStats.completedCategories || userStats.completedLevels || 1,
            totalStages: userStats.totalCategories || userStats.totalLevels || 3,
            currentStage: userStats.currentCategory || userStats.currentLevel || 1,
            totalPoints: userStats.totalPoints || userStats.points || 1250,
            completedQuizzes: userStats.completedQuizzes || userStats.quizzesCompleted || 3
          });
          
          console.log('✅ Progreso cargado desde backend:', userStats);
        } else {
          console.log('❌ getUserStats no devolvió datos, usando locales');
        }
      } catch (error) {
        console.log('🔶 Endpoint getUserStats no disponible, usando datos locales');
      }

      // ✅ INTENTAR CARGAR PROGRESO POR CATEGORÍA (para niveles específicos)
      try {
        // Cargar progreso para cada categoría/nivel
        const categories = ['1', '2', '3']; // IDs de categorías básico, intermedio, avanzado
        let totalCompleted = 0;
        
        for (const categoryId of categories) {
          const progressResponse = await api.getUserProgress(categoryId);
          if (progressResponse.success && progressResponse.data) {
            const categoryProgress = progressResponse.data;
            if (categoryProgress.completed || categoryProgress.score >= 70) {
              totalCompleted++;
            }
          }
        }
        
        // Actualizar progreso general basado en categorías completadas
        setProgress(prev => ({
          ...prev,
          completedStages: totalCompleted,
          totalStages: categories.length
        }));
        
      } catch (error) {
        console.log('🔶 Endpoints de progreso por categoría no disponibles');
      }
      
    } catch (error) {
      console.log('❌ Error general cargando progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points) => {
    try {
      setProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points
      }));
      
      // ✅ OPCIONAL: Intentar sincronizar con backend
      try {
        // Podrías llamar a un endpoint para actualizar puntos si existe
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
      
      // ✅ OPCIONAL: Intentar registrar en backend
      if (quizData) {
        try {
          // Podrías usar check-answer o otro endpoint para registrar el quiz completado
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
          
          // Recargar progreso actualizado
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
      quizHistory,
      loading,
      addPoints,
      completeStage,
      addCompletedQuiz,
      completeQuiz,
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