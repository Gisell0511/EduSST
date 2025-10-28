// components/Quiz/QuizQuestion.jsx
import { useState, useCallback } from 'react';

const QuizQuestion = ({ question, onAnswer, selectedAnswer }) => {
  const [answered, setAnswered] = useState(false);

  // Validación robusta
  if (!question || typeof question !== 'object') {
    return (
      <div className="error-state">
        <h3>Error al cargar la pregunta</h3>
        <p>La pregunta no está disponible o tiene un formato incorrecto.</p>
      </div>
    );
  }

  // Validar que tenga opciones
  if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
    return (
      <div className="error-state">
        <h3>Error en la pregunta</h3>
        <p>Esta pregunta no tiene opciones de respuesta disponibles.</p>
        <div className="debug-info">
          <details>
            <summary>Información técnica</summary>
            <div><strong>ID:</strong> {question.id}</div>
            <div><strong>Opciones:</strong> {question.options ? 'Array vacío' : 'No definido'}</div>
          </details>
        </div>
      </div>
    );
  }

  const handleOptionSelect = useCallback((optionKey) => {
    if (answered) return;
    
    setAnswered(true);
    
    setTimeout(() => {
      onAnswer(optionKey);
      setAnswered(false);
    }, 500);
  }, [onAnswer, answered]);

  const renderOptions = () => {
    return question.options.map((option) => (
      <button
        key={option.letter}
        className={`option-btn ${
          selectedAnswer === option.letter ? 'selected' : ''
        } ${answered ? 'answered' : ''}`}
        onClick={() => handleOptionSelect(option.letter)}
        disabled={answered}
      >
        <span className="option-letter">{option.letter.toUpperCase()}</span>
        <span className="option-text">{option.text}</span>
      </button>
    ));
  };

  return (
    <div className="quiz-question">
      <div className="question-header">
        <h3 className="question-text">
          {question.question}
        </h3>
      </div>

      <div className="options-container">
        {renderOptions()}
      </div>

      {/* Debug info */}
      <div className="debug-info">
        <details>
          <summary>Debug Info</summary>
          <div><strong>ID:</strong> {question.id}</div>
          <div><strong>Respuesta Correcta:</strong> {question.correct_answer || 'No disponible'}</div>
          <div><strong>Respuesta Seleccionada:</strong> {selectedAnswer || 'Ninguna'}</div>
          <div><strong>Número de Opciones:</strong> {question.options.length}</div>
          <div><strong>Opciones:</strong></div>
          <ul>
            {question.options.map(opt => (
              <li key={opt.letter}><strong>{opt.letter.toUpperCase()}:</strong> {opt.text}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default QuizQuestion;