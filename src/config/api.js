// config/api.js
const API_BASE = 'http://localhost:3001/api';

export const api = {
  // ========================================
  // 🔐 AUTENTICACIÓN
  // ========================================
  
  login: async (credentials) => {
    console.log('📡 Intentando login con:', credentials.email);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Login exitoso:', data);
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  register: async (userData) => {
    console.log('📡 Registrando usuario:', userData.email);
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Registro exitoso:', data);
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    console.log('✅ Logout exitoso');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // ========================================
  // 📚 QUIZZES - SOLO ENDPOINTS REALES
  // ========================================
  
  getCategories: async () => {
    console.log('📡 Obteniendo categorías desde backend...');
    const response = await fetch(`${API_BASE}/quizzes/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Categorías obtenidas correctamente:', data.length, 'categorías');
    return data;
  },

  getQuizzesByCategory: async (categoryId) => {
  try {
    console.log(`📡 [API] Obteniendo quizzes para categoría ${categoryId}...`);
    const response = await fetch(`${API_BASE}/quizzes/category/${categoryId}/quizzes`);
    
    console.log(`📡 [API] Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ [API] Quizzes obtenidos: ${data.length} preguntas`);
    console.log(`🔍 [API] Tipo de data: ${typeof data}, Es array: ${Array.isArray(data)}`);
    
    return data;
  } catch (error) {
    console.error('❌ [API] Error en getQuizzesByCategory:', error);
    throw error;
  }
},

  // ⚠️ FUNCIÓN QUE FALTABA - DEBE EXISTIR EN BACKEND
  submitQuiz: async (quizId, answers) => {
    console.log('📡 Enviando respuestas del quiz:', { quizId, answers });
    
    const response = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizId, answers })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Quiz enviado correctamente:', result);
    return result;
  },

  checkAnswer: async (quizId, userAnswer) => {
    console.log(`📡 Verificando respuesta quiz ${quizId}, opción ${userAnswer}...`);
    
    const response = await fetch(`${API_BASE}/quizzes/check-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizId, userAnswer }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Respuesta verificada:', data.isCorrect ? 'CORRECTA' : 'INCORRECTA');
    return data;
  },

  getProgressByCategory: async (categoryId) => {
    console.log(`📡 Obteniendo progreso para categoría ${categoryId}...`);
    
    const response = await fetch(`${API_BASE}/quizzes/progress/${categoryId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Progreso obtenido:', data);
    return data;
  },

  getUserStats: async () => {
    console.log('📡 Obteniendo estadísticas del usuario...');
    
    const response = await fetch(`${API_BASE}/quizzes/user-stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Estadísticas obtenidas:', data);
    return data;
  },

  // ========================================
  // 🎯 MÉTODOS ADICIONALES
  // ========================================
  
  healthCheck: async () => {
    console.log('📡 Verificando salud del backend...');
    const response = await fetch(`${API_BASE}/health`);
    
    if (!response.ok) {
      throw new Error(`Backend no responde: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend funcionando:', data);
    return data;
  },

  testConnection: async () => {
    console.log('📡 Probando conexión con backend...');
    const response = await fetch(`${API_BASE}/test`);
    
    if (!response.ok) {
      throw new Error(`Error en test: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Conexión exitosa:', data);
    return data;
  }
};