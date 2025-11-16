
import { TrainingData } from './types';

export const initialData: TrainingData = {
  id: 'template',
  paymentTiers: [
    { id: 'tier1', percentage: '45', explanation: 'Nivel inicial para nuevas modelos durante su primer mes.' },
    { id: 'tier2', percentage: '50', explanation: 'Se alcanza al superar consistentemente las metas de facturación.' },
    { id: 'tier3', percentage: '55', explanation: 'Reservado para modelos con rendimiento excepcional y antigüedad.' },
  ],
  importantDates: {
    cutoffDate: 'Martes a las 11:59 PM (cierre de facturación semanal).',
    paymentDate: 'Viernes de cada semana (recibes el pago de la semana anterior).',
    paymentFrequency: 'Semanal',
  },
  paymentMethods: {
    transfers: 'Transferencia bancaria, Nequi, Daviplata.',
    availableBanks: 'Bancolombia, Davivienda, y otros bancos principales.',
    currencies: 'COP (Pesos Colombianos), USD (Dólares).',
    dollarRate: 'Se utiliza la Tasa Representativa del Mercado (TRM) del día del pago menos un pequeño diferencial administrativo.',
  },
  complementaryInfo: {
    modelObservations: 'Espacio para notas sobre la modelo...',
    internalPolicies: '1. Cumplir los horarios acordados. 2. Mantener una actitud profesional y respetuosa. 3. Proteger la confidencialidad de la información del estudio y los usuarios.',
    adminResponsibilities: 'Tu responsabilidad es reportar tus horas, solicitar pagos a tiempo y mantener tus datos personales actualizados para evitar demoras.',
  },
  exercises: [
    { id: 'ex1', name: 'Digitación Rápida', instructions: 'Utiliza una herramienta en línea para practicar tu velocidad de escritura. El objetivo es responder rápidamente en los chats.', target: 'Alcanzar 50+ palabras por minuto', completed: false },
    { id: 'ex2', name: 'Navegación de Plataformas', instructions: 'Inicia sesión en una plataforma y encuentra las secciones de: historial de ganancias, configuración de perfil y herramientas de bloqueo de usuarios.', target: 'Localizar las 3 secciones en menos de 5 minutos', completed: false },
    { id: 'ex3', name: 'Pruebas de Ángulos', instructions: 'Configura la cámara en 5 ángulos diferentes (ej. primer plano, plano medio, etc.) que resalten tus atributos y guárdalos.', target: '5 ángulos de cámara bien iluminados y configurados', completed: false },
    { id: 'ex4', name: 'Simulación de Conversación', instructions: 'Mantén una conversación de rol con el monitor, utilizando el traductor para responder a preguntas comunes de usuarios.', target: 'Conversación fluida por 5 minutos', completed: false },
  ],
  progress: {
    paymentTiers: false,
    importantDates: false,
    paymentMethods: false,
    complementaryInfo: false,
    schedules: false,
    starterKit: false,
    industryExplanation: false,
    workTools: false,
    monitorCommunication: false,
  },
  trainerPanel: {
    modelName: 'Jane Doe',
    startDate: new Date().toISOString().split('T')[0],
    hasExperience: false,
    internalNotes: 'La modelo muestra buena actitud y disposición para aprender.',
  }
};
