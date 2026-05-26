/**
 * Resposta de erro padronizada da API
 */
export interface ApiError {
  message: string;
  errorCode: string;
  errors?: Record<string, string[]>;
}

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Health check
 */
export interface HealthCheck {
  status: string;
  timestamp: string;
}