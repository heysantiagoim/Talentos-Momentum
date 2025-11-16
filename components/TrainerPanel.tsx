import React, { useState } from 'react';
import { TrainingData, TrainingProgress } from '../types';
import Card from './Card';
import EditableField from './EditableField';

interface Props {
  data: TrainingData;
  onDataChange: <K extends keyof TrainingData, V>(key: K, value: V) => void;
}

const TrainerPanel: React.FC<Props> = ({ data, onDataChange }) => {
  const { trainerPanel, progress } = data;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTrainerFieldChange = (field: keyof typeof trainerPanel, value: string | boolean) => {
    onDataChange('trainerPanel', { ...trainerPanel, [field]: value });
  };

  const handleProgressChange = (key: keyof TrainingProgress) => {
    onDataChange('progress', { ...progress, [key]: !progress[key] });
  };

  const progressItems = [
    { key: 'paymentTiers', label: 'Porcentajes de Pago' },
    { key: 'importantDates', label: 'Fechas Importantes' },
    { key: 'paymentMethods', label: 'Métodos de Pago' },
    { key: 'complementaryInfo', label: 'Info. Complementaria' },
    { key: 'schedules', label: 'Horarios' },
    { key: 'starterKit', label: 'Kit Inicial' },
    { key: 'industryExplanation', label: 'Explicación Industria' },
    { key: 'workTools', label: 'Herramientas de Trabajo' },
    { key: 'monitorCommunication', label: 'Comunicación con Monitor' },
  ];

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = progressItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const completedTopics = progressItems
            .filter(item => progress[item.key as keyof TrainingProgress])
            .map(item => item.label);

        const pendingTopics = progressItems
            .filter(item => !progress[item.key as keyof TrainingProgress])
            .map(item => item.label);

        const prompt = `
            Actúa como un capacitador profesional para modelos webcam. Genera un resumen conciso y profesional del progreso de la capacitación para la siguiente modelo:

            - **Nombre:** ${trainerPanel.modelName}
            - **Fecha de Inicio:** ${trainerPanel.startDate}
            - **Tiene Experiencia:** ${trainerPanel.hasExperience ? 'Sí' : 'No'}

            **Progreso de la Capacitación:**
            - **Temas Completados (${completedTopics.length}/${totalCount}):**
              - ${completedTopics.length > 0 ? completedTopics.join('\n  - ') : 'Ninguno'}
            - **Temas Pendientes (${pendingTopics.length}/${totalCount}):**
              - ${pendingTopics.length > 0 ? pendingTopics.join('\n  - ') : 'Ninguno'}

            **Notas Internas del Capacitador:**
            "${trainerPanel.internalNotes || 'No hay notas adicionales.'}"

            **Instrucciones para el resumen:**
            1. Comienza con un saludo y el nombre de la modelo.
            2. Menciona el estado general de su progreso (ej. "ha mostrado un excelente progreso", "está avanzando a buen ritmo", "necesita enfocarse en...").
            3. Destaca los temas que ya domina y las áreas que aún necesitan trabajo.
            4. Incorpora las notas internas para dar un toque más personal al resumen.
            5. Finaliza con una recomendación o siguiente paso claro.
            6. El resumen debe ser claro, directo, estar en español y no exceder las 150 palabras.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        alert(response.text);

    } catch (error) {
        console.error("Error al generar el resumen:", error);
        alert("Hubo un error al generar el resumen. Revisa la consola para más detalles.");
    } finally {
        setIsGenerating(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Información Administrativa de la Modelo">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableField label="Nombre de la Modelo" value={trainerPanel.modelName} onChange={(val) => handleTrainerFieldChange('modelName', val)} />
            <EditableField label="Fecha de Inicio" value={trainerPanel.startDate} onChange={(val) => handleTrainerFieldChange('startDate', val)} type="date" />
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <label htmlFor="hasExperience" className="text-sm font-medium text-brand-text-secondary">¿Tiene experiencia previa?</label>
            <button 
                onClick={() => handleTrainerFieldChange('hasExperience', !trainerPanel.hasExperience)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${trainerPanel.hasExperience ? 'bg-brand-accent' : 'bg-brand-border'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${trainerPanel.hasExperience ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm">{trainerPanel.hasExperience ? 'Sí' : 'No'}</span>
          </div>
          <div className="mt-4">
             <EditableField label="Notas Internas del Capacitador" value={trainerPanel.internalNotes} onChange={(val) => handleTrainerFieldChange('internalNotes', val)} type="textarea" />
          </div>
        </Card>
        
        <Card title="Checklist de Capacitación">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                {progressItems.map(item => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer p-1">
                        <input
                            type="checkbox"
                            checked={progress[item.key as keyof TrainingProgress]}
                            onChange={() => handleProgressChange(item.key as keyof TrainingProgress)}
                            className="form-checkbox h-4 w-4 rounded bg-brand-surface text-brand-accent border-brand-border focus:ring-brand-accent"
                        />
                        <span className="text-sm">{item.label}</span>
                    </label>
                ))}
            </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="Avance de la Capacitación">
          <div className="space-y-4">
            <p className="text-center text-brand-text-secondary">Progreso Total</p>
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 mx-auto">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e0e0e0" strokeWidth="10" fill="transparent" />
                    <circle
                        cx="50" cy="50" r="45"
                        stroke="#0a0a0a"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                </div>
            </div>
            <p className="text-center text-sm text-brand-text-secondary">{completedCount} de {totalCount} temas explicados</p>
            <div className="text-center">
              <button 
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary disabled:cursor-not-allowed w-full"
              >
                  {isGenerating ? 'Generando...' : 'Generar Resumen'}
              </button>
            </div>
          </div>
        </Card>
        
        <div className="mt-6">
            <Card title="Recordatorios">
                <ul className="list-disc list-inside text-brand-text-secondary space-y-2 text-sm">
                    {trainerPanel.hasExperience && <li>Recordar asignar ejercicios prácticos.</li>}
                    <li>Verificar la configuración de pago de la modelo.</li>
                    <li>Agendar una sesión de seguimiento en una semana.</li>
                </ul>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainerPanel;