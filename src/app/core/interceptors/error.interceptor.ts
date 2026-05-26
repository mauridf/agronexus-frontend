import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Interceptor global de erros HTTP
 * Trata erros 401 (não autenticado) e 403 (não autorizado)
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Erro 401: Token expirado ou inválido
        if (error.status === 401) {
          // Limpa dados da sessão
          localStorage.removeItem(environment.tokenKey);
          localStorage.removeItem(environment.refreshTokenKey);
          localStorage.removeItem(environment.userKey);
          localStorage.removeItem(environment.tokenExpiresKey);

          // Redireciona para login (apenas se não estiver já na página de login)
          if (!this.router.url.includes('/auth/login')) {
            this.router.navigate(['/auth/login']);
          }
        }

        // Erro 403: Sem permissão (role insuficiente)
        if (error.status === 403) {
          console.warn('Acesso negado: você não tem permissão para acessar este recurso.');
          // Opcional: redirecionar para página de "acesso negado"
        }

        // Propaga o erro para ser tratado pelo componente ou serviço
        return throwError(() => error);
      })
    );
  }
}