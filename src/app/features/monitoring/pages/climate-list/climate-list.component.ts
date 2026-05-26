import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MonitoringService } from '../../../../core/services/monitoring.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Climate } from '../../../../core/models/monitoring.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-climate-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header"><div><button mat-icon-button routerLink="/monitoring"><mat-icon>arrow_back</mat-icon></button><h1 class="page-title"><mat-icon>cloud</mat-icon> Registros Climáticos</h1></div><button mat-raised-button color="primary" routerLink="/monitoring/climate/new"><mat-icon>add</mat-icon> Novo</button></div>
      <mat-form-field appearance="outline" class="farm-select"><mat-label>Fazenda</mat-label><mat-select [(value)]="selectedFarmId" (selectionChange)="onFarmChange()">@for (f of farms; track f.id) { <mat-option [value]="f.id">{{ f.name }}</mat-option> }</mat-select></mat-form-field>
      @if (isLoading) { <div class="loading"><mat-spinner diameter="40"></mat-spinner></div> }
      @if (!isLoading && records.length) {
        <div class="table-container card">
          <table mat-table [dataSource]="records" class="full-width-table">
            <ng-container matColumnDef="data"><th mat-header-cell *matHeaderCellDef>Data</th><td mat-cell *matCellDef="let r">{{ r.data | date:'dd/MM/yyyy' }}</td></ng-container>
            <ng-container matColumnDef="temperatura"><th mat-header-cell *matHeaderCellDef>Temp. (°C)</th><td mat-cell *matCellDef="let r">{{ r.temperatura ?? '-' }}</td></ng-container>
            <ng-container matColumnDef="chuva"><th mat-header-cell *matHeaderCellDef>Chuva (mm)</th><td mat-cell *matCellDef="let r">{{ r.chuvaMm ?? '-' }}</td></ng-container>
            <ng-container matColumnDef="umidade"><th mat-header-cell *matHeaderCellDef>Umidade (%)</th><td mat-cell *matCellDef="let r">{{ r.umidade ?? '-' }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="['data', 'temperatura', 'chuva', 'umidade']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['data', 'temperatura', 'chuva', 'umidade']"></tr>
          </table>
        </div>
      }
      @if (!isLoading && !records.length && selectedFarmId) { <div class="empty card"><p>Nenhum registro climático</p></div> }
    </div>
  `,
  styles: [`.page-container { max-width: 1200px; margin: 0 auto; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; } .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0; } .farm-select { width: 100%; max-width: 400px; margin-bottom: 1.5rem; } .loading { display: flex; justify-content: center; padding: 3rem; } .table-container { overflow-x: auto; } .full-width-table { width: 100%; } .empty { text-align: center; padding: 2rem; color: #999; }`]
})
export class ClimateListComponent implements OnInit {
  records: Climate[] = []; farms: Farm[] = []; selectedFarmId: string = ''; isLoading = true;
  constructor(private monitoring: MonitoringService, private farmService: FarmService, private producerService: ProducerService, private authService: AuthService) {}
  ngOnInit(): void { this.loadFarms(); }
  loadFarms(): void {
    const user = this.authService.getCurrentUser(); if (!user) return;
    const load = (p: any[]) => { const all: Farm[] = []; if (!p.length) { this.farms = []; this.isLoading = false; return; } let c = 0; p.forEach(pp => this.farmService.getFarmsByProducer(pp.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === p.length) { this.farms = all; if (all.length) { this.selectedFarmId = all[0].id; this.loadRecords(); } else this.isLoading = false; } }, error: () => { c++; } })); };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }
  onFarmChange(): void { if (this.selectedFarmId) this.loadRecords(); }
  loadRecords(): void { this.isLoading = true; this.monitoring.getClimateRecords(this.selectedFarmId).subscribe({ next: (d) => { this.records = d; this.isLoading = false; }, error: () => this.isLoading = false }); }
}