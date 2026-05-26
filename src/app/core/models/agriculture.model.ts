/**
 * Interface que representa uma cultura (catálogo)
 */
export interface Culture {
  id: string;
  name: string;
  ciclo?: string; // Anual, Perene, Semi-perene
  variedade?: string;
  createdAt: Date;
}

/**
 * Interface que representa uma cultura plantada na fazenda
 */
export interface PlantedCulture {
  id: string;
  farmId: string;
  farmName: string;
  cultureId: string;
  cultureName: string;
  safra: string; // ex: '2024/2025'
  areaPlantadaHa: number;
  dataPlantio?: string;
  dataColheitaPrevista?: string;
  dataColheitaReal?: string;
  produtividadeEsperadaSacasHa?: number;
  produtividadeObtidaSacasHa?: number;
  custoTotal?: number;
  receitaTotal?: number;
  lucro?: number; // calculado: receitaTotal - custoTotal
  createdAt: Date;
}

/**
 * Dados para plantar uma cultura
 */
export interface PlantCultureRequest {
  farmId: string;
  cultureId: string;
  safra: string;
  areaPlantadaHa: number;
  dataPlantio?: string;
  dataColheitaPrevista?: string;
  produtividadeEsperadaSacasHa?: number;
  custoTotal?: number;
}

/**
 * Dados para registrar colheita
 */
export interface HarvestRequest {
  dataColheitaReal: string;
  produtividadeObtidaSacasHa: number;
  receitaTotal: number;
}

/**
 * Dados para criar cultura no catálogo
 */
export interface CultureRequest {
  name: string;
  ciclo?: string;
  variedade?: string;
}