const QuizResults = ({ score, total }) => {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-4">🎉 ¡Has terminado el examen!</h2>
      <p className="text-xl mb-6">Tu puntaje: {score} / {total}</p>
      <button
        onClick={() => window.location.href = "/dashboard"}
        className="bg-blue-600 px-4 py-2 text-white rounded shadow hover:bg-blue-700"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default QuizResults;
