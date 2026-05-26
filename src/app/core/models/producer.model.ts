/**
 * Interface que representa um produtor rural
 */
export interface Producer {
  /** ID único do produtor (GUID) */
  id: string;
  
  /** ID do usuário vinculado (FK para User) */
  userId: string;
  
  /** Nome completo do produtor */
  name: string;
  
  /** CPF (11 dígitos) ou CNPJ (14 dígitos) formatado */
  cpfCnpj: string;
  
  /** RG do produtor (opcional) */
  rg?: string;
  
  /** Inscrição Estadual (opcional) */
  inscricaoEstadual?: string;
  
  /** Data de nascimento (opcional) */
  dataNascimento?: string; // YYYY-MM-DD
  
  /** Telefone de contato (opcional) */
  telefone?: string;
  
  /** Cidade do produtor (opcional) */
  cidade?: string;
  
  /** Estado (UF, 2 caracteres, opcional) */
  estado?: string;
  
  /** Endereço completo (opcional) */
  endereco?: string;
  
  /** Dados bancários (opcional) */
  dadosBancarios?: string;
  
  /** Cadastro Ambiental Rural (opcional) */
  car?: string;
  
  /** Data de criação do registro */
  createdAt: Date;
}

/**
 * Dados para criar ou atualizar um produtor
 */
export interface ProducerRequest {
  userId?: string;
  name: string;
  cpfCnpj: string;
  rg?: string;
  inscricaoEstadual?: string;
  dataNascimento?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  dadosBancarios?: string;
  car?: string;
}