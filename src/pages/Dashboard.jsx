import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Dashboard(){
  return (
    <div className="app-root">
      <Sidebar />
      <main className="content-area">
        <div className="header-row">
          <div className="section-title">Panel</div>
          <div className="small muted">Bienvenido — empieza por Materiales o Quizzes</div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
