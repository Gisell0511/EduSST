import React from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Dashboard() {
  return (
    <div className="app-root">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido dinámico */}
      <main className="content-area">
        {/* Header superior */}
        <div className="header-row">
          <div className="section-title">📊 Panel de Aprendizaje</div>
          <div className="small muted">
            Bienvenido — empieza por <strong>Materiales</strong> o <strong>Quizzes</strong>
          </div>
        </div>

        {/* Secciones rápidas */}
        <div className="dashboard-grid">
          {/* Bloque Quizzes */}
          <Link to="/quiz" className="dashboard-card">
            <h3>🚀 Quizzes</h3>
            <p>Reta tus conocimientos con pruebas interactivas.</p>
          </Link>

          {/* Bloque Materiales */}
          <Link to="/materials" className="dashboard-card">
            <h3>📚 Materiales de apoyo</h3>
            <p>Videos y lecturas clave para reforzar tu aprendizaje.</p>
          </Link>

          {/* Bloque Progreso */}
          <Link to="/progress" className="dashboard-card">
            <h3>📈 Progreso</h3>
            <p>Revisa tu avance y los resultados de tus intentos.</p>
          </Link>
        </div>

        {/* Aquí React Router carga la página hija */}
        <div className="outlet-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
