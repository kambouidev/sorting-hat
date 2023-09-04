// types.js
export const CustomJsonType = (value) => {
    // Verifica si es un objeto
    if (typeof value !== 'object' || Array.isArray(value)) {
      console.error('La prop debe ser un objeto JSON válido.');
      return false; // Devuelve falso si no es un objeto
    }
  
    // Verifica si el objeto tiene las propiedades requeridas
    if (!value.title || !value.answers || !Array.isArray(value.answers)) {
      console.error('El objeto JSON debe tener las propiedades "title" y "answers" como se espera.');
      return false;
    }
  
    // Verifica si cada respuesta en "answers" tiene la estructura esperada
    for (const answer of value.answers) {
      if (!answer.title || !answer.scores || typeof answer.scores !== 'object') {
        console.error('Cada respuesta en "answers" debe tener las propiedades "title" y "scores".');
        return false;
      }
    }
  
    // Si todas las validaciones pasan, se considera válido
    return true;
  };
  