/**
 * Interface que representa um usuário do sistema
 * Baseado no modelo User da API AgroNexus
 */
export interface User {
  /** ID único do usuário (GUID) */
  id: string;
  
  /** Email do usuário (único no sistema) */
  email: string;
  
  /** Papel do usuário: Administrador ou Produtor */
  role: UserRole;
  
  /** Data do último login (pode ser nulo se nunca logou) */
  lastLogin: Date | null;
  
  /** Data de criação do registro */
  createdAt: Date;
}

/**
 * Papéis de usuário disponíveis no sistema
 */
export type UserRole = 'ADM' | 'PRD';

/**
 * Dados enviados no registro de novo usuário
 */
export interface RegisterUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

/**
 * Dados enviados no login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Resposta do endpoint de login
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO 8601 datetime
  user: User;
}