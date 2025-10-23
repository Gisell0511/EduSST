export const adaptBackendQuiz = (backendData, categoryId) => {
  console.log('🛠️ Adaptando datos del backend:', backendData);
  
  // Si ya es un array de preguntas (como en /quizzes/category/1/quizzes)
  if (Array.isArray(backendData) && backendData.length > 0 && backendData[0].question) {
    return {
      id: `category-${categoryId}-quiz`,
      title: `Quiz SST - Categoría ${categoryId}`,
      level: categoryId,
      questions: backendData.map((question, index) => ({
        id: question.id || index + 1,
        type: "multiplechoice",
        question: question.question,
        // ✅ Mantener el formato que QuizQuestion espera
        option_a: question.option_a,
        option_b: question.option_b, 
        option_c: question.option_c,
        option_d: question.option_d,
        // ✅ Determinar correctamente la respuesta correcta
        correct_answer: getCorrectAnswer(question),
        explanation: question.explanation || '',
        difficulty: question.difficulty || 'medium'
      }))
    };
  }
  
  // Si es información de categoría (como en /quizzes/categories)
  if (backendData.name) {
    return {
      id: backendData.id,
      title: backendData.name,
      level: backendData.level,
      description: backendData.description,
      totalQuestions: backendData.total_questions
    };
  }
  
  return null;
};

// ✅ Función corregida para determinar la respuesta correcta
const getCorrectAnswer = (question) => {
  // Verificar diferentes formas en que el backend puede indicar la respuesta correcta
  if (question.correct_answer) {
    // Si ya viene la letra de la respuesta correcta (a, b, c, d)
    return question.correct_answer.toLowerCase();
  }
  
  if (question.correct_option) {
    // Si viene como "correct_option": "a"
    return question.correct_option.toLowerCase();
  }
  
  if (question.answer) {
    // Si viene como "answer": 0 (índice) o "a" (letra)
    if (typeof question.answer === 'number') {
      // Convertir índice a letra: 0 -> 'a', 1 -> 'b', etc.
      return String.fromCharCode(97 + question.answer);
    }
    return question.answer.toLowerCase();
  }
  
  // ⚠️ Si no hay forma de determinar, usar la primera opción como fallback
  console.warn('⚠️ No se pudo determinar respuesta correcta para pregunta:', question.id);
  return 'a';
};

// Adaptador para categorías
export const adaptCategoriesToLevels = (categories) => {
  return categories.map(category => ({
    id: category.id.toString(),
    name: category.name,
    description: category.description,
    level: category.level,
    totalQuestions: category.total_questions,
    unlocked: category.level === 'BÁSICO',
    completed: false,
    score: 0
  }));
};