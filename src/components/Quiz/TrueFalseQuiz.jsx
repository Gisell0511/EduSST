import React from "react";

export default function TrueFalseQuiz({ question, onAnswer }) {
  const handleAnswer = (answer) => {
    onAnswer(answer === question.answer);
  };

  return (
    <div className="true-false-quiz">
      <div className="quiz-question">{question.question}</div>
      
      <div className="true-false-options">
        <button 
          className="btn true-option" 
          onClick={() => handleAnswer(true)}
        >
          ✅ Verdadero
        </button>
        
        <button 
          className="btn false-option" 
          onClick={() => handleAnswer(false)}
        >
          ❌ Falso
        </button>
      </div>
    </div>
  );
}