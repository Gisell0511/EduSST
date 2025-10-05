const QuizResults = ({ score, total }) => {
  const percentage = (score / total) * 100;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h2>🎉 ¡Has terminado el examen!</h2>
        <div className={`score-badge ${isExcellent ? 'excellent' : isGood ? 'good' : 'needs-improvement'}`}>
          {score} / {total}
        </div>
      </div>
      
      <div className="results-message">
        {isExcellent ? '¡Excelente trabajo!' : 
         isGood ? 'Buen trabajo, sigue mejorando' : 
         'Sigue practicando, lo lograrás'}
      </div>
      
      <div className="results-actions">
        <button 
          onClick={() => window.location.href = "/dashboard"} 
          className="btn btn-primary"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;