import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterUserRequest,
  User
} from '../models/user.model';

/**
 * Serviço responsável pela autenticação do usuário
 * Gerencia login, registro, logout e tokens
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL base para endpoints de autenticação */
  private authUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.authUrl = `${environment.apiUrl}/api/${environment.apiVersion}/auth`;
  }

  /**
   * Realiza o login do usuário
   * @param credentials - Email e senha
   * @returns Observable com tokens e dados do usuário
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          // Salva tokens e dados no localStorage
          this.setSession(response);
        })
      );
  }

  /**
   * Registra um novo usuário
   * @param userData - Dados do novo usuário
   * @returns Observable com dados do usuário criado
   */
  register(userData: RegisterUserRequest): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, userData);
  }

  /**
   * Realiza o logout do usuário
   * Limpa localStorage e redireciona para login
   */
  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.userKey);
    localStorage.removeItem(environment.tokenExpiresKey);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se tiver token válido
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(environment.tokenKey);
    const expiresAt = localStorage.getItem(environment.tokenExpiresKey);

    if (!token || !expiresAt) {
      return false;
    }

    // Verifica se o token expirou
    const expiration = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    return now < expiration;
  }

  /**
   * Obtém o papel (role) do usuário atual
   * @returns 'ADM', 'PRD' ou null se não autenticado
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role ?? null;
  }

  /**
   * Verifica se o usuário é administrador
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'ADM';
  }

  /**
   * Obtém o usuário atual do localStorage
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Obtém o token de acesso atual
   */
  getAccessToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Salva a sessão no localStorage após login bem-sucedido
   * @param response - Resposta do endpoint de login
   */
  private setSession(response: LoginResponse): void {
    localStorage.setItem(environment.tokenKey, response.accessToken);
    localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
    localStorage.setItem(environment.tokenExpiresKey, response.expiresAt);
    localStorage.setItem(environment.userKey, JSON.stringify(response.user));
  }
}