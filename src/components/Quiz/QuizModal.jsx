import React from "react";

export default function QuizModal({ 
  type, 
  title, 
  message, 
  score, 
  total, 
  percentage,
  showClose, 
  onClose, 
  onContinue,
  onRetry,
  onAdvance,
  canAdvance 
}) {
  const getIcon = () => {
    switch(type) {
      case 'correct': return '✅';
      case 'incorrect': return '❌';
      case 'timeup': return '⏰';
      case 'results': return '🎯';
      default: return '💡';
    }
  };

  const getModalClass = () => {
    switch(type) {
      case 'correct': return 'modal-correct';
      case 'incorrect': return 'modal-incorrect';
      case 'timeup': return 'modal-timeup';
      case 'results': return 'modal-results';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`quiz-modal ${getModalClass()}`}>
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
                {percentage !== undefined ? percentage : Math.round((score / total) * 100)}% de aciertos
              </div>
              <div className="score-status">
                {percentage >= 70 ? (
                  <span className="status-pass">✅ Aprobado</span>
                ) : (
                  <span className="status-fail">❌ No aprobado</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {/* Botón de Avanzar (solo en resultados cuando se puede avanzar) */}
          {type === 'results' && canAdvance && onAdvance && (
            <button className="btn btn-success" onClick={onAdvance}>
              <i className="fas fa-arrow-right"></i>
              Avanzar al Siguiente Nivel
            </button>
          )}
          
          {/* Botón de Reintentar (solo en resultados cuando no se aprueba) */}
          {type === 'results' && onRetry && (
            <button className="btn btn-warning" onClick={onRetry}>
              <i className="fas fa-redo"></i>
              Reintentar Quiz
            </button>
          )}
          
          {/* Botón de Continuar (para preguntas individuales) */}
          {onContinue && (
            <button className="btn btn-primary" onClick={onContinue}>
              <i className="fas fa-forward"></i>
              Continuar
            </button>
          )}
          
          {/* Botón de Cerrar (para modal de resultados) */}
          {showClose && onClose && (
            <button className="btn btn-outline" onClick={onClose}>
              <i className="fas fa-home"></i>
              Volver al Inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}