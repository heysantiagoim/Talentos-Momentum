
import React, { useCallback } from 'react';
import { TrainingData, PaymentTier } from '../types';
import Card from './Card';
import EditableField from './EditableField';
import { PercentIcon, CalendarIcon, CreditCardIcon, InfoIcon, PlusIcon, TrashIcon, PlayIcon } from './Icons';

interface Props {
  data: TrainingData;
  onDataChange: <K extends keyof TrainingData, V>(key: K, value: V) => void;
  onStartPresentation: () => void;
}

const AdministrativeOnboarding: React.FC<Props> = ({ data, onDataChange, onStartPresentation }) => {
  const { paymentTiers, importantDates, paymentMethods, complementaryInfo, progress } = data;

  const handleTierChange = useCallback((id: string, field: keyof PaymentTier, value: string) => {
    const newTiers = paymentTiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    );
    onDataChange('paymentTiers', newTiers);
  }, [paymentTiers, onDataChange]);

  const addTier = () => {
    if (paymentTiers.length < 5) {
      const newTier: PaymentTier = { id: `tier${Date.now()}`, percentage: '', explanation: '' };
      onDataChange('paymentTiers', [...paymentTiers, newTier]);
    }
  };

  const removeTier = (id: string) => {
    onDataChange('paymentTiers', paymentTiers.filter(tier => tier.id !== id));
  };
  
  const handleFieldChange = <T, K extends keyof T>(
    objectKey: keyof TrainingData,
    fieldKey: K,
    value: T[K],
    currentObject: T
  ) => {
    onDataChange(objectKey, { ...currentObject, [fieldKey]: value });
  };


  return (
    <>
      <div className="mb-6 p-4 bg-brand-surface border border-brand-border rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold">Guía Interactiva de Onboarding</h2>
          <p className="text-sm text-brand-text-secondary">Explora los temas administrativos de forma secuencial.</p>
        </div>
        <button 
          onClick={onStartPresentation}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-hover transition-colors duration-200 font-semibold"
        >
          <PlayIcon />
          <span>Iniciar Presentación</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Porcentajes de Pago" icon={<PercentIcon />} isCompleted={progress.paymentTiers}>
          {paymentTiers.map((tier, index) => (
            <div key={tier.id} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-start p-2 border-b border-brand-border last:border-b-0">
              <EditableField
                label={`Nivel ${index + 1} (%)`}
                value={tier.percentage}
                onChange={(val) => handleTierChange(tier.id, 'percentage', val)}
                type="number"
              />
              <EditableField
                label="Explicación"
                value={tier.explanation}
                onChange={(val) => handleTierChange(tier.id, 'explanation', val)}
              />
              <button
                onClick={() => removeTier(tier.id)}
                className="h-10 mt-2 sm:mt-0 text-red-500 hover:text-red-700 transition-colors"
                aria-label="Eliminar nivel"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          {paymentTiers.length < 5 && (
              <button
              onClick={addTier}
              className="flex items-center justify-center space-x-2 w-full mt-2 px-4 py-2 rounded-lg bg-brand-accent/5 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/10 transition-colors duration-200"
              >
              <PlusIcon />
              <span>Añadir Nivel</span>
              </button>
          )}
        </Card>

        <Card title="Fechas Importantes" icon={<CalendarIcon />} isCompleted={progress.importantDates}>
          <EditableField label="Fecha de Corte" value={importantDates.cutoffDate} onChange={(val) => handleFieldChange('importantDates', 'cutoffDate', val, importantDates)} />
          <EditableField label="Fecha de Pago" value={importantDates.paymentDate} onChange={(val) => handleFieldChange('importantDates', 'paymentDate', val, importantDates)} />
          <EditableField label="Frecuencia de Pago" value={importantDates.paymentFrequency} onChange={(val) => handleFieldChange('importantDates', 'paymentFrequency', val, importantDates)} />
        </Card>

        <Card title="Métodos de Pago" icon={<CreditCardIcon />} isCompleted={progress.paymentMethods}>
          <EditableField label="Transferencias" value={paymentMethods.transfers} onChange={(val) => handleFieldChange('paymentMethods', 'transfers', val, paymentMethods)} type="textarea" />
          <EditableField label="Bancos Disponibles" value={paymentMethods.availableBanks} onChange={(val) => handleFieldChange('paymentMethods', 'availableBanks', val, paymentMethods)} type="textarea"/>
          <EditableField label="Monedas" value={paymentMethods.currencies} onChange={(val) => handleFieldChange('paymentMethods', 'currencies', val, paymentMethods)} />
          <EditableField label="Tasa del Dólar del Estudio" value={paymentMethods.dollarRate} onChange={(val) => handleFieldChange('paymentMethods', 'dollarRate', val, paymentMethods)} />
        </Card>

        <Card title="Información Complementaria" icon={<InfoIcon />} isCompleted={progress.complementaryInfo}>
          <EditableField label="Observaciones de la Modelo" value={complementaryInfo.modelObservations} onChange={(val) => handleFieldChange('complementaryInfo', 'modelObservations', val, complementaryInfo)} type="textarea" />
          <EditableField label="Políticas Internas Básicas" value={complementaryInfo.internalPolicies} onChange={(val) => handleFieldChange('complementaryInfo', 'internalPolicies', val, complementaryInfo)} type="textarea" />
          <EditableField label="Responsabilidades Administrativas" value={complementaryInfo.adminResponsibilities} onChange={(val) => handleFieldChange('complementaryInfo', 'adminResponsibilities', val, complementaryInfo)} type="textarea" />
        </Card>
      </div>
    </>
  );
};

export default AdministrativeOnboarding;