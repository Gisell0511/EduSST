import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../components/Quiz/Timer";
import StageIndicator from "../components/Quiz/StageIndicator";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuizQuestion from "../components/Quiz/QuizQuestion";
import QuizModal from "../components/Quiz/QuizModal";
import { api } from "../config/api";
import { useProgress } from "../contexts/ProgressContext";
import { quizAdapter } from '../utils/quizAdapter';

export default function QuizPage() {
  const { level } = useParams();
  const navigate = useNavigate();
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
  
  const { points, addPoints, unlockedLevels, unlockLevel } = useProgress();

  // Función para mostrar resultados SIN dependencias circulares
  const showResultsModal = useCallback((finalScore, totalQuestions, correctAnswers) => {
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
      
      if (level !== '3') {
        const nextLevel = parseInt(level) + 1;
        if (!unlockedLevels.includes(nextLevel)) {
          unlockLevel(nextLevel);
          console.log(`🔓 Nivel ${nextLevel} desbloqueado!`);
        }
      }
      
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
  }, [level, navigate, unlockedLevels, unlockLevel, addPoints]);

  // completeQuizAttempt SIN dependencia de showResultsModal
  const completeQuizAttempt = useCallback(async () => {
    if (!currentQuiz) {
      console.error('❌ No hay currentQuiz');
      return;
    }
    
    try {
      console.log('🎯 Iniciando completeQuizAttempt...');
      
      const answeredCount = userAnswers.filter(answer => answer !== null).length;
      console.log(`📊 Respuestas válidas encontradas: ${answeredCount}`);
      
      if (answeredCount === 0) {
        console.log('❌ No hay respuestas, cancelando envío');
        setError('Por favor responde al menos una pregunta antes de terminar el quiz.');
        return;
      }

      const answers = currentQuiz.questions.map((question, index) => ({
        questionId: question.id,
        userAnswer: userAnswers[index]
      })).filter(answer => answer.userAnswer !== null);

      console.log('📤 Respuestas a enviar:', answers);

      const quizId = currentQuiz.id;
      
      console.log('🚀 Enviando al backend...');
      const result = await api.submitQuiz(quizId, answers);
      
      console.log('✅ Resultado recibido:', result);
      setQuizResult(result);
      setIsQuizCompleted(true);
      
      // Llamar a showResultsModal directamente (sin dependencia)
      const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
      const levelNames = {
        '1': 'Básico',
        '2': 'Intermedio', 
        '3': 'Avanzado'
      };

      let title, message, canAdvance;
      
      if (percentage >= 70) {
        title = '🎉 ¡Nivel Completado!';
        message = `Has aprobado el nivel ${levelNames[level]} con ${percentage}% (${result.correctAnswers}/${result.totalQuestions} correctas)`;
        canAdvance = level !== '3';
        
        if (level !== '3') {
          const nextLevel = parseInt(level) + 1;
          if (!unlockedLevels.includes(nextLevel)) {
            unlockLevel(nextLevel);
            console.log(`🔓 Nivel ${nextLevel} desbloqueado!`);
          }
        }
        
        addPoints(50);
      } else {
        title = '📚 Sigue Practicando';
        message = `Obtuviste ${percentage}% (${result.correctAnswers}/${result.totalQuestions} correctas) - Necesitas 70% para aprobar`;
        canAdvance = false;
      }

      setModalConfig({
        type: 'results',
        title,
        message,
        showClose: true,
        score: result.correctAnswers,
        total: result.totalQuestions,
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
      setError('Error al enviar el quiz: ' + error.message);
      
      // Manejo de error - mostrar resultados locales
      const answeredCount = userAnswers.filter(answer => answer !== null).length;
      const correctCount = userAnswers.filter((answer, index) => 
        answer === currentQuiz.questions[index]?.correct_answer
      ).length;
      
      const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);
      const levelNames = {
        '1': 'Básico',
        '2': 'Intermedio', 
        '3': 'Avanzado'
      };

      let title, message, canAdvance;
      
      if (percentage >= 70) {
        title = '🎉 ¡Nivel Completado!';
        message = `Has aprobado el nivel ${levelNames[level]} con ${percentage}% (${correctCount}/${currentQuiz.questions.length} correctas)`;
        canAdvance = level !== '3';
        
        if (level !== '3') {
          const nextLevel = parseInt(level) + 1;
          if (!unlockedLevels.includes(nextLevel)) {
            unlockLevel(nextLevel);
          }
        }
        
        addPoints(50);
      } else {
        title = '📚 Sigue Practicando';
        message = `Obtuviste ${percentage}% (${correctCount}/${currentQuiz.questions.length} correctas) - Necesitas 70% para aprobar`;
        canAdvance = false;
      }

      setModalConfig({
        type: 'results',
        title,
        message,
        showClose: true,
        score: correctCount,
        total: currentQuiz.questions.length,
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
    }
  }, [currentQuiz, userAnswers, level, navigate, unlockedLevels, unlockLevel, addPoints]);

  // Resto de funciones...
  const handleAnswer = useCallback((selectedLetter) => {
    if (!currentQuiz) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedLetter;
    setUserAnswers(newAnswers);

    console.log(`✅ Respuesta guardada: Pregunta ${currentQuestion + 1} = ${selectedLetter}`);

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        if ((currentQuestion + 1) % 3 === 0) {
          setStage(prev => prev + 1);
        }
      }, 500);
    } else {
      const answeredCount = newAnswers.filter(answer => answer !== null).length;
      console.log(`📊 Total de respuestas: ${answeredCount}/${newAnswers.length}`);
      
      if (answeredCount === 0) {
        console.log('⚠️ No hay respuestas, mostrando alerta...');
        alert('Por favor responde al menos una pregunta');
        return;
      }
      
      setTimeout(() => {
        completeQuizAttempt();
      }, 500);
    }
  }, [currentQuiz, currentQuestion, userAnswers, completeQuizAttempt]);

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

  const loadQuizFromBackend = async (categoryId) => {
  try {
    setLoading(true);
    setError(null);
    setUserAnswers([]);
    
    console.log('🎯 PASO 1 - Solicitando quizzes para categoría:', categoryId);
    
    const quizzesData = await api.getQuizzesByCategory(categoryId);
    console.log('📦 PASO 1.2 - Respuesta CRUDA del backend:', quizzesData);
    
    console.log('🔍 PASO 1.3 - Tipo de datos:', typeof quizzesData);
    console.log('🔍 PASO 1.3 - Es array?:', Array.isArray(quizzesData));
    
    if (Array.isArray(quizzesData)) {
      console.log('🔍 PASO 1.4 - Número de preguntas:', quizzesData.length);
      if (quizzesData.length > 0) {
        console.log('🔍 PASO 1.5 - Primera pregunta completa:', quizzesData[0]);
        console.log('🔍 PASO 1.6 - Keys de la primera pregunta:', Object.keys(quizzesData[0]));
        console.log('🔍 PASO 1.7 - Tiene options?:', 'options' in quizzesData[0]);
        
        // 👇 NUEVO: Ver el CONTENIDO de options
        console.log('🔍 PASO 1.8 - Contenido de options:', quizzesData[0].options);
        console.log('🔍 PASO 1.9 - Tipo de options:', typeof quizzesData[0].options);
        console.log('🔍 PASO 1.10 - Es array options?:', Array.isArray(quizzesData[0].options));
        if (Array.isArray(quizzesData[0].options)) {
          console.log('🔍 PASO 1.11 - Número de opciones:', quizzesData[0].options.length);
          console.log('🔍 PASO 1.12 - Primera opción:', quizzesData[0].options[0]);
        }
      }
    }
    
    // Continuar con el proceso normal...
    if (Array.isArray(quizzesData) && quizzesData.length > 0) {
      const adaptedQuiz = {
        id: categoryId,
        title: `Quiz Nivel ${categoryId}`,
        questions: quizAdapter.adaptQuizzes(quizzesData),
        totalQuestions: quizzesData.length
      };
      
      console.log('🔄 PASO 1.13 - Quiz después del adaptador:', adaptedQuiz);
      console.log('🔍 PASO 1.14 - Primera pregunta adaptada:', adaptedQuiz.questions[0]);
      console.log('🔍 PASO 1.15 - Opciones de la primera pregunta adaptada:', adaptedQuiz.questions[0]?.options);
      
      if (adaptedQuiz && adaptedQuiz.questions.length > 0) {
        setCurrentQuiz(adaptedQuiz);
        setUserAnswers(new Array(adaptedQuiz.questions.length).fill(null));
      } else {
        setError('El adaptador no pudo procesar los datos del quiz');
      }
    } else {
      setError('No se pudieron cargar los quizzes o el array está vacío');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    setError(`Error de conexión: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // ... (el resto del código de renderizado se mantiene igual)

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
          currentQuestion={currentQuestion} // ← Prop agregada
        />
        <ProgressBar current={currentQuestion + 1} total={currentQuiz?.questions?.length || 1} />
        
        <div className="quiz-content">
          {currentQuiz && currentQuiz.questions && (
            <QuizQuestion 
              question={currentQuiz.questions[currentQuestion]} 
              onAnswer={handleAnswer} 
              selectedAnswer={userAnswers[currentQuestion]}
            />
          )}
  
          {/* Botón para enviar manualmente - MEJORADO */}
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