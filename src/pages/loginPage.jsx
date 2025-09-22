import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage(){
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    // simulacro
    if(user.trim() && pwd === "demo123"){
      login(user.trim());
      nav("/");
    } else {
      setErr("Credenciales incorrectas (usa password demo123).");
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
              <input className="input" value={user} onChange={(e)=>setUser(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="small muted">Contraseña</label>
              <input className="input" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} />
            </div>
            {err && <div style={{color:"#ff6b6b"}}>{err}</div>}
            <div className="login-actions">
              <div className="link-small muted">¿Olvidaste tu contraseña?</div>
              <button className="btn btn-wide" type="submit">Entrar</button>
            </div>
            <div className="muted small" style={{marginTop:10}}>Usuario libre: cualquier texto | Contraseña: <code>demo123</code></div>
          </form>
        </div>
      </div>
    </div>
  );
}
