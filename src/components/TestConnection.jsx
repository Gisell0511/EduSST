import React, { useEffect, useState } from 'react';
import { api } from '../config/api';

const TestConnection = () => {
  const [status, setStatus] = useState('Probando...');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setStatus('🔍 Probando conexión con backend...');
      
      // 1. Health check
      const health = await api.healthCheck();
      if (!health.success) {
        setStatus('❌ Backend no responde');
        return;
      }

      setStatus('✅ Backend funcionando, obteniendo categorías...');

      // 2. Obtener categorías
      const categoriesResult = await api.getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
        setStatus(`✅ Conectado! ${categoriesResult.data.length} categorías cargadas`);
      } else {
        setStatus('❌ Error al cargar categorías');
      }

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h3>🔌 Prueba de Conexión Backend</h3>
      <p><strong>Estado:</strong> {status}</p>
      
      {categories.length > 0 && (
        <div>
          <h4>📋 Categorías Disponibles:</h4>
          <ul>
            {categories.slice(0, 5).map(cat => (
              <li key={cat.id}>
                {cat.name} ({cat.level}) - {cat.total_questions} preguntas
              </li>
            ))}
          </ul>
          {categories.length > 5 && <p>... y {categories.length - 5} más</p>}
        </div>
      )}
      
      <button 
        onClick={testBackendConnection}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        🔄 Probar Nuevamente
      </button>
    </div>
  );
};

export default TestConnection;