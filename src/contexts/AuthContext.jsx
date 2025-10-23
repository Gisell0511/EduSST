import { createContext, useState, useEffect } from "react";
import { api } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        // Verificar token con backend si está disponible
        try {
          // Puedes agregar una verificación de token aquí si quieres
          setUser(JSON.parse(userData));
        } catch (error) {
          console.log("Token inválido, limpiando datos");
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Método original - mantiene compatibilidad
  const loginSimple = (username) => {
    const userData = { name: username, isDemo: true };
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Nuevo método para backend
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión con el servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,           // Para backend
      loginSimple,     // Método original demo
      logout,
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};