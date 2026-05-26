import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FarmService } from '../../../../core/services/farm.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProducerService } from '../../../../core/services/producer.service';
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
    private producerService: ProducerService,
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

    if (this.authService.isAdmin()) {
      // Admin: carrega fazendas de todos os produtores
      // Como não temos endpoint "getAllFarms", carregamos via produtores
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          if (producers.length === 0) {
            this.farms = [];
            this.isLoading = false;
            return;
          }
          
          // Carrega fazendas de cada produtor
          let completedRequests = 0;
          const allFarms: Farm[] = [];
          
          producers.forEach(producer => {
            this.farmService.getFarmsByProducer(producer.id).subscribe({
              next: (farms) => {
                allFarms.push(...farms);
                completedRequests++;
                
                if (completedRequests === producers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                }
              },
              error: () => {
                completedRequests++;
                if (completedRequests === producers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                }
              }
            });
          });
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar fazendas.';
          this.isLoading = false;
        }
      });
    } else {
      // PRD: carrega fazendas dos produtores vinculados ao usuário
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          const userProducers = producers.filter(p => p.userId === user.id);
          
          if (userProducers.length === 0) {
            this.farms = [];
            this.isLoading = false;
            return;
          }

          let completedRequests = 0;
          const allFarms: Farm[] = [];
          
          userProducers.forEach(producer => {
            this.farmService.getFarmsByProducer(producer.id).subscribe({
              next: (farms) => {
                allFarms.push(...farms);
                completedRequests++;
                
                if (completedRequests === userProducers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                }
              },
              error: () => {
                completedRequests++;
                if (completedRequests === userProducers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                }
              }
            });
          });
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar fazendas.';
          this.isLoading = false;
        }
      });
    }
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