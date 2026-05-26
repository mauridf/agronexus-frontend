/**
 * Interface que representa um alerta
 */
export interface Alert {
  id: string;
  farmId: string;
  tipo: string; // praga, doença, clima, maquinário, incendio, invasao
  descricao?: string;
  nivel: AlertLevel; // baixo, medio, alto
  data: string;
  resolvido: boolean;
  createdAt: Date;
}

export type AlertLevel = 'baixo' | 'medio' | 'alto';

/**
 * Interface que representa um certificado
 */
export interface Certificate {
  id: string;
  farmId: string;
  tipo: string; // Orgânico, FairTrade, etc.
  dataEmissao: string;
  dataValidade: string;
  valido: boolean; // calculado: hoje entre dataEmissao e dataValidade
  createdAt: Date;
}

/**
 * Interface que representa um registro climático
 */
export interface Climate {
  id: string;
  farmId: string;
  data: string;
  temperatura?: number;
  chuvaMm?: number;
  umidade?: number;
  createdAt: Date;
}

// Requests
export interface AlertRequest {
  farmId: string;
  tipo: string;
  nivel: AlertLevel;
  data: string;
  descricao?: string;
}

export interface CertificateRequest {
  farmId: string;
  tipo: string;
  dataEmissao: string;
  dataValidade: string;
}

export interface ClimateRequest {
  farmId: string;
  data: string;
  temperatura?: number;
  chuvaMm?: number;
  umidade?: number;
}