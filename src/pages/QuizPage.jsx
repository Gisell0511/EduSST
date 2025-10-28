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
  const [userAnswers, setUserAnswers] = useState([]); // ← NUEVO: almacenar respuestas
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false); // ← NUEVO
  const [quizResult, setQuizResult] = useState(null); // ← NUEVO
  
  const { points, addPoints, unlockedLevels, unlockLevel } = useProgress();

  // NUEVA FUNCIÓN: Manejar respuesta del usuario
  const handleAnswer = useCallback((selectedLetter) => {
    if (!currentQuiz) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedLetter; // Guardar la letra seleccionada
    setUserAnswers(newAnswers);

    // Avanzar a la siguiente pregunta o terminar quiz
    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        if ((currentQuestion + 1) % 3 === 0) {
          setStage(prev => prev + 1);
        }
      }, 500);
    } else {
      // Última pregunta respondida, completar quiz
      setTimeout(() => {
        completeQuizAttempt();
      }, 500);
    }
  }, [currentQuiz, currentQuestion, userAnswers]);

  // NUEVA FUNCIÓN: Completar el intento del quiz
  const completeQuizAttempt = useCallback(async () => {
    if (!currentQuiz) return;
    
    try {
      console.log('🎯 Enviando respuestas al backend:', userAnswers);
      
      // Preparar respuestas para el backend
      const answers = currentQuiz.questions.map((question, index) => ({
        questionId: question.id,
        userAnswer: userAnswers[index] || null // La letra seleccionada (a, b, c, d)
      }));

      // Filtrar solo las preguntas respondidas
      const answeredQuestions = answers.filter(answer => answer.userAnswer !== null);
      
      if (answeredQuestions.length === 0) {
        alert('Por favor responde al menos una pregunta');
        return;
      }

      // Usar el primer quizId como identificador del conjunto
      const quizId = currentQuiz.id;
      
      console.log('📤 Enviando al backend:', { quizId, answers: answeredQuestions });
      const result = await api.submitQuiz(quizId, answeredQuestions);
      
      console.log('✅ Resultado del quiz:', result);
      setQuizResult(result);
      setIsQuizCompleted(true);
      
      // Mostrar resultados
      showResultsModal(result.score, result.totalQuestions, result.correctAnswers);
      
    } catch (error) {
      console.error('❌ Error enviando quiz:', error);
      setError('Error al enviar el quiz: ' + error.message);
    }
  }, [currentQuiz, userAnswers]);

  // MODIFICADA: Función de resultados
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
      
      // Dar puntos por aprobar
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

  const handleTimeUp = useCallback(() => {
    // Cuando se acaba el tiempo, registrar como no respondida y avanzar
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = null;
    setUserAnswers(newAnswers);

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(prev => prev + 1);
      if ((currentQuestion + 1) % 3 === 0) {
        setStage(prev => prev + 1);
      }
    } else {
      completeQuizAttempt();
    }
  }, [currentQuiz, currentQuestion, userAnswers, completeQuizAttempt]);

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
        <Timer duration={30} onTimeUp={handleTimeUp} />
        <ProgressBar current={currentQuestion + 1} total={currentQuiz?.questions?.length || 1} />
        
        <div className="quiz-content">
          {currentQuiz && currentQuiz.questions && (
            <QuizQuestion 
              question={currentQuiz.questions[currentQuestion]} 
              onAnswer={handleAnswer} 
              selectedAnswer={userAnswers[currentQuestion]} // ← Pasar respuesta seleccionada
            />
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