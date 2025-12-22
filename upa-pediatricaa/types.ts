
export type Sex = 'Masculino' | 'Feminino' | 'Outro';

export type Bed = '01' | '02' | '03' | '04' | '05' | '06' | '02.1' | '02.2' | 'ECG' | 'Sutura' | 'Nebulização';

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  parentage: string;
  sex: Sex;
  diagnosisSuspect: string;
  antibiotics: string[];
  bed: Bed;
  admissionDate: string;
  dischargeDate?: string;
  regulationRegistered: boolean;
  regulationProtocol?: string;
  createdAt: string;
  updatedAt: string;
  status: 'Internado' | 'Alta';
}

export interface FilterOptions {
  startDate: string;
  endDate: string;
  status: 'Todos' | 'Internado' | 'Alta';
  antibiotic: string;
  bed: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
