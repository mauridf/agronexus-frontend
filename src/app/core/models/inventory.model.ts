/**
 * Interface que representa um insumo (catálogo)
 */
export interface Input {
  id: string;
  name: string;
  tipo?: string; // fertilizante, semente, defensivo, etc.
  unidadeMedida?: string; // kg, L, ton, saca, unidade
  fornecedor?: string;
  createdAt: Date;
}

/**
 * Interface que representa uma compra de insumo
 */
export interface InputPurchase {
  id: string;
  farmId: string;
  inputId: string;
  quantidade: number;
  valorTotal: number;
  dataCompra: string;
  fornecedor?: string;
  createdAt: Date;
}

/**
 * Interface que representa o estoque de um insumo
 */
export interface InputStock {
  id: string;
  farmId: string;
  inputId: string;
  inputName: string;
  quantidade: number;
  validade?: string;
  vencido: boolean; // calculado: validade < hoje
  createdAt: Date;
}

/**
 * Dados para criar um insumo no catálogo
 */
export interface InputRequest {
  name: string;
  tipo?: string;
  unidadeMedida?: string;
  fornecedor?: string;
}

/**
 * Dados para registrar uma compra de insumo
 */
export interface PurchaseRequest {
  farmId: string;
  inputId: string;
  quantidade: number;
  valorTotal: number;
  dataCompra: string;
  fornecedor?: string;
}