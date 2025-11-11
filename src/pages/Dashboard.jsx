import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useProgress } from "../contexts/ProgressContext";
import { api } from "../config/api";
import TestConnection from "../components/TestConnection";

export default function Dashboard() {
  const location = useLocation();
  const { progress } = useProgress();
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showTest, setShowTest] = useState(true);
  const isNestedRoute = location.pathname !== "/";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('🔄 Cargando categorías desde backend...');
      
      const categoriesData = await api.getCategories();
      
      console.log('📦 Respuesta del backend:', categoriesData);
      
      if (Array.isArray(categoriesData)) {
        console.log('✅ Categorías obtenidas correctamente:', categoriesData.length);
        
        // ✅ AGRUPAR CATEGORÍAS POR NIVEL
        const groupedLevels = groupCategoriesByLevel(categoriesData);
        setCategories(categoriesData);
        setLevels(groupedLevels);
        
      } else {
        console.log('⚠️ Formato inesperado, usando niveles por defecto');
        setDefaultLevels();
      }
    } catch (error) {
      console.log('❌ Error cargando categorías:', error);
      setDefaultLevels();
    }
  };

  // ✅ FUNCIÓN PARA AGRUPAR CATEGORÍAS POR NIVEL
  const groupCategoriesByLevel = (categories) => {
    const levelGroups = {
      'BÁSICO': { 
        id: '1', 
        name: 'Básico', 
        description: 'Conceptos fundamentales de seguridad y salud',
        categories: [],
        totalQuestions: 0,
        unlocked: true,
        completed: false
      },
      'INTERMEDIO': { 
        id: '2', 
        name: 'Intermedio', 
        description: 'Temas avanzados y especializados',
        categories: [],
        totalQuestions: 0,
        unlocked: false,
        completed: false
      },
      'AVANZADO': { 
        id: '3', 
        name: 'Avanzado', 
        description: 'Expertise en gestión de seguridad',
        categories: [],
        totalQuestions: 0,
        unlocked: false,
        completed: false
      }
    };

    // Agrupar categorías por nivel
    categories.forEach(category => {
      const levelKey = category.level || 'BÁSICO';
      if (levelGroups[levelKey]) {
        levelGroups[levelKey].categories.push(category);
        levelGroups[levelKey].totalQuestions += category.total_questions || 0;
      }
    });

    // Convertir a array y determinar qué niveles están desbloqueados
    const levelsArray = Object.values(levelGroups);
    
    // Lógica de desbloqueo: nivel 1 siempre desbloqueado, nivel 2 si completaste nivel 1, etc.
    levelsArray.forEach((level, index) => {
      if (index === 0) {
        level.unlocked = true; // Nivel 1 siempre desbloqueado
      } else {
        // Aquí puedes agregar lógica para desbloquear niveles basado en progreso
        level.unlocked = false; // Por ahora, solo nivel 1 desbloqueado
      }
    });

    console.log('📊 Niveles agrupados:', levelsArray);
    return levelsArray;
  };

  const setDefaultLevels = () => {
    setLevels([
      { 
        id: '1', 
        name: 'Básico', 
        description: 'Conceptos fundamentales',
        unlocked: true, 
        completed: false, 
        score: 0,
        totalQuestions: 150,
        categories: []
      },
      { 
        id: '2', 
        name: 'Intermedio', 
        description: 'Temas avanzados',
        unlocked: false, 
        completed: false, 
        score: 0,
        totalQuestions: 150,
        categories: []
      },
      { 
        id: '3', 
        name: 'Avanzado', 
        description: 'Expertise en gestión',
        unlocked: false, 
        completed: false, 
        score: 0,
        totalQuestions: 125,
        categories: []
      }
    ]);
  };

  return (
    <div className="app-root">
      <Sidebar />

      <main className="content-area">
  {!isNestedRoute && (
    <>
      {/* PRUEBA DE CONEXIÓN */}
      {showTest && <TestConnection />}
      
      {/* Botón para mostrar/ocultar prueba */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <button 
          onClick={() => setShowTest(!showTest)}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showTest ? '❌ Ocultar Prueba de Conexión' : '🔌 Mostrar Prueba de Conexión'}
        </button>
      </div>

      <div className="header-row">
        <div className="section-title">
          <i className="fas fa-chart-line"></i>
          Panel de Aprendizaje SST
        </div>
        <div className="welcome-text">
          Bienvenido — selecciona una opción para comenzar
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Bloque Quizzes - CORREGIDO */}
        <Link to="/quiz" className="dashboard-card quiz-card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-gamepad"></i>
            </div>
            <h3>Quizzes por Nivel</h3>
          </div>
          <p>Comienza por el nivel básico y avanza progresivamente.</p>
          
          {/* Vista previa de niveles */}
          <div className="levels-quick-view">
            <div className="level-quick-item">
              <div className="level-quick-icon">
                <i className="fas fa-play-circle" style={{color: '#4CAF50'}}></i>
              </div>
              <div className="level-quick-info">
                <div className="level-quick-name">Básico</div>
                <div className="level-quick-description">Conceptos fundamentales de SST</div>
                <div className="level-quick-score">5 categorías • 150 preguntas</div>
              </div>
            </div>
            
            <div className="level-quick-item">
              <div className="level-quick-icon">
                <i className="fas fa-lock" style={{color: '#FF9800'}}></i>
              </div>
              <div className="level-quick-info">
                <div className="level-quick-name">Intermedio</div>
                <div className="level-quick-description">Temas avanzados y especializados</div>
                <div className="level-quick-score">5 categorías • 150 preguntas</div>
              </div>
            </div>
            
            <div className="level-quick-item">
              <div className="level-quick-icon">
                <i className="fas fa-lock" style={{color: '#F44336'}}></i>
              </div>
              <div className="level-quick-info">
                <div className="level-quick-name">Avanzado</div>
                <div className="level-quick-description">Expertise en gestión de SST</div>
                <div className="level-quick-score">5 categorías • 125 preguntas</div>
              </div>
            </div>
          </div>
          
          <div className="card-badge">¡Avanza progresivamente!</div>
        </Link>

        {/* Bloque Materiales */}
        <Link to="/materials" className="dashboard-card materials-card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3>Materiales de apoyo</h3>
          </div>
          <p>Videos y lecturas clave para reforzar tu aprendizaje.</p>
          <div className="card-badge">Recursos</div>
        </Link>

        {/* Bloque Progreso */}
        <Link to="/progress" className="dashboard-card progress-card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Progreso</h3>
          </div>
          <p>Revisa tu avance y los resultados de tus intentos.</p>
          <div className="card-badge">Estadísticas</div>
        </Link>
      </div>

      <div className="progress-section">
        <div className="section-title">
          <i className="fas fa-tasks"></i>
          Tu Progreso Actual
        </div>
        
        <div className="stage-card">
          <div className="stage-header">
            <div className="stage-title">
              Básico - En Progreso
            </div>
            <div className="stage-badge">
              0/3 Completados
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{
                width: `0%`
              }}
            ></div>
          </div>
          <div className="progress-info">
            <span>
              0% del camino
            </span>
            <span>
              Continúa aprendiendo
            </span>
          </div>
        </div>
      </div>
    </>
  )}

  <div className="outlet-area">
    <Outlet />
  </div>
</main>
    </div>
  );
}