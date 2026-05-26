import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interceptor que adiciona o token JWT em todas as requisições autenticadas
 * Exceto para endpoints públicos (auth, health)
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** Lista de paths públicos que NÃO precisam de token */
  private publicPaths = [
    '/auth/login',
    '/auth/register',
    '/health'
  ];

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verifica se a requisição é para um endpoint público
    const isPublic = this.publicPaths.some(path => request.url.includes(path));

    // Se for público, não adiciona token
    if (isPublic) {
      return next.handle(request);
    }

    // Recupera o token do localStorage
    const token = localStorage.getItem(environment.tokenKey);

    // Se tiver token, clona a requisição e adiciona o header Authorization
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    // Se não tiver token, envia a requisição original (o backend retornará 401)
    return next.handle(request);
  }
}