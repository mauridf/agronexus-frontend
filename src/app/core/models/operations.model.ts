/**
 * Interface que representa um contrato
 */
export interface Contract {
  id: string;
  farmId: string;
  tipo: string; // Arrendamento, Parceria, Financiamento, etc.
  parteContratante?: string;
  valor: number;
  dataInicio: string;
  dataFim?: string;
  ativo: boolean; // calculado: hoje entre dataInicio e dataFim
  createdAt: Date;
}

/**
 * Interface que representa um custo operacional
 */
export interface OperationalCost {
  id: string;
  farmId: string;
  descricao: string;
  valor: number;
  data: string;
  createdAt: Date;
}

/**
 * Interface que representa uma máquina agrícola
 */
export interface Machine {
  id: string;
  farmId: string;
  descricao: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  valorAproximado?: number;
  createdAt: Date;
}

/**
 * Interface que representa um funcionário
 */
export interface Employee {
  id: string;
  farmId: string;
  name: string;
  cpf?: string;
  funcao?: string;
  salario?: number;
  dataAdmissao?: string;
  dataDemissao?: string;
  empregado: boolean; // calculado: dataDemissao == null
  createdAt: Date;
}

// Requests
export interface ContractRequest {
  farmId: string;
  tipo: string;
  parteContratante?: string;
  valor: number;
  dataInicio: string;
  dataFim?: string;
}

export interface CostRequest {
  farmId: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface MachineRequest {
  farmId: string;
  descricao: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  valorAproximado?: number;
}

export interface EmployeeRequest {
  farmId: string;
  name: string;
  cpf?: string;
  funcao?: string;
  salario?: number;
  dataAdmissao?: string;
}

export interface DismissEmployeeRequest {
  dataDemissao: string;
}