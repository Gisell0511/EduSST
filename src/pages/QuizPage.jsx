import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../components/Quiz/Timer";
import StageIndicator from "../components/Quiz/StageIndicator";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuizQuestion from "../components/Quiz/QuizQuestion";
import QuizModal from "../components/Quiz/QuizModal";
import { api } from "../config/api";
import { quizAdapter } from '../utils/quizAdapter';

// === HOOK SIMPLE QUE SIEMPRE FUNCIONA ===
const useProgressSimple = () => {
  console.log('🔧 useProgressSimple - INICIANDO');
  
  const points = parseInt(localStorage.getItem('sst_points') || '0');
  const unlockedLevels = JSON.parse(localStorage.getItem('sst_unlockedLevels') || '[1]');
  
  const addPoints = (pointsToAdd) => {
    const newPoints = points + pointsToAdd;
    localStorage.setItem('sst_points', String(newPoints));
    console.log(`⭐ [SIMPLE] Agregando ${pointsToAdd} puntos. Total: ${newPoints}`);
  };
  
  const unlockLevel = (levelId) => {
    const currentLevels = JSON.parse(localStorage.getItem('sst_unlockedLevels') || '[1]');
    if (!currentLevels.includes(levelId)) {
      const newLevels = [...currentLevels, levelId];
      localStorage.setItem('sst_unlockedLevels', JSON.stringify(newLevels));
      console.log(`🔓 [SIMPLE] Nivel ${levelId} desbloqueado. Niveles: ${newLevels}`);
    } else {
      console.log(`ℹ️ [SIMPLE] Nivel ${levelId} ya estaba desbloqueado`);
    }
  };
  
  const resetProgress = () => {
    localStorage.setItem('sst_points', '0');
    localStorage.setItem('sst_unlockedLevels', '[1]');
  };

  return { 
    points, 
    addPoints, 
    unlockedLevels, 
    unlockLevel, 
    resetProgress 
  };
};

// Agrega esta función ANTES del componente QuizPage
const mapLevelToCategories = (level) => {
  // Mapeo de niveles (1,2,3) a rangos de categorías
  const levelRanges = {
    1: [1, 2, 3, 4, 5],    // Básico: categorías 1-5
    2: [6, 7, 8, 9, 10],   // Intermedio: categorías 6-10  
    3: [11, 12, 13, 14, 15] // Avanzado: categorías 11-15
  };
  
  const categories = levelRanges[level] || [1];
  // Seleccionar una categoría aleatoria del nivel
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  console.log(`🎯 Mapeando nivel ${level} a categorías:`, categories);
  console.log(`🎯 Categoría seleccionada: ${randomCategory}`);
  
  return randomCategory;
};

