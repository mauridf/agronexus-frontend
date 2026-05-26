/**
 * Interface que representa uma fazenda/propriedade rural
 */
export interface Farm {
  /** ID único da fazenda (GUID) */
  id: string;
  
  /** ID do produtor proprietário */
  producerId: string;
  
  /** Nome da fazenda */
  name: string;
  
  /** Área total em hectares */
  totalAreaHa: number;
  
  /** Área agricultável em hectares */
  agriculturalAreaHa: number;
  
  /** Área de vegetação nativa em hectares */
  vegetationAreaHa: number;
  
  /** Área construída em hectares */
  builtAreaHa: number;
  
  /** Cidade onde a fazenda está localizada (opcional) */
  cidade?: string;
  
  /** Estado (UF, 2 caracteres, opcional) */
  estado?: string;
  
  /** Latitude para geolocalização (opcional, -90 a +90) */
  latitude?: number;
  
  /** Longitude para geolocalização (opcional, -180 a +180) */
  longitude?: number;
  
  /** Endereço completo (opcional) */
  endereco?: string;
  
  /** Inscrição Estadual da fazenda (opcional) */
  inscricaoEstadual?: string;
  
  /** Código do Cadastro Ambiental Rural (opcional) */
  codigoCar?: string;
  
  /** Certificado de Cadastro de Imóvel Rural (opcional) */
  ccir?: string;
  
  /** Fonte de água disponível (opcional) */
  fonteAgua?: string;
  
  /** Data de criação do registro */
  createdAt: Date;
  
  // Campos calculados no frontend
  /** Soma das áreas (calculada no frontend para validação) */
  totalUsedArea?: number;
}

/**
 * Dados para criar ou atualizar uma fazenda
 */
export interface FarmRequest {
  producerId?: string;
  name: string;
  totalAreaHa: number;
  agriculturalAreaHa: number;
  vegetationAreaHa: number;
  builtAreaHa: number;
  endereco?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  inscricaoEstadual?: string;
  codigoCar?: string;
  ccir?: string;
  fonteAgua?: string;
}