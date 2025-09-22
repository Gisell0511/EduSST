import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ProgressContext } from "../contexts/ProgressContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { points } = useContext(ProgressContext);
  const loc = useLocation();

  const items = [
    { to: "/materials", label: "Materiales" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/progress", label: "Progreso" },
  ];

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">
          {(user?.name || "U").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="username">{user?.name || "Usuario"}</div>
          <div className="small muted">
            Puntos <span className="points-bubble">{points}</span>
          </div>
        </div>
      </div>

      <nav className="nav" aria-label="Main navigation">
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className={`nav-item ${loc.pathname === i.to ? "active" : ""}`}
          >
            {i.label}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 20 }}>
        <button className="btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
