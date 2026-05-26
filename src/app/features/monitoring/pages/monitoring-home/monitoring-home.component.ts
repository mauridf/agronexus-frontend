import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-monitoring-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title"><mat-icon>monitor_heart</mat-icon> Monitoramento</h1>
        <p class="page-subtitle">Alertas, certificados e registros climáticos</p>
      </div>
      <div class="hub-grid">
        <mat-card class="hub-card" routerLink="/monitoring/alerts">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>warning</mat-icon></div>
            <h2>Alertas</h2>
            <p>Gerencie alertas de pragas, doenças, clima e maquinário</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">ACESSAR</button></mat-card-actions>
        </mat-card>
        <mat-card class="hub-card" routerLink="/monitoring/certificates">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>verified</mat-icon></div>
            <h2>Certificados</h2>
            <p>Controle certificações orgânicas, FairTrade e outras</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">ACESSAR</button></mat-card-actions>
        </mat-card>
        <mat-card class="hub-card" routerLink="/monitoring/climate">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>cloud</mat-icon></div>
            <h2>Registros Climáticos</h2>
            <p>Acompanhe temperatura, chuva e umidade</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">ACESSAR</button></mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.25rem 0; }
    .page-subtitle { color: #666; font-size: 0.9rem; margin: 0; }
    .hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .hub-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border-radius: 12px;
      &:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); } }
    .hub-icon { text-align: center; margin-bottom: 1rem; mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: #2E7D32; } }
    h2 { font-size: 1.2rem; color: #333; margin: 0 0 0.5rem 0; }
    p { color: #666; font-size: 0.9rem; line-height: 1.5; }
  `]
})
export class MonitoringHomeComponent {}