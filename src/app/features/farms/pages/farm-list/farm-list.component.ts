import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FarmService } from '../../../../core/services/farm.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-farm-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent implements OnInit {
  /** Lista de fazendas */
  farms: Farm[] = [];

  /** Estados */
  isLoading = true;
  errorMessage = '';

  constructor(
    private farmService: FarmService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFarms();
  }

  /**
   * Carrega as fazendas do produtor logado
   */
  loadFarms(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Usuário não encontrado.';
      this.isLoading = false;
      return;
    }

    // TODO: Idealmente usar o producerId real
    // Por enquanto usa o userId (o backend deve mapear)
    this.farmService.getFarmsByProducer(user.id).subscribe({
      next: (farms) => {
        this.farms = farms;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar fazendas.';
        this.isLoading = false;
        console.error('Erro:', error);
      }
    });
  }

  /**
   * Remove uma fazenda (soft delete)
   */
  deleteFarm(id: string, name: string): void {
    if (confirm(`Tem certeza que deseja desativar a fazenda "${name}"?`)) {
      this.farmService.deleteFarm(id).subscribe({
        next: () => {
          this.farms = this.farms.filter(f => f.id !== id);
        },
        error: (error) => {
          console.error('Erro:', error);
          alert('Erro ao desativar fazenda.');
        }
      });
    }
  }

  /**
   * Calcula a porcentagem de uso da área
   */
  getAreaUsage(farm: Farm): number {
    if (farm.totalAreaHa === 0) return 0;
    const used = farm.agriculturalAreaHa + farm.vegetationAreaHa + farm.builtAreaHa;
    return Math.round((used / farm.totalAreaHa) * 100);
  }
}