/**
 * Interface que representa uma venda de produção
 */
export interface ProductionSale {
  id: string;
  plantedCultureId: string;
  quantidadeVendida: number;
  precoUnitario: number;
  valorTotal: number; // calculado: quantidadeVendida * precoUnitario
  dataVenda: string;
  destino?: string;
  createdAt: Date;
}

/**
 * Dados para registrar uma venda
 */
export interface SaleRequest {
  plantedCultureId: string;
  quantidadeVendida: number;
  precoUnitario: number;
  dataVenda: string;
  destino?: string;
}