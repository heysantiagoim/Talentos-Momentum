
import React from 'react';
import { TrainingData, TrainingProgress } from '../types';
import { PlusIcon, UserIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './Icons';

interface ModelSelectorProps {
    models: TrainingData[];
    onSelect: (id: string) => void;
    onCreate: () => void;
    onDelete: (id: string) => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, onSelect, onCreate, onDelete, onExport, onImport }) => {

    const calculateProgress = (progress: TrainingProgress) => {
        const totalCount = Object.keys(progress).length;
        if (totalCount === 0) return 0;
        const completedCount = Object.values(progress).filter(Boolean).length;
        return Math.round((completedCount / totalCount) * 100);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if(window.confirm(`¿Estás seguro de que quieres eliminar a ${name}? Esta acción no se puede deshacer.`)) {
            onDelete(id);
        }
    }

    const importInputRef = React.useRef<HTMLInputElement>(null);

    const triggerImport = () => {
        importInputRef.current?.click();
    };


    return (
        <div className="max-w-4xl mx-auto">
             <header className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
                <div className="flex items-center space-x-3">
                    <div className="bg-brand-accent p-2 rounded-lg text-brand-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h1 className="text-lg sm:text-2xl font-bold text-brand-text-primary">
                    Talentos Momentum
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        ref={importInputRef}
                        onChange={onImport}
                        accept="application/json"
                        className="hidden"
                        id="import-file-input"
                    />
                    <button 
                        onClick={triggerImport}
                        className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border transition-colors"
                        title="Importar Datos"
                        aria-label="Importar datos desde un archivo"
                    >
                        <ArrowUpTrayIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Importar</span>
                    </button>
                    <button 
                        onClick={onExport}
                        className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border transition-colors"
                        title="Exportar Datos"
                        aria-label="Exportar datos a un archivo"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                </div>
            </header>
            
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold">Gestión de Modelos</h2>
                <p className="text-brand-text-secondary mt-1">Selecciona una modelo para ver su progreso o añade una nueva.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button 
                    onClick={onCreate}
                    className="flex flex-col items-center justify-center p-6 bg-brand-surface border-2 border-dashed border-brand-border rounded-xl hover:border-brand-accent hover:bg-brand-accent/5 text-brand-text-secondary hover:text-brand-accent transition-all duration-300 min-h-[180px]"
                >
                    <PlusIcon className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Añadir Nueva Modelo</span>
                </button>

                {models.map(model => (
                    <div key={model.id} onClick={() => onSelect(model.id)} className="group relative bg-brand-surface border border-brand-border rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:border-brand-accent transition-all duration-300 min-h-[180px]">
                        <div>
                            <div className="flex items-center space-x-3">
                                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-border flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-brand-text-secondary" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-lg text-brand-text-primary truncate">{model.trainerPanel.modelName || 'Sin Nombre'}</h3>
                                    <p className="text-xs text-brand-text-secondary">Inició: {model.trainerPanel.startDate}</p>
                                </div>
                            </div>

                             <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-brand-text-secondary">Progreso</span>
                                    <span className="text-xs font-bold text-brand-accent">{calculateProgress(model.progress)}%</span>
                                </div>
                                <div className="w-full bg-brand-border rounded-full h-2">
                                    <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${calculateProgress(model.progress)}%` }}></div>
                                </div>
                            </div>
                        </div>

                         <button 
                            onClick={(e) => handleDelete(e, model.id, model.trainerPanel.modelName)}
                            className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center bg-brand-bg/50 rounded-full text-brand-text-secondary hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Eliminar modelo"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            {models.length === 0 && (
                <div className="sm:col-span-2 lg:col-span-3 text-center py-10">
                    <p className="text-brand-text-secondary">No hay modelos registradas. ¡Añade la primera!</p>
                </div>
            )}
        </div>
    );
};

export default ModelSelector;
