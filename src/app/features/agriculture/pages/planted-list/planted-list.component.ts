import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantedCulture } from '../../../../core/models/agriculture.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-planted-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './planted-list.component.html',
  styleUrls: ['./planted-list.component.scss']
})
export class PlantedListComponent implements OnInit {
  plantedCultures: PlantedCulture[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;
  errorMessage = '';

  constructor(
    private agricultureService: AgricultureService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFarms();
  }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.authService.isAdmin()) {
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          const allFarms: Farm[] = [];
          let completed = 0;
          producers.forEach(p => {
            this.farmService.getFarmsByProducer(p.id).subscribe({
              next: (farms) => {
                allFarms.push(...farms);
                completed++;
                if (completed === producers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                  if (allFarms.length > 0) {
                    this.selectedFarmId = allFarms[0].id;
                    this.loadPlantedCultures();
                  }
                }
              },
              error: () => { completed++; }
            });
          });
        }
      });
    } else {
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          const userProducers = producers.filter(p => p.userId === user.id);
          const allFarms: Farm[] = [];
          let completed = 0;
          userProducers.forEach(p => {
            this.farmService.getFarmsByProducer(p.id).subscribe({
              next: (farms) => {
                allFarms.push(...farms);
                completed++;
                if (completed === userProducers.length) {
                  this.farms = allFarms;
                  this.isLoading = false;
                  if (allFarms.length > 0) {
                    this.selectedFarmId = allFarms[0].id;
                    this.loadPlantedCultures();
                  }
                }
              },
              error: () => { completed++; }
            });
          });
        }
      });
    }
  }

  onFarmChange(): void {
    if (this.selectedFarmId) {
      this.loadPlantedCultures();
    }
  }

  loadPlantedCultures(): void {
    this.isLoading = true;
    this.agricultureService.getPlantedCultures(this.selectedFarmId).subscribe({
      next: (data) => {
        this.plantedCultures = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar culturas plantadas.';
        this.isLoading = false;
      }
    });
  }

  getStatusColor(planted: PlantedCulture): string {
    if (planted.dataColheitaReal) return 'color-green';
    if (planted.dataColheitaPrevista && new Date(planted.dataColheitaPrevista) < new Date()) return 'color-orange';
    return 'color-blue';
  }

  getStatusText(planted: PlantedCulture): string {
    if (planted.dataColheitaReal) return 'Colhido';
    if (planted.dataColheitaPrevista && new Date(planted.dataColheitaPrevista) < new Date()) return 'Atrasado';
    return 'Em andamento';
  }
}