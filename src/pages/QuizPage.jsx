import { useState } from "react";
import Timer from "../components/Quiz/Timer";
import StageIndicator from "../components/Quiz/StageIndicator";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuizQuestion from "../components/Quiz/Quizquestion";

const quizData = [
  { id: 1, type: "truefalse", question: "El sol es una estrella.", answer: true },
  { id: 2, type: "dragdrop", question: "Arrastra las palabras a la categoría correcta." },
  { id: 3, type: "truefalse", question: "La Tierra tiene 3 lunas.", answer: false },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);

  const totalQuestions = quizData.length;

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);

    if (current + 1 < totalQuestions) {
      setCurrent(prev => prev + 1);
      if ((current + 1) % 3 === 0) setStage(prev => prev + 1); // cada 3 preguntas cambia etapa
    } else {
      alert(`✅ Fin del quiz. Puntaje: ${score + (isCorrect ? 1 : 0)} / ${totalQuestions}`);
    }
  };

  const handleTimeUp = () => {
    alert("⏰ Tiempo terminado!");
    handleAnswer(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white/5 rounded-xl shadow-lg text-white">
      <StageIndicator stage={stage} totalStages={3} />

      <Timer duration={30} onTimeUp={handleTimeUp} />

      <ProgressBar current={current + 1} total={totalQuestions} />

      <div className="mt-6">
        <QuizQuestion
          question={quizData[current]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
