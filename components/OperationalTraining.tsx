
import React from 'react';
import { TrainingData } from '../types';
import Card from './Card';
import { ClockIcon, BoxIcon, GlobeAltIcon, WrenchScrewdriverIcon, ChatBubbleLeftRightIcon, PlayIcon } from './Icons';

interface Props {
  data: TrainingData;
  onDataChange: <K extends keyof TrainingData, V>(key: K, value: V) => void;
  onStartPresentation: () => void;
}

const OperationalTraining: React.FC<Props> = ({ data, onDataChange, onStartPresentation }) => {
    const { progress, exercises, trainerPanel } = data;

    const handleExerciseToggle = (id: string) => {
        const newExercises = exercises.map(ex => 
            ex.id === id ? { ...ex, completed: !ex.completed } : ex
        );
        onDataChange('exercises', newExercises);
    };

    const trainingModules = [
        {
            key: 'schedules',
            title: "A. Horarios",
            icon: <ClockIcon />,
            isCompleted: progress.schedules,
            content: [
                'Turnos: Mañana, Tarde, Noche.',
                'Flexibilidad: Opciones de horarios flexibles disponibles.',
                'Protocolos de llegada: Check-in 15 minutos antes del turno.',
                'Funcionamiento en domingos y festivos: Turnos especiales con bonificación.'
            ]
        },
        {
            key: 'starterKit',
            title: "B. Kit Inicial (Modelos Nuevas)",
            icon: <BoxIcon />,
            isCompleted: progress.starterKit,
            content: [
                'Componentes: Lencería básica, juguetes, implementos de aseo.',
                'Uso: Cada elemento tiene un propósito específico para mejorar el show.',
                'Reemplazo: Reportar al monitor cualquier elemento dañado o faltante.'
            ]
        },
        {
            key: 'industryExplanation',
            title: "C. Explicación de la Industria",
            icon: <GlobeAltIcon />,
            isCompleted: progress.industryExplanation,
            content: [
                'Ser modelo webcam es una profesión de entretenimiento y compañía.',
                'La industria se basa en interacciones virtuales con usuarios.',
                'Roles: Modelo, Monitor, Administrador.',
                'Jerarquía de comunicación: Modelo -> Monitor -> Administrador.'
            ]
        },
        {
            key: 'workTools',
            title: "D. Herramientas de Trabajo",
            icon: <WrenchScrewdriverIcon />,
            isCompleted: progress.workTools,
            content: [
                'Plataformas: Conocer las principales páginas y sus reglas.',
                'Menús: Identificar opciones de cobro, tokens, y configuraciones.',
                'Traductores: Uso eficiente para comunicación global.',
                'Flujo de sesión: Protocolo de inicio y cierre seguro.'
            ]
        },
        {
            key: 'monitorCommunication',
            title: "E. Comunicación con el Monitor",
            icon: <ChatBubbleLeftRightIcon />,
            isCompleted: progress.monitorCommunication,
            content: [
                'Canales: Chat interno, comunicación verbal directa.',
                'Tipos de mensajes: Consultas, reportes, solicitudes de apoyo.',
                'Alertas importantes: Cómo reportar usuarios o problemas técnicos.'
            ]
        }
    ];

    return (
        <>
            <div className="mb-6 p-4 bg-brand-surface border border-brand-border rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-lg font-semibold">Guía Interactiva de Capacitación</h2>
                    <p className="text-sm text-brand-text-secondary">Aprende los conceptos operativos paso a paso.</p>
                </div>
                <button 
                onClick={onStartPresentation}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors duration-200 font-semibold"
                >
                <PlayIcon />
                <span>Iniciar Presentación</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {trainingModules.map(module => (
                        <Card key={module.key} title={module.title} icon={module.icon} isCompleted={module.isCompleted}>
                            <ul className="list-disc list-inside text-brand-text-secondary space-y-2 text-sm">
                                {module.content.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </Card>
                    ))}
                </div>
                {trainerPanel.hasExperience && (
                    <div className="md:col-span-1">
                        <Card title="Ejercicios Prácticos">
                        <p className="text-sm text-brand-text-secondary mb-4">Ejercicios para modelos con experiencia para refrescar y validar habilidades.</p>
                            <div className="space-y-4">
                                {exercises.map(ex => (
                                    <div key={ex.id} className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                                        <h5 className="font-semibold">{ex.name}</h5>
                                        <p className="text-xs text-brand-text-secondary mt-1">{ex.instructions}</p>
                                        <p className="text-xs text-brand-accent mt-1"><strong>Target:</strong> {ex.target}</p>
                                        <div className="mt-3">
                                            <label className="flex items-center space-x-2 cursor-pointer text-sm">
                                                <input 
                                                    type="checkbox" 
                                                    checked={ex.completed}
                                                    onChange={() => handleExerciseToggle(ex.id)}
                                                    className="form-checkbox h-4 w-4 rounded bg-brand-surface text-brand-accent border-brand-border focus:ring-brand-accent"
                                                />
                                                <span>Ejercicio completado</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
};

export default OperationalTraining;