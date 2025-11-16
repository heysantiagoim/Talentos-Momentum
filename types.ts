
export interface PaymentTier {
  id: string;
  percentage: string;
  explanation: string;
}

export interface ImportantDates {
  cutoffDate: string;
  paymentDate: string;
  paymentFrequency: string;
}

export interface PaymentMethods {
  transfers: string;
  availableBanks: string;
  currencies: string;
  dollarRate: string;
}

export interface ComplementaryInfo {
  modelObservations: string;
  internalPolicies: string;
  adminResponsibilities: string;
}

export interface Exercise {
  id: string;
  name: string;
  instructions: string;
  target: string;
  completed: boolean;
}

export interface TrainingProgress {
  [key: string]: boolean;
}

export interface TrainerPanelData {
    modelName: string;
    startDate: string;
    hasExperience: boolean;
    internalNotes: string;
}

export interface TrainingData {
  id: string;
  paymentTiers: PaymentTier[];
  importantDates: ImportantDates;
  paymentMethods: PaymentMethods;
  complementaryInfo: ComplementaryInfo;
  exercises: Exercise[];
  progress: TrainingProgress;
  trainerPanel: TrainerPanelData;
}
