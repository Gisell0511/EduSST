export const QUIZ_LEVELS = {
  BASIC: {
    id: 'basic',
    name: 'Básico',
    description: 'Conceptos fundamentales de SST',
    requiredScore: 0, // Siempre disponible
    order: 1,
    color: '#10b981'
  },
  INTERMEDIATE: {
    id: 'intermediate', 
    name: 'Intermedio',
    description: 'Aplicación de normas y procedimientos',
    requiredScore: 70, // Necesita 70% en básico
    order: 2,
    color: '#f59e0b'
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Avanzado',
    description: 'Gestión integral y casos complejos',
    requiredScore: 80, // Necesita 80% en intermedio
    order: 3,
    color: '#ef4444'
  }
};

export const getAvailableLevels = (userProgress) => {
  const levels = Object.values(QUIZ_LEVELS);
  const availableLevels = [];
  
  for (const level of levels) {
    const isUnlocked = userProgress >= level.requiredScore;
    availableLevels.push({
      ...level,
      unlocked: isUnlocked,
      canAccess: isUnlocked
    });
  }
  
  return availableLevels;
};