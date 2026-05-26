import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege rotas que exigem autenticação
 * Redireciona para login se usuário não estiver autenticado
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redireciona para login se não autenticado
    this.router.navigate(['/auth/login']);
    return false;
  }
}