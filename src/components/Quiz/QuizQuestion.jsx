import { useState, useCallback } from 'react';

const QuizQuestion = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  // ✅ Validación más robusta
  if (!question || typeof question !== 'object') {
    console.error('❌ Pregunta inválida:', question);
    return (
      <div className="error-state">
        <h3>Error al cargar la pregunta</h3>
        <p>La pregunta no está disponible o tiene un formato incorrecto.</p>
      </div>
    );
  }

  const handleOptionSelect = useCallback((option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    
    const isCorrect = option === question.correct_answer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
      // Resetear para la siguiente pregunta
      setSelectedOption(null);
      setAnswered(false);
    }, 1500);
  }, [question, onAnswer, answered]);

  // ✅ Función mejorada para renderizar opciones
  const renderOptions = () => {
    // Opciones disponibles en diferentes formatos
    const availableOptions = [];
    
    // Formato 1: option_a, option_b, option_c, option_d
    if (question.option_a) availableOptions.push({ key: 'a', text: question.option_a });
    if (question.option_b) availableOptions.push({ key: 'b', text: question.option_b });
    if (question.option_c) availableOptions.push({ key: 'c', text: question.option_c });
    if (question.option_d) availableOptions.push({ key: 'd', text: question.option_d });
    
    // Formato 2: array de options
    if (question.options && Array.isArray(question.options)) {
      return question.options.map((option, index) => {
        const optionKey = String.fromCharCode(97 + index);
        return (
          <button
            key={optionKey}
            className={`option-btn ${selectedOption === optionKey ? 'selected' : ''} ${
              answered && optionKey === question.correct_answer ? 'correct' : ''
            } ${answered && selectedOption === optionKey && optionKey !== question.correct_answer ? 'incorrect' : ''}`}
            onClick={() => handleOptionSelect(optionKey)}
            disabled={answered}
          >
            <span className="option-letter">{optionKey.toUpperCase()}</span>
            <span className="option-text">{option}</span>
          </button>
        );
      });
    }
    
    // Si no hay opciones disponibles
    if (availableOptions.length === 0) {
      return (
        <div className="error-message">
          No se encontraron opciones de respuesta para esta pregunta.
        </div>
      );
    }

    // Renderizar opciones disponibles
    return availableOptions.map(({ key, text }) => (
      <button
        key={key}
        className={`option-btn ${selectedOption === key ? 'selected' : ''} ${
          answered && key === question.correct_answer ? 'correct' : ''
        } ${answered && selectedOption === key && key !== question.correct_answer ? 'incorrect' : ''}`}
        onClick={() => handleOptionSelect(key)}
        disabled={answered}
      >
        <span className="option-letter">{key.toUpperCase()}</span>
        <span className="option-text">{text}</span>
      </button>
    ));
  };

  // ✅ Mostrar información de debug en desarrollo
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="debug-info">
          <details>
            <summary>Debug Info (Desarrollo)</summary>
            <div><strong>ID:</strong> {question.id}</div>
            <div><strong>Respuesta Correcta:</strong> {question.correct_answer}</div>
            <div><strong>Opciones Disponibles:</strong></div>
            <ul>
              {question.option_a && <li>A: {question.option_a}</li>}
              {question.option_b && <li>B: {question.option_b}</li>}
              {question.option_c && <li>C: {question.option_c}</li>}
              {question.option_d && <li>D: {question.option_d}</li>}
            </ul>
          </details>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="quiz-question">
      <div className="question-header">
        <h3 className="question-text">
          {question.question || 'Pregunta no disponible'}
        </h3>
      </div>

      <div className="options-container">
        {renderOptions()}
      </div>

      {/* Feedback visual */}
      {answered && (
        <div className="answer-feedback">
          {selectedOption === question.correct_answer ? (
            <div className="feedback correct">
              <i className="fas fa-check"></i>
              <span>¡Respuesta Correcta!</span>
            </div>
          ) : (
            <div className="feedback incorrect">
              <i className="fas fa-times"></i>
              <span>
                Respuesta Incorrecta. 
                {question.correct_answer && ` La correcta es: ${question.correct_answer.toUpperCase()}`}
              </span>
            </div>
          )}
        </div>
      )}

      {renderDebugInfo()}
    </div>
  );
};

export default QuizQuestion;