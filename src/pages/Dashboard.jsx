import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Dashboard() {
  const location = useLocation();
  const isNestedRoute = location.pathname !== "/";

  return (
    <div className="app-root">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido dinámico */}
      <main className="content-area">
        {/* Solo mostrar header si estamos en el dashboard principal */}
        {!isNestedRoute && (
          <>
            {/* Header superior */}
            <div className="header-row">
              <div className="section-title">
                <i className="fas fa-chart-line"></i>
                Panel de Aprendizaje
              </div>
              <div className="welcome-text">
                Bienvenido — empieza por <strong>Materiales</strong> o <strong>Quizzes</strong>
              </div>
            </div>

            {/* Secciones rápidas */}
            <div className="dashboard-grid">
              {/* Bloque Quizzes */}
              <Link to="/quiz" className="dashboard-card quiz-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h3>Quizzes</h3>
                </div>
                <p>Reta tus conocimientos con pruebas interactivas.</p>
                <div className="card-badge">¡Gana puntos!</div>
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

            {/* Sección de Progreso Actual */}
            <div className="progress-section">
              <div className="section-title">
                <i className="fas fa-tasks"></i>
                Tu Progreso Actual
              </div>
              
              <div className="stage-card">
                <div className="stage-header">
                  <div className="stage-title">Etapa 1 / 3 - Fundamentos de SST</div>
                  <div className="stage-badge">En Progreso</div>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{width: '65%'}}></div>
                </div>
                <div className="progress-info">
                  <span>65% Completado</span>
                  <span>26s restantes</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Aquí React Router carga la página hija (quiz, materials, progress) */}
        <div className="outlet-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}