import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../components/Quiz/Timer";
import StageIndicator from "../components/Quiz/StageIndicator";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuizQuestion from "../components/Quiz/QuizQuestion";
import QuizModal from "../components/Quiz/QuizModal";
import { api } from "../config/api";
import { useProgress } from "../contexts/ProgressContext";
import { adaptBackendQuiz } from "../utils/quizAdapter";

export default function QuizPage() {
  const { level } = useParams();
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ Usar tu ProgressContext actual
  const { points, addPoints, unlockedLevels, unlockLevel } = useProgress();

  // ✅ showResultsModal primero
  const showResultsModal = useCallback((finalScore, totalQuestions, percentage) => {
    const levelNames = {
      '1': 'Básico',
      '2': 'Intermedio', 
      '3': 'Avanzado'
    };

    let title, message, canAdvance;
    
    if (percentage >= 70) {
      title = '🎉 ¡Nivel Completado!';
      message = `Has aprobado el nivel ${levelNames[level]} con ${percentage}%`;
      canAdvance = level !== '3';
      
      // ✅ Desbloquear siguiente nivel si se aprueba
      if (level !== '3') {
        const nextLevel = parseInt(level) + 1;
        if (!unlockedLevels.includes(nextLevel)) {
          unlockLevel(nextLevel);
          console.log(`🔓 Nivel ${nextLevel} desbloqueado!`);
        }
      }
    } else {
      title = '📚 Sigue Practicando';
      message = `Obtuviste ${percentage}% - Necesitas 70% para aprobar`;
      canAdvance = false;
    }

    setModalConfig({
      type: 'results',
      title,
      message,
      showClose: true,
      score: finalScore,
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
  }, [level, navigate, unlockedLevels, unlockLevel]);

  // ✅ completeQuizAttempt simplificado
  const completeQuizAttempt = useCallback(async () => {
    if (!currentQuiz) return;
    
    const finalScore = score;
    const totalQuestions = currentQuiz.questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    try {
      // ✅ Intentar enviar resultados al backend (opcional)
      const result = await api.submitQuiz(currentQuiz.id, {
        score: finalScore,
        totalQuestions: totalQuestions,
        percentage: percentage
      });

      if (result.success) {
        console.log('✅ Resultados procesados:', result.message);
      }

      // ✅ Mostrar resultados
      showResultsModal(finalScore, totalQuestions, percentage);
    } catch (error) {
      console.error('Error en completeQuizAttempt:', error);
      // ✅ Continuar incluso si hay error
      showResultsModal(finalScore, totalQuestions, percentage);
    }
  }, [currentQuiz, score, showResultsModal]);

  const showFeedbackModal = useCallback((type, title, message) => {
    setModalConfig({
      type,
      title,
      message,
      showClose: false,
      onClose: () => setShowModal(false)
    });
    setShowModal(true);
  }, []);

  const handleAnswer = useCallback(async (isCorrect) => {
    if (!currentQuiz) return;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showFeedbackModal('correct', '¡Respuesta Correcta!', 'Has ganado 10 puntos.');
      // ✅ Sumar puntos usando tu contexto
      await addPoints(10);
    } else {
      showFeedbackModal('incorrect', 'Respuesta Incorrecta', 'Sigue practicando.');
    }

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        if ((currentQuestion + 1) % 3 === 0) {
          setStage(prev => prev + 1);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        completeQuizAttempt();
      }, 1500);
    }
  }, [currentQuiz, currentQuestion, showFeedbackModal, addPoints, completeQuizAttempt]);

  const handleTimeUp = useCallback(() => {
    showFeedbackModal('timeup', '⏰ Tiempo Agotado', 'El tiempo ha terminado para esta pregunta.');
    setTimeout(() => {
      handleAnswer(false);
    }, 2000);
  }, [showFeedbackModal, handleAnswer]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setStage(1);
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
      
      console.log('🎯 Cargando quizzes para categoría ID:', categoryId);
      
      const response = await api.getQuizzesByCategory(categoryId);
      console.log('📦 Respuesta completa del backend:', response);
      
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const adaptedQuiz = adaptBackendQuiz(response.data, categoryId);
        console.log('🔄 Quiz adaptado:', adaptedQuiz);
        
        if (adaptedQuiz && adaptedQuiz.questions.length > 0) {
          setCurrentQuiz(adaptedQuiz);
        } else {
          setError('El adaptador no pudo procesar los datos del quiz');
        }
      } else {
        setError(response.message || 'No se pudieron cargar los quizzes');
      }
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
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
            <h2>{currentQuiz.title || `Quiz Nivel ${level}`}</h2>
            <div className="quiz-level-badge">
              {level === '1' ? 'Básico' : level === '2' ? 'Intermedio' : 'Avanzado'}
            </div>
          </div>
          <div className="points-display">
            <i className="fas fa-star"></i>
            <span>{points} puntos</span>
          </div>
        </div>

        <StageIndicator stage={stage} totalStages={Math.ceil(currentQuiz.questions.length / 3)} />
        <Timer duration={30} onTimeUp={handleTimeUp} />
        <ProgressBar current={currentQuestion + 1} total={currentQuiz.questions.length} />
        
        <div className="quiz-content">
          <QuizQuestion 
            question={currentQuiz.questions[currentQuestion]} 
            onAnswer={handleAnswer} 
          />
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