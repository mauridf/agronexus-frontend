import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MonitoringService } from '../../../../core/services/monitoring.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Alert } from '../../../../core/models/monitoring.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {
  alerts: Alert[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;

  constructor(
    private monitoringService: MonitoringService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const load = (producers: any[]) => {
      const all: Farm[] = [];
      if (!producers.length) { this.farms = []; this.isLoading = false; return; }
      let c = 0;
      producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({
        next: (f) => { all.push(...f); c++; if (c === producers.length) { this.farms = all; if (all.length) { this.selectedFarmId = all[0].id; this.loadAlerts(); } else this.isLoading = false; } },
        error: () => { c++; }
      }));
    };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onFarmChange(): void { if (this.selectedFarmId) this.loadAlerts(); }

  loadAlerts(): void {
    this.isLoading = true;
    this.monitoringService.getAlerts(this.selectedFarmId).subscribe({
      next: (d) => { this.alerts = d; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  resolveAlert(alert: Alert): void {
    if (alert.resolvido) return;
    this.monitoringService.resolveAlert(alert.id).subscribe({
      next: () => { alert.resolvido = true; },
      error: () => alert('Erro ao resolver alerta.')
    });
  }

  getNivelColor(nivel: string): string {
    switch (nivel) {
      case 'alto': return 'color-red';
      case 'medio': return 'color-orange';
      case 'baixo': return 'color-green';
      default: return '';
    }
  }
}