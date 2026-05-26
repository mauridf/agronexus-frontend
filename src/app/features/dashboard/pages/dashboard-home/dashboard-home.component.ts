import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminDashboard, ProducerDashboard } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, StatCardComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  /** Dados do dashboard (admin ou produtor) */
  adminData: AdminDashboard | null = null;
  producerData: ProducerDashboard | null = null;

  /** Estados */
  isLoading = true;
  errorMessage = '';
  isAdmin = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadDashboard();
  }

  /**
   * Carrega o dashboard baseado no papel do usuário
   */
  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.isAdmin) {
      this.loadAdminDashboard();
    } else {
      this.loadProducerDashboard();
    }
  }

  /**
   * Carrega dashboard do administrador
   */
  private loadAdminDashboard(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.adminData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar dashboard. Tente novamente.';
        this.isLoading = false;
        console.error('Erro dashboard admin:', error);
      }
    });
  }

  /**
   * Carrega dashboard do produtor
   */
  private loadProducerDashboard(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Usuário não encontrado.';
      this.isLoading = false;
      return;
    }

    // TODO: Precisamos do producerId. Por enquanto, usa o userId.
    // Idealmente, o backend retornaria o producerId no login.
    this.dashboardService.getQuickStats(user.id).subscribe({
      next: (data) => {
        this.producerData = data as unknown as ProducerDashboard;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar dashboard. Tente novamente.';
        this.isLoading = false;
        console.error('Erro dashboard produtor:', error);
      }
    });
  }

  /**
   * Formata número grande para exibição
   */
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }
}