import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useProgress } from "../contexts/ProgressContext";
import { api } from "../config/api";

export default function Dashboard() {
  const location = useLocation();
  const { progress } = useProgress();
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const isNestedRoute = location.pathname !== "/";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.getQuizCategories();
      if (response.success && response.data) {
        // Mapear categorías del backend a niveles
        const categoryLevels = response.data.map((category, index) => ({
          id: category.id || String(index + 1),
          name: category.name || `Nivel ${index + 1}`,
          description: category.description || `Quizzes de ${category.name}`,
          unlocked: index === 0, // Solo el primer nivel desbloqueado inicialmente
          completed: false,
          score: 0
        }));
        
        setCategories(response.data);
        setLevels(categoryLevels);
      } else {
        setDefaultLevels();
      }
    } catch (error) {
      console.log('Error cargando categorías, usando niveles por defecto');
      setDefaultLevels();
    }
  };

  const setDefaultLevels = () => {
    setLevels([
      { id: '1', name: 'Básico', unlocked: true, completed: false, score: 0 },
      { id: '2', name: 'Intermedio', unlocked: false, completed: false, score: 0 },
      { id: '3', name: 'Avanzado', unlocked: false, completed: false, score: 0 }
    ]);
  };

  return (
    <div className="app-root">
      <Sidebar />

      <main className="content-area">
        {!isNestedRoute && (
          <>
            <div className="header-row">
              <div className="section-title">
                <i className="fas fa-chart-line"></i>
                Panel de Aprendizaje SST
              </div>
              <div className="welcome-text">
                Bienvenido — selecciona un nivel para comenzar
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Bloque Quizzes */}
              <div className="dashboard-card quiz-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h3>Quizzes por Nivel</h3>
                </div>
                <p>Comienza por el nivel básico y avanza progresivamente.</p>
                
                <div className="levels-quick-view">
                  {levels.map(level => (
                    <Link 
                      key={level.id}
                      to={level.unlocked ? `/quiz/${level.id}` : '#'}
                      className={`level-quick-item ${level.unlocked ? '' : 'locked'}`}
                    >
                      <div className="level-quick-icon">
                        {level.unlocked ? (
                          <i className="fas fa-play-circle"></i>
                        ) : (
                          <i className="fas fa-lock"></i>
                        )}
                      </div>
                      <div className="level-quick-info">
                        <div className="level-quick-name">{level.name}</div>
                        <div className="level-quick-description">{level.description}</div>
                        {level.score > 0 && (
                          <div className="level-quick-score">{level.score}% completado</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="card-badge">¡Avanza progresivamente!</div>
              </div>

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
                    {levels.find(l => l.unlocked && !l.completed)?.name || 'Básico'} - En Progreso
                  </div>
                  <div className="stage-badge">
                    {levels.filter(l => l.completed).length}/{levels.length} Completados
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{
                      width: `${(levels.filter(l => l.completed).length / levels.length) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span>
                    {Math.round((levels.filter(l => l.completed).length / levels.length) * 100)}% del camino
                  </span>
                  <span>
                    {levels.find(l => l.unlocked && !l.completed) ? 'Continúa aprendiendo' : '¡Felicidades!'}
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