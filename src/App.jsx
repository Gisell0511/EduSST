import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage.jsx";
import Dashboard from "./pages/Dashboard";
import SupportMaterials from "./pages/SupportMaterials";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import { AuthContext } from "./contexts/AuthContext";
import TestConnection from "./components/TestConnection.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas protegidas con layout Dashboard */}
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />}>
        <Route index element={<SupportMaterials />} />
        <Route path="materials" element={<SupportMaterials />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/:level" element={<QuizPage />} /> {/* 👈 Agregar esta línea */}
        <Route path="progress" element={<ProgressPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}