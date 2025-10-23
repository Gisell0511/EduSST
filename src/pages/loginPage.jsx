import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../config/api";

export default function LoginPage(){
  const { login, loginSimple } = useContext(AuthContext);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Primero intentar con el backend si está disponible
      if (user.trim() && pwd) {
        const backendResult = await tryBackendLogin(user.trim(), pwd);
        if (backendResult.success) {
          nav("/");
          return;
        }
      }

      // Fallback al método original si el backend falla o no hay password
      if (user.trim() && pwd === "demo123") {
        loginSimple(user.trim());
        nav("/");
      } else {
        setErr("Credenciales incorrectas (usa password demo123).");
      }
    } catch (error) {
      // Si hay error de conexión, usar método original
      console.log("Backend no disponible, usando modo demo");
      if (user.trim() && pwd === "demo123") {
        loginSimple(user.trim());
        nav("/");
      } else {
        setErr("Credenciales incorrectas (usa password demo123).");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para intentar login con backend
  const tryBackendLogin = async (username, password) => {
    try {
      const response = await api.login({ 
        username: username.trim(), 
        password 
      });
      
      if (response.success) {
        // Usar el login del backend que maneja tokens
        await login({ username: username.trim(), password });
        return { success: true };
      } else {
        // Si el backend rechaza las credenciales, no mostramos error
        // para permitir el fallback al método demo
        return { success: false };
      }
    } catch (error) {
      // Error de conexión, permitir fallback
      console.log("Error de conexión con backend:", error);
      return { success: false };
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-left card">
          <div className="brand">
            <div className="logo-square">PCA</div>
            <div>
              <div className="h1">Plataforma SST</div>
              <div className="hint small">Formación - Politécnico de la Costa</div>
            </div>
          </div>
          <p className="small muted" style={{marginTop:12}}>
            Accede para practicar quizzes interactivos, ver material didáctico y medir tu progreso.
          </p>
          <div className="gradient-stripe"></div>
        </div>
        <div className="login-right card">
          <h3 style={{color:"var(--pca-blue)"}}>Iniciar sesión</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="small muted">Usuario</label>
              <input 
                className="input" 
                value={user} 
                onChange={(e)=>setUser(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="small muted">Contraseña</label>
              <input 
                className="input" 
                type="password" 
                value={pwd} 
                onChange={(e)=>setPwd(e.target.value)}
                disabled={loading}
              />
            </div>
            {err && <div style={{color:"#ff6b6b"}}>{err}</div>}
            <div className="login-actions">
              <div className="link-small muted">¿Olvidaste tu contraseña?</div>
              <button 
                className="btn btn-wide" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Conectando..." : "Entrar"}
              </button>
            </div>
            <div className="muted small" style={{marginTop:10}}>
              Usuario libre: cualquier texto | Contraseña: <code>demo123</code>
              {loading && <div>Intentando conectar con servidor...</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}