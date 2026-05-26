import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ApiError } from '@models/api.models';

/**
 * Serviço base para todas as chamadas HTTP da aplicação
 * Centraliza a URL base, headers e tratamento de erros
 */
@Injectable({
  providedIn: 'root' // Singleton em toda aplicação
})
export class BaseApiService {
  /** URL base da API (definida no environment) */
  protected baseUrl: string;

  constructor(protected http: HttpClient) {
    // Constrói a URL base: http://localhost:5000/api/v1
    this.baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  }

  /**
   * Requisição GET genérica
   * @param path - Caminho do endpoint (ex: '/producers')
   * @param params - Parâmetros de query opcionais
   * @returns Observable com o tipo especificado
   */
  protected get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Requisição POST genérica
   * @param path - Caminho do endpoint
   * @param body - Corpo da requisição
   * @returns Observable com o tipo especificado
   */
  protected post<T>(path: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Requisição PUT genérica
   * @param path - Caminho do endpoint
   * @param body - Corpo da requisição
   * @returns Observable com o tipo especificado
   */
  protected put<T>(path: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Requisição PATCH genérica
   * @param path - Caminho do endpoint
   * @param body - Corpo da requisição
   * @returns Observable com o tipo especificado
   */
  protected patch<T>(path: string, body: any): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Requisição DELETE genérica
   * @param path - Caminho do endpoint
   * @returns Observable com o tipo especificado
   */
  protected delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Constrói HttpParams a partir de um objeto
   * Remove parâmetros undefined/null
   */
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  /**
   * Tratamento centralizado de erros HTTP
   * Extrai a mensagem de erro do backend ou usa mensagem padrão
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

    if (error.error) {
      // Tenta extrair a mensagem do backend
      const apiError = error.error as ApiError;
      if (apiError.message) {
        errorMessage = apiError.message;
      }
    }

    // Log do erro no console (apenas em desenvolvimento)
    if (!environment.production) {
      console.error('Erro da API:', error);
    }

    return throwError(() => new Error(errorMessage));
  }
}