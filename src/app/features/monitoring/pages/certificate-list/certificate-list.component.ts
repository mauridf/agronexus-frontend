import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MonitoringService } from '../../../../core/services/monitoring.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Certificate } from '../../../../core/models/monitoring.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header"><div><button mat-icon-button routerLink="/monitoring"><mat-icon>arrow_back</mat-icon></button><h1 class="page-title"><mat-icon>verified</mat-icon> Certificados</h1></div><button mat-raised-button color="primary" routerLink="/monitoring/certificates/new"><mat-icon>add</mat-icon> Novo</button></div>
      <mat-form-field appearance="outline" class="farm-select"><mat-label>Fazenda</mat-label><mat-select [(value)]="selectedFarmId" (selectionChange)="onFarmChange()">@for (f of farms; track f.id) { <mat-option [value]="f.id">{{ f.name }}</mat-option> }</mat-select></mat-form-field>
      @if (isLoading) { <div class="loading"><mat-spinner diameter="40"></mat-spinner></div> }
      @if (!isLoading && certs.length) {
        <div class="grid">
          @for (c of certs; track c.id) {
            <mat-card class="card" [class.expired]="!c.valido">
              <mat-card-header><mat-card-title>{{ c.tipo }}</mat-card-title><mat-card-subtitle>Emitido: {{ c.dataEmissao | date:'dd/MM/yyyy' }}</mat-card-subtitle>
                <span class="badge" [class.badge-valid]="c.valido" [class.badge-expired]="!c.valido">{{ c.valido ? 'VÁLIDO' : 'VENCIDO' }}</span>
              </mat-card-header>
              <mat-card-content><p><strong>Validade:</strong> {{ c.dataValidade | date:'dd/MM/yyyy' }}</p></mat-card-content>
            </mat-card>
          }
        </div>
      }
      @if (!isLoading && !certs.length && selectedFarmId) { <div class="empty card"><p>Nenhum certificado</p></div> }
    </div>
  `,
  styles: [`.page-container { max-width: 1200px; margin: 0 auto; } .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; } .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0; } .farm-select { width: 100%; max-width: 400px; margin-bottom: 1.5rem; } .loading { display: flex; justify-content: center; padding: 3rem; } .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem; } .card { border-radius: 12px; &.expired { opacity: 0.6; border-left: 4px solid #D32F2F; } } .badge { position: absolute; top: 1rem; right: 1rem; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; } .badge-valid { background: #E8F5E9; color: #2E7D32; } .badge-expired { background: #FFEBEE; color: #D32F2F; } .empty { text-align: center; padding: 2rem; color: #999; }`]
})
export class CertificateListComponent implements OnInit {
  certs: Certificate[] = []; farms: Farm[] = []; selectedFarmId: string = ''; isLoading = true;
  constructor(private monitoring: MonitoringService, private farmService: FarmService, private producerService: ProducerService, private authService: AuthService) {}
  ngOnInit(): void { this.loadFarms(); }
  loadFarms(): void {
    const user = this.authService.getCurrentUser(); if (!user) return;
    const load = (p: any[]) => { const all: Farm[] = []; if (!p.length) { this.farms = []; this.isLoading = false; return; } let c = 0; p.forEach(pp => this.farmService.getFarmsByProducer(pp.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === p.length) { this.farms = all; if (all.length) { this.selectedFarmId = all[0].id; this.loadCerts(); } else this.isLoading = false; } }, error: () => { c++; } })); };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }
  onFarmChange(): void { if (this.selectedFarmId) this.loadCerts(); }
  loadCerts(): void { this.isLoading = true; this.monitoring.getCertificates(this.selectedFarmId).subscribe({ next: (d) => { this.certs = d; this.isLoading = false; }, error: () => this.isLoading = false }); }
}