import { useState } from "react";
import Timer from "../components/Quiz/Timer";
import StageIndicator from "../components/Quiz/StageIndicator";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuizQuestion from "../components/Quiz/QuizQuestion";
import QuizModal from "../components/Quiz/QuizModal";

const quizData = [
  { id: 1, type: "truefalse", question: "El uso de EPP es obligatorio en zonas de riesgo.", answer: true },
  { id: 2, type: "dragdrop", question: "Arrastra los conceptos de SST a su definición correcta." },
  { id: 3, type: "truefalse", question: "Se puede trabajar en alturas sin arnés de seguridad.", answer: false },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const totalQuestions = quizData.length;

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      showFeedbackModal('correct', '¡Respuesta Correcta!', 'Has ganado 10 puntos.');
    } else {
      showFeedbackModal('incorrect', 'Respuesta Incorrecta', 'Sigue practicando.');
    }

    if (current + 1 < totalQuestions) {
      setTimeout(() => {
        setCurrent(prev => prev + 1);
        if ((current + 1) % 3 === 0) setStage(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        showResultsModal();
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    showFeedbackModal('timeup', '⏰ Tiempo Agotado', 'El tiempo ha terminado para esta pregunta.');
    setTimeout(() => {
      handleAnswer(false);
    }, 2000);
  };

  const showFeedbackModal = (type, title, message) => {
    setModalConfig({
      type,
      title,
      message,
      showClose: false,
      onClose: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const showResultsModal = () => {
    const finalScore = score;
    const percentage = (finalScore / totalQuestions) * 100;
    
    let title, message;
    if (percentage >= 80) {
      title = '🎉 ¡Excelente!';
      message = `Dominas los conceptos de SST. Puntaje: ${finalScore}/${totalQuestions}`;
    } else if (percentage >= 60) {
      title = '👍 Buen Trabajo';
      message = `Vas por buen camino. Puntaje: ${finalScore}/${totalQuestions}`;
    } else {
      title = '📚 Sigue Practicando';
      message = `Revisa los materiales de estudio. Puntaje: ${finalScore}/${totalQuestions}`;
    }

    setModalConfig({
      type: 'results',
      title,
      message,
      showClose: true,
      score: finalScore,
      total: totalQuestions,
      onClose: () => {
        setShowModal(false);
        // Opcional: redirigir al dashboard
        // window.location.href = '/';
      }
    });
    setShowModal(true);
  };

  const continueQuiz = () => {
    setShowModal(false);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <StageIndicator stage={stage} totalStages={3} />
        <Timer duration={30} onTimeUp={handleTimeUp} />
        <ProgressBar current={current + 1} total={totalQuestions} />
        
        <div className="quiz-content">
          <QuizQuestion question={quizData[current]} onAnswer={handleAnswer} />
        </div>
      </div>

      {showModal && (
        <QuizModal 
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          score={modalConfig.score}
          total={modalConfig.total}
          showClose={modalConfig.showClose}
          onClose={modalConfig.onClose}
          onContinue={!modalConfig.showClose ? continueQuiz : undefined}
        />
      )}
    </div>
  );
}