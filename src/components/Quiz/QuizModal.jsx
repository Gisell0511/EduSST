import React from "react";

export default function QuizModal({ type, title, message, score, total, showClose, onClose, onContinue }) {
  const getIcon = () => {
    switch(type) {
      case 'correct': return '✅';
      case 'incorrect': return '❌';
      case 'timeup': return '⏰';
      case 'results': return '🎯';
      default: return '💡';
    }
  };

  const getButtonText = () => {
    if (onContinue) return 'Continuar';
    return 'Cerrar';
  };

  return (
    <div className="modal-overlay">
      <div className="quiz-modal">
        <div className={`modal-icon ${type}`}>
          {getIcon()}
        </div>
        
        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          
          {type === 'results' && score !== undefined && (
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{total}</span>
              </div>
              <div className="score-percentage">
                {Math.round((score / total) * 100)}% de aciertos
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {onContinue && (
            <button className="btn btn-primary" onClick={onContinue}>
              {getButtonText()}
            </button>
          )}
          {showClose && (
            <button className="btn btn-primary" onClick={onClose}>
              {getButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}