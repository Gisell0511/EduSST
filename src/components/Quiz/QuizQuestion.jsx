import TrueFalseQuiz from "./TrueFalseQuiz";
import DragDropQuiz from "./DragDropQuiz";

export default function QuizQuestion({ question, onAnswer }) {
  if (question.type === "truefalse") {
    return <TrueFalseQuiz question={question} onAnswer={onAnswer} />;
  }
  if (question.type === "dragdrop") {
    return <DragDropQuiz question={question} onAnswer={onAnswer} />;
  }
  return <div>❓ Tipo de pregunta no soportado</div>;
}
