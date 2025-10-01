import React from "react";

export default function TrueFalseQuiz({ question, onAnswer }) {
  if (!question) return null;

  return (
    <div className="true-false-quiz">
      <p className="question-text">{question.text}</p>
      <div className="options">
        <button
          className="btn true"
          onClick={() => onAnswer(question.answer === true)}
        >
          Verdadero
        </button>
        <button
          className="btn false"
          onClick={() => onAnswer(question.answer === false)}
        >
          Falso
        </button>
      </div>
    </div>
  );
}
