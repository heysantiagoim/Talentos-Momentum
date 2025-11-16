
import React, { useState, useCallback, useEffect } from 'react';
import { initialData } from './constants';
import { TrainingData, PaymentTier } from './types';
import AdministrativeOnboarding from './components/AdministrativeOnboarding';
import OperationalTraining from './components/OperationalTraining';
import TrainerPanel from './components/TrainerPanel';
import PresentationView, { Slide } from './components/PresentationView';
import ModelSelector from './components/ModelSelector';
import { EyeIcon, UserIcon, ArrowLeftIcon, PercentIcon, CalendarIcon, CreditCardIcon, InfoIcon, ClockIcon, BoxIcon, GlobeAltIcon, WrenchScrewdriverIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ShieldCheckIcon, BellAlertIcon } from './components/Icons';

type View = 'model' | 'trainer';

const App: React.FC = () => {
  const [allModelsData, setAllModelsData] = useState<TrainingData[]>([]);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [view, setView] = useState<View>('model');
  const [activeSection, setActiveSection] = useState<string>('onboarding');
  const [presentationSlides, setPresentationSlides] = useState<Slide[]>([]);
  const [presentationTitle, setPresentationTitle] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('talentosMomentumModels');
      if (storedData) {
        setAllModelsData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('talentosMomentumModels');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('talentosMomentumModels', JSON.stringify(allModelsData));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [allModelsData, isLoaded]);

  const currentModelData = allModelsData.find(m => m.id === currentModelId);

  const handleDataChange = useCallback(<K extends keyof TrainingData, V>(
    key: K,
    value: V
  ) => {
    setAllModelsData(prevAllData => 
      prevAllData.map(model => 
        model.id === currentModelId 
          ? { ...model, [key]: value } 
          : model
      )
    );
  }, [currentModelId]);

  const handleSelectModel = (id: string) => {
    setCurrentModelId(id);
    setView('model');
    setActiveSection('onboarding');
  };

  const handleCreateModel = () => {
    const newModel: TrainingData = {
        ...JSON.parse(JSON.stringify(initialData)),
        id: `model_${Date.now()}`,
        trainerPanel: {
            ...initialData.trainerPanel,
            modelName: `Nueva Modelo ${allModelsData.length + 1}`,
            startDate: new Date().toISOString().split('T')[0],
        }
    };
    setAllModelsData(prev => [...prev, newModel]);
    setCurrentModelId(newModel.id);
  };

  const handleDeleteModel = (id: string) => {
    setAllModelsData(prev => prev.filter(model => model.id !== id));
    if (currentModelId === id) {
        setCurrentModelId(null);
    }
  };
  
  const handleGoBack = () => {
      setCurrentModelId(null);
  }

  const handleExportData = useCallback(() => {
    if (allModelsData.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }
    try {
        const dataStr = JSON.stringify(allModelsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        link.download = `talentos-momentum-backup-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting data:", error);
        alert("Ocurrió un error al exportar los datos.");
    }
  }, [allModelsData]);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    if (!window.confirm("¿Estás seguro de importar estos datos? Se sobrescribirán todos los datos actuales.")) {
        // Clear the file input value so the user can select the same file again if they cancel and then change their mind.
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error("El archivo no es válido.");
            }
            const importedData = JSON.parse(text);
            
            // Basic validation
            if (!Array.isArray(importedData) || importedData.some(item => !item.id || !item.trainerPanel)) {
                 throw new Error("El formato del archivo JSON no es válido.");
            }

            setAllModelsData(importedData);
            alert("¡Datos importados con éxito!");
        } catch (error) {
            console.error("Error importing data:", error);
            alert(`Ocurrió un error al importar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };
    reader.onerror = () => {
        alert("Error al leer el archivo.");
    };
    reader.readAsText(file);
    // Reset file input to allow importing the same file again
    event.target.value = '';
  }, []);

  const startOnboardingPresentation = () => {
    if (!currentModelData) return;
    const slides: Slide[] = [
      {
        title: "¿Cómo se calculan mis ganancias?",
        icon: <PercentIcon />,
        content: (
          <div className="space-y-4">
            <p>Tus ganancias se basan en un sistema de porcentajes escalonado. A medida que tu rendimiento mejora, tu porcentaje también lo hace.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {currentModelData.paymentTiers.map(tier => (
                <div key={tier.id} className="p-4 rounded-lg bg-brand-bg border border-brand-border flex flex-col justify-center">
                  <p className="text-3xl font-bold text-brand-accent">{tier.percentage}%</p>
                  <p className="text-xs text-brand-text-secondary mt-1">{tier.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "¿Cuándo me pagan?",
        icon: <CalendarIcon />,
        content: (
          <div className="space-y-4">
            <p>Tu ciclo de pago es semanal y consistente. Estas son las fechas clave que debes recordar:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex flex-col justify-center">
                    <p className="text-sm font-semibold text-brand-text-secondary">Corte de Facturación</p>
                    <p className="text-2xl font-bold text-brand-accent mt-1">Cada Martes</p>
                    <p className="text-xs text-brand-text-secondary mt-1">Cierre a las 11:59 PM.</p>
                </div>
                <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex flex-col justify-center">
                    <p className="text-sm font-semibold text-brand-text-secondary">Fecha de Pago</p>
                    <p className="text-2xl font-bold text-brand-accent mt-1">Cada Viernes</p>
                    <p className="text-xs text-brand-text-secondary mt-1">Recibes el pago de la semana anterior.</p>
                </div>
            </div>
          </div>
        )
      },
      {
        title: "¿Qué métodos de pago utilizan?",
        icon: <CreditCardIcon />,
        content: (
            <div className="space-y-4">
                <p>Ofrecemos flexibilidad para que recibas tu dinero de forma cómoda y segura a través de diversas opciones:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                        <p className="font-semibold text-brand-text-primary">Medios Aceptados</p>
                        <p className="text-sm text-brand-text-secondary mt-1">{currentModelData.paymentMethods.transfers}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                        <p className="font-semibold text-brand-text-primary">Bancos Principales</p>
                        <p className="text-sm text-brand-text-secondary mt-1">{currentModelData.paymentMethods.availableBanks}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                        <p className="font-semibold text-brand-text-primary">Monedas</p>
                        <p className="text-sm text-brand-text-secondary mt-1">Pagos en <strong>{currentModelData.paymentMethods.currencies}</strong>.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                        <p className="font-semibold text-brand-text-primary">Tasa de Cambio (USD)</p>
                        <p className="text-sm text-brand-text-secondary mt-1">{currentModelData.paymentMethods.dollarRate}</p>
                    </div>
                </div>
            </div>
        )
      },
      {
        title: "¿Qué se espera de mí?",
        icon: <InfoIcon />,
        content: (
           <div className="space-y-4">
            <p>Tu principal responsabilidad es ser profesional y cumplir con tus compromisos. Esto incluye principalmente dos áreas:</p>
            <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-brand-bg border border-brand-border">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Responsabilidades Administrativas</h4>
                        <p className="text-sm text-brand-text-secondary">{currentModelData.complementaryInfo.adminResponsibilities}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-brand-bg border border-brand-border">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Políticas Internas Básicas</h4>
                        <p className="text-sm text-brand-text-secondary">{currentModelData.complementaryInfo.internalPolicies}</p>
                    </div>
                </div>
            </div>
          </div>
        )
      },
    ];
    setPresentationTitle("Guía de Onboarding Administrativo");
    setPresentationSlides(slides);
  };
  
    const startTrainingPresentation = () => {
    if (!currentModelData) return;
    const slides: Slide[] = [
        { 
            title: "¿Cuáles son nuestros horarios?", 
            icon: <ClockIcon />, 
            content: (
                 <div className="space-y-4">
                    <p>Ofrecemos flexibilidad con varios turnos y condiciones claras para que puedas organizarte:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-bold text-lg text-brand-text-primary">Mañana</p>
                            <p className="text-sm text-brand-text-secondary">6am - 2pm</p>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-bold text-lg text-brand-text-primary">Tarde</p>
                            <p className="text-sm text-brand-text-secondary">2pm - 10pm</p>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-bold text-lg text-brand-text-primary">Noche</p>
                            <p className="text-sm text-brand-text-secondary">10pm - 6am</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-brand-bg border border-brand-border">
                            <CheckCircleIcon className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm"><strong>Llegada:</strong> Debes hacer check-in 15 minutos antes de tu turno.</span>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-brand-bg border border-brand-border">
                            <CheckCircleIcon className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm"><strong>Festivos:</strong> Los turnos en domingos y festivos tienen una bonificación especial.</span>
                        </div>
                    </div>
                </div>
            ) 
        },
        { 
            title: "¿Qué incluye mi kit inicial?", 
            icon: <BoxIcon />, 
            content: (
                <div className="space-y-4">
                    <p>Para modelos nuevas, proveemos un kit con lo esencial para empezar con todo lo necesario:</p>
                    <div className="p-4 rounded-lg bg-brand-bg border border-brand-border space-y-3">
                        <p className="font-semibold text-brand-text-primary">Componentes Principales:</p>
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                                <CheckCircleIcon className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-brand-text-secondary">Lencería básica para diversos shows.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <CheckCircleIcon className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-brand-text-secondary">Juguetes iniciales para interactuar.</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <CheckCircleIcon className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-brand-text-secondary">Implementos de aseo y cuidado personal.</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-brand-accent/5 border border-brand-accent/20">
                         <p className="font-semibold text-brand-text-primary">Uso y Reemplazo</p>
                         <p className="text-sm text-brand-text-secondary mt-1">Cada elemento es para mejorar tu show. Reporta a tu monitor si algo se daña o se pierde para gestionarlo.</p>
                    </div>
                </div>
            ) 
        },
        { 
            title: "¿Qué significa ser modelo webcam?", 
            icon: <GlobeAltIcon />, 
            content: (
                 <div className="space-y-4">
                    <p>Ser modelo webcam profesional es un trabajo de entretenimiento y conexión. Es clave entender los roles:</p>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-semibold text-brand-text-primary">Tu Rol: Artista y Anfitriona</p>
                            <p className="text-sm text-brand-text-secondary mt-1">Eres la creadora de una experiencia en un espacio virtual, donde la conexión es clave.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-semibold text-brand-text-primary">El Equipo de Apoyo</p>
                            <p className="text-sm text-brand-text-secondary mt-1">Trabajarás con un <strong>Monitor</strong> que te apoya y un <strong>Administrador</strong> que gestiona la operación. Tu principal punto de contacto es siempre tu monitor.</p>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            title: "¿Qué herramientas voy a usar?", 
            icon: <WrenchScrewdriverIcon />, 
            content: (
                <div className="space-y-4">
                    <p>Te familiarizarás con varias herramientas digitales para realizar tu trabajo de forma efectiva:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex items-start space-x-3">
                            <GlobeAltIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-brand-text-primary">Plataformas</p>
                                <p className="text-xs text-brand-text-secondary mt-1">Las páginas web donde transmites. Cada una tiene sus reglas y público.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex items-start space-x-3">
                            <WrenchScrewdriverIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-brand-text-primary">Menús de Página</p>
                                <p className="text-xs text-brand-text-secondary mt-1">Para controlar tu show, ver ganancias y configurar tu perfil.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex items-start space-x-3">
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-brand-text-primary">Traductores</p>
                                <p className="text-xs text-brand-text-secondary mt-1">Clave para comunicarte con usuarios de todo el mundo.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border flex items-start space-x-3">
                            <ShieldCheckIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-brand-text-primary">Protocolos Seguros</p>
                                <p className="text-xs text-brand-text-secondary mt-1">Para iniciar y cerrar sesión de forma segura y proteger tu información.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) 
        },
        { 
            title: "¿Cómo me comunico con mi monitor?", 
            icon: <ChatBubbleLeftRightIcon />, 
            content: (
                 <div className="space-y-4">
                    <p>La comunicación con tu monitor es constante y fundamental para tu éxito. Así es como funciona:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-semibold text-brand-text-primary mb-2">Canales Principales</p>
                            <ul className="text-sm text-brand-text-secondary space-y-2">
                                <li>✓ Chat interno (rápido)</li>
                                <li>✓ Verbal directa (urgente)</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-brand-bg border border-brand-border">
                            <p className="font-semibold text-brand-text-primary mb-2">¿Qué Comunicar?</p>
                            <ul className="text-sm text-brand-text-secondary space-y-2">
                                <li>✓ Consultas y apoyo</li>
                                <li>✓ Reporte de fallas</li>
                                <li>✓ Situaciones con usuarios</li>
                            </ul>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-brand-bg border-2 border-brand-accent flex items-start space-x-3">
                        <BellAlertIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-brand-text-primary">Alertas Inmediatas</p>
                            <p className="text-sm text-brand-text-secondary mt-1">Usa el protocolo de alerta para situaciones incómodas o problemas técnicos graves. Tu seguridad es la prioridad.</p>
                        </div>
                    </div>
                </div>
            ) 
        },
    ];
    
    setPresentationTitle("Guía de Capacitación Operativa");
    setPresentationSlides(slides);
  };
  
  const closePresentation = () => {
      setPresentationSlides([]);
      setPresentationTitle('');
  }

  if (!currentModelId || !currentModelData) {
      return (
          <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans p-4 sm:p-6 lg:p-8">
              <ModelSelector 
                models={allModelsData} 
                onSelect={handleSelectModel}
                onCreate={handleCreateModel}
                onDelete={handleDeleteModel}
                onExport={handleExportData}
                onImport={handleImportData}
              />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans p-4 sm:p-6 lg:p-8">
       {presentationSlides.length > 0 && (
        <PresentationView title={presentationTitle} slides={presentationSlides} onClose={closePresentation} />
      )}
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
          <div className="flex items-center space-x-3">
            <button onClick={handleGoBack} className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border transition-colors duration-200">
                <ArrowLeftIcon />
                <span className="hidden sm:inline">Lista</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-brand-text-primary truncate" title={currentModelData.trainerPanel.modelName}>
              {currentModelData.trainerPanel.modelName}
            </h1>
          </div>
          <button
            onClick={() => setView(view === 'model' ? 'trainer' : 'model')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border transition-colors duration-200"
          >
            {view === 'model' ? <UserIcon /> : <EyeIcon />}
            <span className="hidden sm:inline">{view === 'model' ? 'Vista Capacitador' : 'Vista Modelo'}</span>
          </button>
        </header>

        <main>
          {view === 'model' && (
            <div>
              <nav className="flex space-x-2 sm:space-x-4 mb-6 p-1 bg-brand-surface rounded-lg border border-brand-border">
                  <button onClick={() => setActiveSection('onboarding')} className={`w-full py-2.5 text-sm font-medium rounded-md transition-colors ${activeSection === 'onboarding' ? 'bg-brand-accent text-brand-bg' : 'text-brand-text-secondary hover:bg-brand-border/50'}`}>Onboarding Administrativo</button>
                  <button onClick={() => setActiveSection('training')} className={`w-full py-2.5 text-sm font-medium rounded-md transition-colors ${activeSection === 'training' ? 'bg-brand-accent text-brand-bg' : 'text-brand-text-secondary hover:bg-brand-border/50'}`}>Capacitación Operativa</button>
              </nav>
              {activeSection === 'onboarding' && <AdministrativeOnboarding data={currentModelData} onDataChange={handleDataChange} onStartPresentation={startOnboardingPresentation} />}
              {activeSection === 'training' && <OperationalTraining data={currentModelData} onDataChange={handleDataChange} onStartPresentation={startTrainingPresentation} />}
            </div>
          )}

          {view === 'trainer' && (
             <TrainerPanel data={currentModelData} onDataChange={handleDataChange} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
