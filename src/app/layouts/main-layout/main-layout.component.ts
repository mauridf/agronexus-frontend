import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  /** Se o menu lateral está aberto (mobile) */
  isSidenavOpen = true;

  /** Se o menu lateral está fixo (desktop) */
  isSidenavFixed = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Obtém o nome do usuário logado
   */
  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.email ?? 'Usuário';
  }

  /**
   * Verifica se o usuário é admin
   */
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Alterna o menu lateral (mobile)
   */
  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  /**
   * Realiza logout
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Navega para o perfil (placeholder)
   */
  goToProfile(): void {
    console.log('Perfil - implementar depois');
  }
}