export default function QuizPage() {
  const { level } = useParams();
  const navigate = useNavigate();
  
  // USA EL HOOK SIMPLE - ESTO SIEMPRE FUNCIONA
  const { points, addPoints, unlockedLevels, unlockLevel } = useProgressSimple();
  
  console.log('✅ useProgressSimple - Points:', points);
  console.log('✅ useProgressSimple - UnlockedLevels:', unlockedLevels);
  console.log('✅ useProgressSimple - unlockLevel tipo:', typeof unlockLevel);
  console.log('✅ useProgressSimple - addPoints tipo:', typeof addPoints);

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stage, setStage] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const completeQuizAttempt = useCallback(async () => {
  // VERIFICACIONES DE SEGURIDAD MEJORADAS
  if (!currentQuiz) {
    console.error('❌ No hay currentQuiz - el quiz no se cargó correctamente');
    setError('Error: El quiz no se cargó correctamente. Por favor recarga la página.');
    return;
  }
  
  // Verificar que el quiz tenga preguntas
  if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
    console.error('❌ El quiz no tiene preguntas');
    setError('Error: El quiz no tiene preguntas disponibles.');
    return;
  }
  
  // Verificar que userAnswers tenga la longitud correcta
  if (userAnswers.length !== currentQuiz.questions.length) {
    console.error('❌ userAnswers no coincide con las preguntas del quiz');
    setError('Error: Hay un problema con las respuestas. Por favor recarga la página.');
    return;
  }
  
  try {
    console.log('🎯 Iniciando completeQuizAttempt...');
    console.log(`📊 Preguntas en quiz: ${currentQuiz.questions.length}`);
    console.log(`📊 Respuestas en array: ${userAnswers.length}`);
    
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    console.log(`📊 Respuestas válidas encontradas: ${answeredCount}`);
    
    if (answeredCount === 0) {
      console.log('❌ No hay respuestas, cancelando envío');
      setError('Por favor responde al menos una pregunta antes de terminar el quiz.');
      return;
    }

    // PREPARAR RESPUESTAS CON VALIDACIÓN
    const answers = currentQuiz.questions
      .map((question, index) => {
        // Verificar que la pregunta existe
        if (!question || !question.id) {
          console.warn(`⚠️ Pregunta en índice ${index} no válida`);
          return null;
        }
        
        return {
          questionId: question.id,
          userAnswer: userAnswers[index] // Puede ser null (no respondida)
        };
      })
      .filter(answer => answer !== null && answer.userAnswer !== null); // Solo respuestas válidas

    console.log('📤 Respuestas a enviar:', answers);
    console.log(`📤 Total respuestas válidas: ${answers.length}`);

    if (answers.length === 0) {
      console.log('❌ No hay respuestas válidas después del filtrado');
      setError('No se encontraron respuestas válidas para enviar.');
      return;
    }

    const quizId = currentQuiz.id;
    
    console.log('🚀 Enviando al backend...');
    const result = await api.submitQuiz(quizId, answers);
    
    console.log('✅ Resultado recibido:', result);
    setQuizResult(result);
    setIsQuizCompleted(true);
    
    // LÓGICA DEL MODAL MEJORADA
    const totalQuestions = result.totalQuestions || currentQuiz.questions.length;
    const correctAnswers = result.correctAnswers || 0;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const levelNames = {
      '1': 'Básico',
      '2': 'Intermedio', 
      '3': 'Avanzado'
    };

    let title, message, canAdvance;
    
    if (percentage >= 70) {
      title = '🎉 ¡Nivel Completado!';
      message = `Has aprobado el nivel ${levelNames[level]} con ${percentage}% (${correctAnswers}/${totalQuestions} correctas)`;
      canAdvance = level !== '3';
      
      // ESTAS FUNCIONES AHORA SIEMPRE EXISTEN
      if (level !== '3') {
        const nextLevel = parseInt(level) + 1;
        console.log(`🔓 Desbloqueando nivel ${nextLevel}...`);
        unlockLevel(nextLevel);
      }
      
      console.log(`⭐ Agregando 50 puntos...`);
      addPoints(50);
    } else {
      title = '📚 Sigue Practicando';
      message = `Obtuviste ${percentage}% (${correctAnswers}/${totalQuestions} correctas) - Necesitas 70% para aprobar`;
      canAdvance = false;
    }

    setModalConfig({
      type: 'results',
      title,
      message,
      showClose: true,
      score: correctAnswers,
      total: totalQuestions,
      percentage: percentage,
      canAdvance: canAdvance,
      level: level,
      onClose: () => {
        setShowModal(false);
        navigate('/');
      },
      onRetry: () => {
        setShowModal(false);
        resetQuiz();
      },
      onAdvance: canAdvance ? () => {
        setShowModal(false);
        const nextLevel = parseInt(level) + 1;
        navigate(`/quiz/${nextLevel}`);
      } : undefined
    });
    setShowModal(true);
    
  } catch (error) {
    console.error('❌ Error en completeQuizAttempt:', error);
    
    // MANEJO DE ERROR MEJORADO
    let errorMessage = 'Error al enviar el quiz: ' + error.message;
    
    // Calcular resultado local como fallback
    try {
      const correctCount = userAnswers.filter((answer, index) => {
        if (!currentQuiz.questions[index]) return false;
        return answer === currentQuiz.questions[index]?.correct_answer;
      }).length;
      
      const totalQuestions = currentQuiz.questions.length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      
      errorMessage += ` | Resultado local: ${correctCount}/${totalQuestions} correctas (${percentage}%)`;
      
      setModalConfig({
        type: 'results',
        title: percentage >= 70 ? '🎉 ¡Nivel Completado!' : '📚 Sigue Practicando',
        message: `Hubo un error pero aquí está tu resultado local: ${correctCount}/${totalQuestions} correctas (${percentage}%)`,
        showClose: true,
        score: correctCount,
        total: totalQuestions,
        percentage: percentage,
        canAdvance: percentage >= 70 && level !== '3',
        level: level,
        onClose: () => {
          setShowModal(false);
          navigate('/');
        },
        onRetry: () => {
          setShowModal(false);
          resetQuiz();
        },
        onAdvance: percentage >= 70 && level !== '3' ? () => {
          setShowModal(false);
          const nextLevel = parseInt(level) + 1;
          navigate(`/quiz/${nextLevel}`);
        } : undefined
      });
      setShowModal(true);
      
    } catch (fallbackError) {
      console.error('❌ Error en el fallback también:', fallbackError);
      setError(errorMessage);
    }
  }
}, [currentQuiz, userAnswers, level, navigate, unlockLevel, addPoints]);

  const handleAnswer = useCallback((selectedLetter) => {
  if (!currentQuiz) {
    console.error('❌ No hay quiz cargado');
    return;
  }
  
  console.log(`✅ Respuesta: Pregunta ${currentQuestion + 1} = ${selectedLetter}`);
  console.log(`📊 Progreso actual: ${currentQuestion + 1}/${currentQuiz.questions.length}`);

  // ACTUALIZAR RESPUESTAS
  const newAnswers = [...userAnswers];
  newAnswers[currentQuestion] = selectedLetter;
  setUserAnswers(newAnswers);
  setError(null);

  // VERIFICAR SI ES LA ÚLTIMA PREGUNTA
  const isLastQuestion = currentQuestion + 1 >= currentQuiz.questions.length;
  console.log(`🔍 ¿Es última pregunta?: ${isLastQuestion}`);

  if (!isLastQuestion) {
    console.log('➡️ Avanzando a siguiente pregunta...');
    
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      const nextStage = Math.floor(nextQuestion / 3) + 1;
      
      console.log(`🎯 Nuevos valores: pregunta ${nextQuestion + 1}, etapa ${nextStage}`);
      
      // ACTUALIZAR ESTADOS
      setCurrentQuestion(nextQuestion);
      if (nextStage !== stage) {
        setStage(nextStage);
      }
    }, 500);
  } else {
    console.log('🏁 ÚLTIMA PREGUNTA - Mostrando botón manual');
  }
}, [currentQuiz, currentQuestion, userAnswers, stage]);

  const handleTimeUp = useCallback(() => {
    console.log('⏰ Tiempo agotado para pregunta', currentQuestion + 1);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = null;
    setUserAnswers(newAnswers);

    console.log(`📊 Respuestas después de tiempo: ${newAnswers.filter(a => a !== null).length}/${newAnswers.length}`);

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      console.log('➡️ Avanzando a siguiente pregunta...');
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        if ((currentQuestion + 1) % 3 === 0) {
          setStage(prev => prev + 1);
        }
      }, 1000);
    } else {
      console.log('🏁 Última pregunta - Tiempo agotado, MOSTRANDO BOTÓN MANUAL');
    }
  }, [currentQuiz, currentQuestion, userAnswers]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setStage(1);
    setIsQuizCompleted(false);
    setQuizResult(null);
    setShowModal(false);
    setError(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (level) {
      loadQuizFromBackend(level);
    } else {
      setError('No se especificó un nivel');
      setLoading(false);
    }
  }, [level]);

  const loadQuizFromBackend = async (levelId) => {
  try {
    console.log('🔄 [NUEVO QUIZ] Cargando nivel:', levelId);
    
    // ✅ CONVERTIR NIVEL A CATEGORÍA
    const categoryId = mapLevelToCategories(parseInt(levelId));
    console.log(`🎯 [FRONTEND] Nivel ${levelId} → Categoría ${categoryId}`);
    
    // RESETEAR ESTADOS ANTES DE CARGAR
    setLoading(true);
    setError(null);
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setStage(1);
    setUserAnswers([]);
    setShowModal(false);
    setIsQuizCompleted(false);
    setQuizResult(null);

    console.log('🎯 [FRONTEND] Estados reseteados - Iniciando carga...');
    
    // ✅ PASO 1: Llamar al API CON LA CATEGORÍA CORRECTA
    const quizzesData = await api.getQuizzesByCategory(categoryId);
    console.log('📦 [FRONTEND] Respuesta CRUDA del backend:', quizzesData);
    console.log('🔍 [FRONTEND] Tipo de datos:', typeof quizzesData);
    console.log('🔍 [FRONTEND] Es array?:', Array.isArray(quizzesData));
    
    if (Array.isArray(quizzesData)) {
      console.log('🔍 [FRONTEND] Número de preguntas recibidas:', quizzesData.length);
      
      if (quizzesData.length > 0) {
        console.log('🔍 [FRONTEND] Primera pregunta:', quizzesData[0]);
      } else {
        console.warn('⚠️ [FRONTEND] Array VACÍO - No hay preguntas para esta categoría');
      }
    }
    
    // PASO 2: Procesar con el adaptador
    if (Array.isArray(quizzesData) && quizzesData.length > 0) {
      console.log('🔄 [FRONTEND] Pasando datos al adaptador...');
      const adaptedQuestions = quizAdapter.adaptQuizzes(quizzesData);
      
      const adaptedQuiz = {
        id: categoryId, // ← Usar categoryId en lugar de levelId
        title: `Quiz ${levelId === '1' ? 'Básico' : levelId === '2' ? 'Intermedio' : 'Avanzado'}`,
        questions: adaptedQuestions,
        totalQuestions: quizzesData.length
      };
      
      console.log('🔄 [FRONTEND] Quiz adaptado completo:', adaptedQuiz);
      
      if (adaptedQuiz && adaptedQuiz.questions.length > 0) {
        setCurrentQuiz(adaptedQuiz);
        setUserAnswers(new Array(adaptedQuiz.questions.length).fill(null));
        
        console.log('✅ [FRONTEND] Quiz cargado exitosamente');
        console.log('📊 [FRONTEND] Estado final:', {
          nivel: levelId,
          categoria: categoryId,
          preguntasTotales: adaptedQuiz.questions.length
        });
      } else {
        const errorMsg = 'El adaptador no pudo procesar los datos del quiz';
        console.error('❌ [FRONTEND]', errorMsg);
        setError(errorMsg);
      }
    } else {
      const errorMsg = `No se encontraron quizzes para el nivel ${levelId} (categoría ${categoryId})`;
      console.error('❌ [FRONTEND]', errorMsg);
      setError(errorMsg);
    }
    
  } catch (error) {
    console.error('❌ [FRONTEND] Error de conexión:', error);
    setError(`Error de conexión: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando nivel {level} desde el servidor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error al cargar el quiz</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => loadQuizFromBackend(level)} className="btn btn-primary">
                Reintentar
              </button>
              <button onClick={() => navigate('/')} className="btn btn-outline">
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="empty-state">
            <i className="fas fa-gamepad"></i>
            <h3>Quiz vacío</h3>
            <p>El quiz no contiene preguntas o no está configurado correctamente.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-header-top">
            <h2>{currentQuiz?.title || `Quiz Nivel ${level}`}</h2>
            <div className="quiz-level-badge">
              {level === '1' ? 'Básico' : level === '2' ? 'Intermedio' : 'Avanzado'}
            </div>
          </div>
          <div className="points-display">
            <i className="fas fa-star"></i>
            <span>{points} puntos</span>
          </div>
        </div>

        <StageIndicator stage={stage} totalStages={Math.ceil(currentQuiz?.questions?.length / 3) || 1} />
        <Timer 
          duration={30} 
          onTimeUp={handleTimeUp} 
          currentQuestion={currentQuestion}
          isLastQuestion={currentQuestion === currentQuiz?.questions?.length - 1}
        />
        <ProgressBar current={currentQuestion + 1} total={currentQuiz?.questions?.length || 1} />
        
        {error && (
          <div style={{ 
            padding: '12px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="quiz-content">
          {currentQuiz && currentQuiz.questions && (
            <QuizQuestion 
              question={currentQuiz.questions[currentQuestion]} 
              onAnswer={handleAnswer} 
              selectedAnswer={userAnswers[currentQuestion]}
            />
          )}

          {/* Botón para enviar manualmente */}
          {currentQuestion === currentQuiz?.questions?.length - 1 && (
            <div className="quiz-actions" style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const answeredCount = userAnswers.filter(answer => answer !== null).length;
                  console.log('🎯 Botón presionado - Respuestas:', answeredCount);
                  
                  if (answeredCount === 0) {
                    alert('Por favor responde al menos una pregunta antes de terminar el quiz.');
                    return;
                  }
                  completeQuizAttempt();
                }}
                style={{ 
                  padding: '12px 24px',
                  fontSize: '1.1rem',
                  minWidth: '200px'
                }}
              >
                🏁 Terminar Quiz 
                <br />
                <small style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  ({userAnswers.filter(answer => answer !== null).length}/{userAnswers.length} respondidas)
                </small>
              </button>
              
              {userAnswers.filter(answer => answer !== null).length === 0 && (
                <div style={{ 
                  marginTop: '10px', 
                  color: '#ef4444', 
                  fontSize: '0.9rem',
                  padding: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px'
                }}>
                  ⚠️ Debes responder al menos una pregunta
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <QuizModal 
          {...modalConfig}
          onClose={handleModalClose}
          onContinue={modalConfig.onRetry ? undefined : handleModalClose}
        />
      )}
    </div>
  );
}