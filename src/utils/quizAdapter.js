// utils/quizAdapter.js
export const quizAdapter = {
  adaptQuizzes: (quizzesData) => {
    console.log('🔄 ADAPTADOR - Iniciando adaptación de quizzes');
    console.log('📦 ADAPTADOR - Datos recibidos:', quizzesData);
    
    if (!Array.isArray(quizzesData)) {
      console.error('❌ ADAPTADOR - Error: quizzesData no es un array');
      return [];
    }
    
    const adaptedQuizzes = quizzesData.map((quiz, index) => {
      console.log(`🔍 ADAPTADOR - Procesando pregunta ${index + 1} (ID: ${quiz.id})`);
      
      let finalOptions = [];
      
      // CASO 1: Ya tiene options como array de objetos {letter, text}
      if (quiz.options && Array.isArray(quiz.options)) {
        console.log(`✅ ADAPTADOR - Pregunta ${index + 1} ya tiene array de options`);
        
        // Verificar que cada opción tenga el formato correcto
        finalOptions = quiz.options.map((option, optIndex) => {
          if (typeof option === 'object' && option.letter && option.text) {
            // Formato correcto: {letter: 'a', text: '...'}
            return option;
          } else if (typeof option === 'string') {
            // Formato string simple - convertir a objeto
            const letter = String.fromCharCode(97 + optIndex); // a, b, c, d
            return { letter: letter, text: option };
          } else {
            // Opción inválida - crear una por defecto
            const letter = String.fromCharCode(97 + optIndex);
            return { letter: letter, text: `Opción ${letter.toUpperCase()}` };
          }
        });
        
        console.log(`✅ ADAPTADOR - Options procesadas:`, finalOptions);
      }
      // CASO 2: Tiene option_a, option_b, etc. (formato individual)
      else if (quiz.option_a || quiz.option_b || quiz.option_c || quiz.option_d) {
        console.log(`🔄 ADAPTADOR - Pregunta ${index + 1} tiene opciones individuales`);
        
        if (quiz.option_a) finalOptions.push({ letter: 'a', text: quiz.option_a });
        if (quiz.option_b) finalOptions.push({ letter: 'b', text: quiz.option_b });
        if (quiz.option_c) finalOptions.push({ letter: 'c', text: quiz.option_c });
        if (quiz.option_d) finalOptions.push({ letter: 'd', text: quiz.option_d });
        
        console.log(`✅ ADAPTADOR - Options creadas desde individuales:`, finalOptions);
      }
      // CASO 3: No tiene opciones - CREAR DE EMERGENCIA
      else {
        console.warn(`⚠️ ADAPTADOR - Pregunta ${index + 1} sin opciones, creando de emergencia`);
        
        finalOptions = [
          { letter: 'a', text: 'Opción A' },
          { letter: 'b', text: 'Opción B' },
          { letter: 'c', text: 'Opción C' },
          { letter: 'd', text: 'Opción D' }
        ];
        
        console.log(`✅ ADAPTADOR - Options de emergencia creadas:`, finalOptions);
      }
      
      // Crear el objeto de pregunta adaptado
      const adaptedQuestion = {
        id: quiz.id || `q-${index + 1}`,
        question: quiz.question || 'Pregunta no disponible',
        options: finalOptions,
        difficulty: quiz.difficulty || 'medium',
        correct_answer: quiz.correct_answer || 'a'
      };
      
      console.log(`✅ ADAPTADOR - Pregunta ${index + 1} adaptada:`, {
        id: adaptedQuestion.id,
        question: adaptedQuestion.question.substring(0, 50) + '...',
        optionsCount: adaptedQuestion.options.length,
        hasCorrectAnswer: !!adaptedQuestion.correct_answer
      });
      
      return adaptedQuestion;
    });
    
    console.log('🎉 ADAPTADOR - Adaptación completada');
    console.log(`📊 ADAPTADOR - Total preguntas procesadas: ${adaptedQuizzes.length}`);
    
    return adaptedQuizzes;
  }
};

export default quizAdapter;