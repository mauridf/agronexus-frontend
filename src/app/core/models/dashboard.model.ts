/**
 * Dashboard do produtor
 */
export interface ProducerDashboard {
  totalFarms: number;
  totalAreaHa: number;
  totalAgriculturalAreaHa: number;
  totalPlantedAreaHa: number;
  areaUtilizationPercentage: number;
  totalActiveEmployees: number;
  totalMachines: number;
  unresolvedAlerts: number;
  expiringCertificates: number;
}

/**
 * Dashboard financeiro
 */
export interface FinancialDashboard {
  revenueCurrentYear: number;
  operationalCostCurrentYear: number;
  inputCostCurrentYear: number;
  estimatedProfit: number;
  profitMarginPercentage: number;
  monthlyRevenues: MonthlyRevenue[];
  topProfitableCultures: TopProfitableCulture[];
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
  cost: number;
}

export interface TopProfitableCulture {
  cultureName: string;
  safra: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMarginPercentage: number;
}

/**
 * Dashboard da fazenda
 */
export interface FarmDashboard {
  farmId: string;
  farmName: string;
  totalAreaHa: number;
  agriculturalAreaHa: number;
  vegetationAreaHa: number;
  builtAreaHa: number;
  plantedAreaHa: number;
  areaUtilizationPercentage: number;
  currentSafra?: string;
  activeCulturesCount: number;
  activeCultures: ActiveCulture[];
  revenueCurrentSafra: number;
  costCurrentSafra: number;
  profitCurrentSafra: number;
  totalInputsInStock: number;
  expiredInputsCount: number;
  activeEmployees: number;
  unresolvedAlerts: number;
  recentAlerts: RecentAlert[];
  activeContracts: number;
  validCertificates: number;
  expiringCertificates: number;
  lastClimateRecord?: LastClimateRecord;
}

export interface ActiveCulture {
  cultureName: string;
  areaHa: number;
  plantingDate?: string;
  expectedHarvestDate?: string;
  daysUntilHarvest: number;
}

export interface RecentAlert {
  tipo: string;
  nivel: string;
  descricao?: string;
  data: string;
}

export interface LastClimateRecord {
  data: string;
  temperatura?: number;
  chuvaMm?: number;
  umidade?: number;
}

/**
 * Dashboard do administrador
 */
export interface AdminDashboard {
  totalUsers: number;
  totalProducers: number;
  totalFarms: number;
  totalAreaManagedHa: number;
  totalActiveEmployees: number;
  totalUnresolvedAlerts: number;
  topProducers: TopProducer[];
}

export interface TopProducer {
  producerName: string;
  farmCount: number;
  totalAreaHa: number;
}

/**
 * Quick stats (versão leve do dashboard)
 */
export interface QuickStats {
  totalFarms: number;
  totalAreaHa: number;
  areaUtilizationPercentage: number;
  unresolvedAlerts: number;
  expiringCertificates: number;
  totalActiveEmployees: number;
}