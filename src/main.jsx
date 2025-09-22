import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext"; // si ya existe

import "./styles/global.css";
import "./styles/login.css";
import "./styles/dashboard.css";
import "./styles/quiz.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
