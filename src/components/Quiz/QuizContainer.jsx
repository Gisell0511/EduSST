import { useState } from "react";
import quizData from "../../data/quizData";
import QuizQuestion from "./QuizQuestion";
import ProgressBar from "./ProgressBar";
import StageIndicator from "./StageIndicator";
import Timer from "./Timer";
import QuizResults from "./QuizResults";

const QuizContainer = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      if (onFinish) onFinish(score + (isCorrect ? 1 : 0), quizData.length);
    }
  };

  if (finished) {
    return <QuizResults score={score} total={quizData.length} />;
  }

  return (
    <div className="quiz-container p-6 bg-gray-900 text-white rounded-lg">
      <StageIndicator current={current + 1} total={quizData.length} />
      <ProgressBar current={current + 1} total={quizData.length} />
      <Timer seconds={60} onTimeout={() => setFinished(true)} />

      <QuizQuestion data={quizData[current]} onAnswer={handleAnswer} />
    </div>
  );
};

export default QuizContainer;
